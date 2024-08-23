/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import { updateDeleteNotification } from "./ChatOverlay";
import { mutePlayer } from "./MuteManager";
import Settings from "../config";

const Pattern = Java.type("java.util.regex.Pattern");
const LogManager = Java.type("org.apache.logging.log4j.LogManager");
const debugMessage = "§d§m%space%\n§5[HYJANITOR] §7The following message has been removed by %rulesets%§7: \n§r%message%§r"+"\n§d§m%space%";
const muteDebugMessage = "§6§m%space%\n§e[HYJANITOR] §7The following message has been removed because the player is muted§7: \n§r%message%§r"+"\n§6§m%space%";

const logger = LogManager.getLogger("ChatTriggers/HyJanitor");

// Fork of https://www.chattriggers.com/modules/v/ClientsideChat
function getFormattedChat(maxLines) {
    let chat = Client.getChatGUI()?.chatLines;
    let chatLines = [];
    let lines = findBigger(chat,maxLines);
    for (i = 0; i < lines; i++) {
        let line = chat[i]?.func_151461_a()?.func_150260_c(); // getChatComponent()?.getUnformattedText()
        chatLines.push(line);
    }
    return chatLines;
}
function findBigger(chat,maxLines) {
    if(maxLines === null) return chat?.length;
    if(chat?.length < 100) return chat?.length;
    if(maxLines < chat?.length) return maxLines;
}

const arraysEqual = (a, b) => a.every((e, i) => e === b[i]);
let cachedStack = getFormattedChat(100);
register("renderChat", () => {
    if(!Settings.isCheckingClient) return;
    const currentStack = getFormattedChat(100);
    if (!arraysEqual(cachedStack, currentStack)) {
        currentStack.filter(line => !cachedStack.includes(line)).forEach(formatted => {
            check(formatted);
        });
    }
    cachedStack = currentStack;
});

register("chat", (event) => {
    let formatted = ChatLib.getChatMessage(event);
    if(Settings.isCheckingClient) return;
    check(formatted, event);
});

function check(formatted, event = undefined) {
    if(formatted.startsWith(debugMessage.replaceAll("%space%", ChatLib.getChatBreak(" ")).split("%rulesets%")[0]) || formatted.startsWith(muteDebugMessage.replaceAll("%space%", ChatLib.getChatBreak(" ")).split("%rulesets%")[0])) {
        return;
    }
    Settings.receivedMessages = parseInt(Settings.receivedMessages) + 1;
    let rulesets = Settings.rulesets;
    let message = ChatLib.removeFormatting(formatted);
    let playerMessage = message.replace(/^(\[\d{1,4}.?] )?(. )?(\[.+] )?([A-Za-z0-9_]{3,16}: )/g, "");
    let isPlayer = message !== playerMessage;
    if(isPlayer) {
        let name = /^(\[\d{1,4}.?] )?(. )?(\[.+] )?([A-Za-z0-9_]{3,16}: )/g.exec(message)[0];
        name = name.replace(/^(\[\d{1,4}.?] )?(. )?(\[.+] )?/g, "").replace(/: $/g, "");
        if(Settings.mutedPlayers.filter(mutedPlayer => mutedPlayer.name.toLowerCase() === name.toLowerCase()).length !== 0) {
            if(event) {
                cancel(event);
            } else {
                ChatLib.deleteChat(message);
            }
            log("[MUTED] "+formatted);
            Settings.sessionBlocked++;
            Settings.blockedMessages++;
            updateDeleteNotification(formatted, "§6[MUTED]");
            if(Settings.isDebugging) {
                ChatLib.chat(muteDebugMessage.replaceAll("%space%", ChatLib.getChatBreak(" ")).replace("%message%", formatted));
            }
            return;
        }
    }

    let results = [];
    for(let ruleset of rulesets) {
        let result = evaluateRuleset(ruleset, message, isPlayer ? playerMessage : undefined);
        results.push(result.includes(true));
    }
    if(!results.includes(true)) return;

    if(Settings.isBlocking || Settings.isDebugging) {
        if(event) {
            cancel(event);
        } else {
            ChatLib.deleteChat(message)
        }
        let rules = [];
        let mute = false;
        for(let result in results) {
            if(results[result]) {
                if(rulesets[result].type === "PLAYER" && isPlayer) mute = true;
                rules.push("§f\""+rulesets[result].name+"\"");
            }
        }
        log("["+rules.join(", ").removeFormatting()+"] "+formatted);
        Settings.sessionBlocked++;
        Settings.blockedMessages++;    
        if(Settings.isAutomaticallyMuting && mute) {
            let name = /^(\[\d{1,4}.?] )?(. )?(\[.+] )?([A-Za-z0-9_]{3,16}: )/g.exec(message)[0];
            name = name.replace(/^(\[\d{1,4}.?] )?(. )?(\[.+] )?/g, "").replace(/: $/g, "");
            mutePlayer(name, Settings.automaticMuteDuration);
        }
        updateDeleteNotification(formatted, "§f"+rules.join(", "));
    }
    let rules = [];
    for(let result in results) {
        if(results[result]) rulesets[result].removals++;
        Settings.rulesets = rulesets;
        if(results[result]) {
            rules.push("§c\""+rulesets[result].name+"\"");
        }
    }
    if(Settings.isDebugging) {
        ChatLib.chat(debugMessage.replaceAll("%space%", ChatLib.getChatBreak(" ")).replace("%rulesets%", rules.join("§7, ")).replace("%message%", formatted));
    }
};

let lastRegexWarning = 0;
export function evaluateRule(rule, input) {
    let result = false;
    let string = rule.string.toLowerCase();
    let caseInput = input.toLowerCase();
    if(rule.search === "start") {
        result = caseInput.startsWith(string);
    } else if(rule.search === "end") {
        result = caseInput.endsWith(string);
    } else if(rule.search === "contains") {
        result = caseInput.includes(string);
    } else if(rule.search === "equals") {
        result = caseInput === string;
    }
    else if(rule.search === "regex") {
        try {
            result = Pattern.compile(rule.string).matcher(input).find();
        } catch(exception) {
            if(Date.now()-lastRegexWarning > 30000) {
                lastRegexWarning = Date.now();
                ChatLib.chat("&5[HYJANITOR] &7There was an error parsing the following RegEx: &f"+rule.string);
            }
            return false;
        }
    }
    return rule.inverse ? !result : result;
}

export function evaluateRules(ruleset, rules, input, playerInput) {
    let simplified = [];
    for(let rule of rules) {
        if(rule.type === "MATCH") {
            if(ruleset.type === "PLAYER") {
                if(!playerInput) simplified.push(false);
                else simplified.push(evaluateRule(rule, playerInput))
            } else simplified.push(evaluateRule(rule, input))
        } else if(rule.type === "COMPARATOR") {
            simplified.push(rule);
        }
    }
    for(let i = 0; i < simplified.length; i++) {
        let component = simplified[i];
        if(typeof component === "object" && component.operator === "or") {
            let previous = simplified[i-1];
            let next = simplified[i+1];
            simplified.splice(i-1, 3, (previous || next));
            i -= 2;
        }
    }
    for(let i = 0; i < simplified.length; i++) {
        let component = simplified[i];
        if(typeof component === "object" && component.operator === "and") {
            let previous = simplified[i-1];
            let next = simplified[i+1];
            simplified.splice(i-1, 3, (previous && next));
            i -= 2;
        }
    }
    if(simplified.length !== 1) return false;
    return simplified[0];
}

export function evaluateRuleset(ruleset, input, playerInput = undefined) {
    let results = [];
    for(let rule of ruleset.rules) {
        results.push(evaluateRules(ruleset, rule, input, playerInput));
    }
    return results;
}

export function log(string) {
    logger.info(string);
}