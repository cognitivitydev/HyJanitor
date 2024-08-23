/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import { editRule } from "../gui/EditRuleGUI";
import { editRuleset } from "../gui/EditRulesetGUI";
import { openMain } from "../gui/MainGUI";
import { openMutes } from "../gui/MuteGUI";
import { openSettings } from "../gui/SettingsGUI";
import { openRulesets } from "../gui/ViewRulesGUI";
import { exportRulesets } from "../gui/sharing/export/ExportGUI";
import { openImports } from "../gui/sharing/import/ImportGUI";
import { getTime, mutePlayer, unmutePlayer } from "./MuteManager";

register("command", (...args) => {
    if(args[0]) {
        if(args[0].toLowerCase() === "export") {
            if(args.length != 1) {
                ChatLib.chat("&d[HYJANITOR] &7Usage: &5\"/hyjanitor export\"");
                return;
            }
            exportRulesets();
            return;
        }
        if(args[0].toLowerCase() === "import") {
            if(args.length != 1) {
                ChatLib.chat("&d[HYJANITOR] &7Usage: &5\"/hyjanitor import\"");
                return;
            }
            openImports();
            return;
        }
        if(args[0].toLowerCase() === "rule") {
            if(args.length != 3) {
                ChatLib.chat("&d[HYJANITOR] &7Usage: &5\"/hyjanitor rule <ruleset-id> <rule-id>\"");
                ChatLib.chat("&d[HYJANITOR] &7Example: &5\"/hyjanitor rule 1 0\"");
                return;
            }
            editRule(args[1], args[2]);
        }
        if(args[0].toLowerCase() === "ruleset") {
            if(args.length != 2) {
                ChatLib.chat("&d[HYJANITOR] &7Usage: &5\"/hyjanitor ruleset <id>\"");
                ChatLib.chat("&d[HYJANITOR] &7Example: &5\"/hyjanitor ruleset 1\"");
                return;
            }
            editRuleset(args[1]);
            return;
        }
        if(args[0].toLowerCase() === "rulesets") {
            if(args.length != 1) {
                ChatLib.chat("&d[HYJANITOR] &7Usage: &5\"/hyjanitor rulesets\"");
                return;
            }
            openRulesets();
            return;
        }
        if(args[0].toLowerCase() === "mutes") {
            if(args.length != 1) {
                ChatLib.chat("&d[HYJANITOR] &7Usage: &5\"/hyjanitor mutes\"");
                return;
            }
            openMutes();
            return;
        }
        if(args[0].toLowerCase() === "mute") {
            if(args.length == 1) {
                openMutes();
                return;
            }
            if(args.length < 3) {
                ChatLib.chat("&d[HYJANITOR] &7Usage: &5\"/hyjanitor mute <player> <duration>\"");
                ChatLib.chat("&d[HYJANITOR] &7Example: &5\"/hyjanitor mute "+Player.getName()+" 1d\"");
                return;
            }
            let name = args[1];
            let timeArgs = args.slice(2, args.length);
            let duration = 0;
            for(let timeArg of timeArgs) {
                let time = getTime(timeArg);
                if(time == -1) {
                    ChatLib.chat("&d[HYJANITOR] &7Invalid duration: &5\""+timeArg+"\"");
                    return;
                }
                let amount = timeArg.replace(/(m(illi)?s(econds?)?)|(s(ec(ond)?s?)?)|(m(?!o)(in(ute)?s?)?)|(h((ou)?r)?s?)|(d(ays?)?)|(w(eeks?)?)|(mo(nths?)?)|(y(ea)?(rs?)?)$/g, "");
                duration += time*amount;
            }
            mutePlayer(name, duration, true);
            return;
        }
        if(args[0].toLowerCase() === "unmute") {
            if(args.length != 2) {
                ChatLib.chat("&d[HYJANITOR] &7Usage: &5\"/hyjanitor unmute <player>\"");
                ChatLib.chat("&d[HYJANITOR] &7Example: &5\"/hyjanitor unmute "+Player.getName()+"\"");
                return;
            }
            unmutePlayer(args[1], true);
            return;
        }
        if(args[0].toLowerCase() === "settings") {
            if(args.length != 1) {
                ChatLib.chat("&d[HYJANITOR] &7Usage: &5\"/hyjanitor settings\"");
                return;
            }
            openSettings();
            return;
        }
    }
    openMain();
}).setName("hyjanitor").setAliases(["hyj"]);
