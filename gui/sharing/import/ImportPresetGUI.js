/// <reference types="../../../CTAutocomplete" />
/// <reference lib="es2015" />

import Settings from "../../../config";
import {
    AdditiveConstraint,
    animate,
    Animations,
    AspectConstraint,
    CenterConstraint,
    ConstantColorConstraint,
    FillConstraint,
    ScrollComponent,
    SiblingConstraint,
    SubtractiveConstraint,
    UIBlock,
    UIImage,
    UIRoundedRectangle,
    UIText,
    UIWrappedText,
    WindowScreen
} from "../../../../Elementa";
import { colorScheme } from "../../color/ColorScheme";
import { editRuleset } from "../../EditRulesetGUI";

const Color = Java.type("java.awt.Color");
const File = Java.type("java.io.File");
const MessageDigest = Java.type("java.security.MessageDigest");
const StandardCharsets = Java.type("java.nio.charset.StandardCharsets")

let lastUpdated = 0;
let lastRatelimited = false;

export function importPreset(presets = undefined) {
    const window = new UIBlock()
        .setX((0).pixels()).setY((0).pixels())
        .setWidth(new FillConstraint()).setHeight(new FillConstraint())
        .setColor(new Color(0, 0, 0, 0));

    const background = new UIRoundedRectangle(35)
        .setColor(colorScheme.dark.surface.color)
        .setX(new CenterConstraint()).setY(new CenterConstraint())
        .setWidth((80).percent()).setHeight((70).percent())
        .setChildOf(window);

    UIImage.ofFile(new File("./config/ChatTriggers/modules/HyJanitor/icons/g-arrow_back.png"))
        .setColor(colorScheme.dark.primary.color)
        .setX((12).pixels()).setY((12).pixels())
        .setWidth((25).pixels()).setHeight(new AspectConstraint())
        .onMouseEnter((comp) => {
            animate(comp, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.inversePrimary.color));
            });
        })
        .onMouseLeave((comp) => {
            animate(comp, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.primary.color));
            });
        })
        .onMouseClick(() => {
            ChatLib.command("hyjanitor import", true);
        })
        .setChildOf(background);

    new UIText("Import from Presets", false)
        .setColor(colorScheme.dark.surfaceTint.color)
        .setX(new CenterConstraint()).setY((5).percent())
        .setTextScale((2).pixels())
        .setChildOf(background);

    const mainRectangle = new UIRoundedRectangle(10)
        .setColor(colorScheme.dark.surfaceContainer.color)
        .setX(new CenterConstraint()).setY(new AdditiveConstraint((5).percent(), (25).pixels()))
        .setWidth((90).percent()).setHeight((85).percent())
        .setChildOf(background);

    if (presets == undefined) {
        new UIText("Loading Presets...", false)
            .setColor(colorScheme.dark.primary.color)
            .setX(new CenterConstraint()).setY(new SubtractiveConstraint(new CenterConstraint(), (10).pixels()))
            .setTextScale((2).pixels())
            .setChildOf(mainRectangle);

        let progressText = new UIText("0.00s elapsed", false)
            .setColor(colorScheme.dark.outline.color)
            .setX(new CenterConstraint()).setY(new AdditiveConstraint(new CenterConstraint(), (10).pixels()))
            .setTextScale((1.5).pixels())
            .setChildOf(mainRectangle);

        const gui = new JavaAdapter(WindowScreen, {
            init() {
                window.setChildOf(this.getWindow());
            }
        });
        gui.init();
        GuiHandler.openGui(gui);
        let starting = Date.now()
        let finished = false;
        new Thread(() => {
            if (Date.now() - lastUpdated < 600000) {
                importPreset({rateLimited: lastRatelimited, useCache: true, contents: []});
                return;
            }
            let contents = checkDir();
            finished = true;
            importPreset(contents);
        }).start();
        let timerThread = new Thread(() => {
            while (!finished) {
                progressText.setText(((Date.now() - starting) / 1000).toFixed(2) + "s elapsed")
                timerThread.sleep(1);
            }
        })
        timerThread.start();
        return;
    }
    const presetContainer = new ScrollComponent()
        .setX(new CenterConstraint()).setY((10).pixels())
        .setWidth((95).percent()).setHeight((95).percent())
        .setChildOf(mainRectangle);

    if (presets.rateLimited || presets.useCache) {
        if (presets.rateLimited) {
            const rateLimitRectangle = new UIRoundedRectangle(12)
                .setColor(colorScheme.dark.warnContainer.color)
                .setX(new CenterConstraint()).setY(new SiblingConstraint(4))
                .setWidth((90).percent()).setHeight((40).pixels())
                .setChildOf(presetContainer);

            new UIText("GitHub ratelimit reached. Results may be outdated or hidden.", false)
                .setColor(colorScheme.dark.warn.color)
                .setX(new CenterConstraint()).setY(new CenterConstraint())
                .setTextScale((1.5).pixels())
                .setChildOf(rateLimitRectangle);
        }

        const refreshRectangle = new UIRoundedRectangle(12)
            .setColor(colorScheme.dark.secondaryContainer.color)
            .setX(new CenterConstraint()).setY(new SiblingConstraint(4))
            .setWidth((50).percent()).setHeight((30).pixels())
            .onMouseClick(() => {
                lastRatelimited = false;
                lastUpdated = 0;
                importPreset();
            })
            .setChildOf(presetContainer);

        UIImage.ofFile(new File("./config/ChatTriggers/modules/HyJanitor/icons/g-restart.png"))
            .setColor(colorScheme.dark.secondary.color)
            .setX((4).pixels()).setY(new CenterConstraint())
            .setWidth((17).pixels()).setHeight(new AspectConstraint())
            .setChildOf(refreshRectangle);

        new UIText("Refresh cached presets", false)
            .setColor(colorScheme.dark.secondary.color)
            .setX(new CenterConstraint()).setY(new CenterConstraint())
            .setTextScale((1.5).pixels())
            .setChildOf(refreshRectangle);

        if (!presets.useCache) lastRatelimited = true;

        let directory = new File("./config/ChatTriggers/modules/HyJanitor/settings/repo");
        let files = directory.listFiles();
        presets = {rateLimited: true, contents: []};
        if (directory.exists()) {
            presets.contents = presets.contents.concat(files.map(file => JSON.parse(FileLib.read(file.getAbsolutePath()))))
        }
    } else {
        lastUpdated = Date.now();
        lastRatelimited = false;
        FileLib.deleteDirectory("./config/ChatTriggers/modules/HyJanitor/settings/repo");
    }
    presets.contents = presets.contents.sort((a, b) => b.value.updated - a.value.updated);
    for (let i in presets.contents) {
        let preset = presets.contents[i].value;
        let url = presets.contents[i].url;
        let hash = hashString(JSON.stringify(presets.contents[i]));
        if (!presets.rateLimited) {
            FileLib.write("./config/ChatTriggers/modules/HyJanitor/settings/repo/" + hash + ".json", JSON.stringify(presets.contents[i]), true);
        }
        let installed = Settings.rulesets.filter(ruleset => ruleset.preset?.url == url).length > 0;

        let presetRectangle = new UIRoundedRectangle(12)
            .setColor(colorScheme.dark.surfaceContainerHigh.color)
            .setX(new CenterConstraint()).setY(new SiblingConstraint(8))
            .setWidth((100).percent()).setHeight((40).percent())
            .setChildOf(presetContainer);

        new UIWrappedText(preset.content.name, false, null, false, true)
            .setColor(colorScheme.dark.onPrimaryContainer.color)
            .setX((16).pixels()).setY((8).pixels())
            .setWidth((40).percent()).setHeight((20).pixels())
            .setTextScale((2).pixels())
            .setChildOf(presetRectangle);

        new UIWrappedText(preset.author, false, null, false, true)
            .setColor(colorScheme.dark.primary.color)
            .setX((16).pixels()).setY((28).pixels())
            .setWidth((40).percent()).setHeight((15).pixels())
            .setTextScale((1.5).pixels())
            .setChildOf(presetRectangle);

        new UIWrappedText("Created " + relative(preset.created) + " ago", false, null, false, true)
            .setColor(colorScheme.dark.secondary.color)
            .setX((16).pixels()).setY((51).pixels())
            .setWidth((40).percent()).setHeight((15).pixels())
            .setTextScale((1.5).pixels())
            .setChildOf(presetRectangle);

        new UIWrappedText("Updated " + relative(preset.updated) + " ago", false, null, false, true)
            .setColor(colorScheme.dark.secondary.color)
            .setX((16).pixels()).setY((70).pixels())
            .setWidth((40).percent()).setHeight((15).pixels())
            .setTextScale((1.5).pixels())
            .setChildOf(presetRectangle);

        new UIWrappedText(preset.description, false, null, false, true)
            .setColor(colorScheme.dark.onSurfaceVariant.color)
            .setX((45).percent()).setY(new CenterConstraint())
            .setWidth((48).percent()).setHeight((80).percent())
            .setTextScale((1.5).pixels())
            .setChildOf(presetRectangle);

        let downloadRectangle = new UIRoundedRectangle(6)
            .setColor(colorScheme.dark.successContainer.color)
            .setX((16).pixels(true)).setY((8).pixels(true))
            .setWidth((24).pixels()).setHeight(new AspectConstraint())
            .onMouseEnter((comp) => {
                if (installed) return;
                animate(comp, (animation) => {
                    animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onSuccess.color));
                });
            })
            .onMouseLeave((comp) => {
                if (installed) return;
                animate(comp, (animation) => {
                    animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.successContainer.color));
                });
            })
            .onMouseClick(() => {
                if (installed) return;
                let json = preset.content;
                json.preset = {author: preset.author, lastUpdate: preset.updated, url: url};
                editRuleset(Settings.rulesets.push(json) - 1);
                Settings.saveRulesets();
            })
            .setChildOf(presetRectangle);

        let downloadIcon = UIImage.ofFile(new File("./config/ChatTriggers/modules/HyJanitor/icons/" + (installed ? "g-download_done.png" : "g-download.png")))
            .setColor(colorScheme.dark.success.color)
            .setX(new CenterConstraint()).setY(new CenterConstraint())
            .setWidth((20).pixels()).setHeight(new AspectConstraint())
            .setChildOf(downloadRectangle);

        if (installed) {
            downloadRectangle.setColor(colorScheme.dark.primaryContainer.color);
            downloadIcon.setColor(colorScheme.dark.primary.color);
        }
    }

    const gui = new JavaAdapter(WindowScreen, {
        init() {
            window.setChildOf(this.getWindow());
        }
    });
    gui.init();
    GuiHandler.openGui(gui);
}

function relative(start) {
    let now = Date.now();
    let time = now - start;

    let years = Math.floor(time / 31536000000);
    if (years > 0) {
        return years + " year" + (years != 1 ? "s" : "");
    }
    let months = Math.floor(time / 2592000000);
    if (months > 0) {
        return months + " month" + (months != 1 ? "s" : "");
    }
    let days = Math.floor(time / 86400000);
    if (days > 0) {
        return days + " day" + (days != 1 ? "s" : "");
    }
    let hours = Math.floor(time / 3600000);
    if (hours > 0) {
        return hours + " hour" + (hours != 1 ? "s" : "");
    }
    let minutes = Math.floor(time / 60000);
    if (minutes > 0) {
        return minutes + " minute" + (minutes != 1 ? "s" : "");
    }
    let seconds = Math.floor(time / 1000);
    if (seconds > 0) {
        return seconds + " second" + (seconds != 1 ? "s" : "");
    }
    return Math.max(0, time) + " millsecond" + (time != 1 ? "s" : "");
}

function checkDir(directory = "") {
    let rateLimited = false;
    const dirContents = [];
    let api;
    try {
        api = JSON.parse(FileLib.getUrlContent("https://api.github.com/repos/cognitivitydev/HyJanitorRepo/contents/" + directory));
    } catch (exception) {
        rateLimited = true;
    }
    if (!rateLimited && api) {
        for (let file of api) {
            if (file.type === "file") {
                try {
                    let fileContent = JSON.parse(FileLib.getUrlContent(file.url)).content.replaceAll("\n", "");
                    dirContents.push({url: file.url, value: JSON.parse(FileLib.decodeBase64(fileContent))});
                } catch (exception) {
                    rateLimited = true;
                    console.warn(exception);
                }
            } else if (file.type === "dir") {
                let directory = checkDir(file.path);
                if (directory.rateLimited) rateLimited = true;
                for (let inDirectory of directory.contents) {
                    dirContents.push(inDirectory);
                }
            }
        }
    }
    return {rateLimited: rateLimited, contents: dirContents};
}

function hashString(input) {
    let hash = MessageDigest.getInstance("SHA-256").digest(new java.lang.String(input).getBytes(StandardCharsets.UTF_8));
    let str = "";
    for (let b of hash) {
        let hex = java.lang.Integer.toHexString(0xff & b);
        if (hex.length == 1) {
            str = str + '0';
        }
        str = str + hex;
    }
    return str;
}