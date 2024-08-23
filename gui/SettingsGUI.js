/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import Settings from "../config";
import {
    UIBlock,
    animate,
    Animations,
    ConstantColorConstraint,
    WindowScreen,
    UIText,
    CenterConstraint,
    SubtractiveConstraint,
    AdditiveConstraint,
    UIRoundedRectangle,
    FillConstraint,
    UIImage,
    SiblingConstraint,
    CramSiblingConstraint,
    AspectConstraint,
    UIContainer,
    ScrollComponent,
    UIWrappedText,
    UITextInput,
    ChildBasedSizeConstraint
} from "../../Elementa";
import { colorScheme } from "./color/ColorScheme";
import { getTime, timeLength } from "../chat/MuteManager";
import { Button } from "./components/Button";
import { Switch } from "./components/Switch";

const Color = Java.type("java.awt.Color");
const Desktop = Java.type("java.awt.Desktop");
const File = Java.type("java.io.File");
const URI = Java.type("java.net.URI");

const updates = {
    LATEST: {
        title: "§lUp to Date",
        description: "Current: %current%   Latest: %latest%",
        backgroundColor: colorScheme.dark.successContainer.color,
        titleColor: colorScheme.dark.onSuccessContainer.color,
        descriptionColor: colorScheme.dark.success.color
    },
    GITHUB: {
        title: "§lNew Version on GitHub",
        description: "A new version will be available on ChatTriggers shortly.",
        backgroundColor: colorScheme.dark.successContainer.color,
        titleColor: colorScheme.dark.onSuccessContainer.color,
        descriptionColor: colorScheme.dark.success.color
    },
    CHATTRIGGERS: {
        title: "§lNew Version Available",
        description: "Current: %current%   Latest: %latest%",
        backgroundColor: colorScheme.dark.warnContainer.color,
        titleColor: colorScheme.dark.onWarnContainer.color,
        descriptionColor: colorScheme.dark.warn.color
    },
    ERROR: {
        title: "§lFailed to Check for Updates",
        description: "Current: %current%",
        backgroundColor: colorScheme.dark.errorContainer.color,
        titleColor: colorScheme.dark.onErrorContainer.color,
        descriptionColor: colorScheme.dark.error.color
    },
    CHECKING: {
        title: "§lChecking for Updates...",
        description: "Current: %current%",
        backgroundColor: colorScheme.dark.onSecondary.color,
        titleColor: colorScheme.dark.onSecondaryContainer.color,
        descriptionColor: colorScheme.dark.secondary.color
    }
}

const settings = [
    {
        name: "Block Messages",
        icon: "g-power.png",
        description: "Toggles the removal of messages for all of your rulesets.",
        value: "isBlocking"
    },
    {
        name: "Check Client Messages",
        icon: "g-terminal.png",
        description: "Reads and blocks messages sent by your mods. May cause some issues.",
        value: "isCheckingClient"
    },
    {
        name: "Show Debug Messages",
        icon: "g-article.png",
        description: "Highlights messages that are removed by your rulesets.",
        value: "isDebugging"
    },
    {
        name: "Automatically Mute Players",
        icon: "g-rule.png",
        description: "Automatically mutes players for a specified length if they send a flagged message.",
        value: "isAutomaticallyMuting"
    },
    {
        name: "Mute Duration",
        icon: "g-auto_delete.png",
        description: "Changes the duration players are muted for when they send a flagged message.",
        buttonLabel: "Edit",
        onClick: () => {
            muteWindow.unhide(true);
        }
    },
    {
        name: "Show Mute Toast",
        icon: "g-comments_disabled.png",
        description: "Shows a notification on your screen when a player is muted.",
        value: "muteToastEnter"
    },
    {
        name: "Show Unmute Toast",
        icon: "g-comment.png",
        description: "Shows a notification on your screen when a player is unmuted.",
        value: "muteToastLeave"
    },
    {
        name: "Show Removal Icon",
        icon: "g-delete.png",
        description: "Shows an icon below chat when a message is removed. Hover to reveal recently deleted messages.",
        value: "showChatIcon"
    },
    {
        name: "Reveal Tutorials",
        icon: "g-info.png",
        description: "Enables all tutorials inside of the menus.",
        buttonLabel: "Reveal",
        onClick: () => {
            Settings.resetTutorials();
            openSettings();
        }
    }
];

const muteWindow = new UIBlock()
    .setColor(new Color(0, 0, 0, 0.5))
    .setX((0).pixels())
    .setY((0).pixels())
    .setWidth((100).percent())
    .setHeight((100).percent());

export function openSettings() {
    muteWindow.clearChildren();

    const window = new UIBlock()
        .setX((0).pixels())
        .setY((0).pixels())
        .setWidth(new FillConstraint())
        .setHeight(new FillConstraint())
        .setColor(new Color(0, 0, 0, 0));

    const background = new UIRoundedRectangle(35)
        .setColor(colorScheme.dark.surface.color)
        .setX(new CenterConstraint())
        .setY(new CenterConstraint())
        .setWidth(new SubtractiveConstraint((100).percent(), (50).pixels()))
        .setHeight(new SubtractiveConstraint((100).percent(), (50).pixels()))
        .setChildOf(window);

    UIImage.ofFile(new File("./config/ChatTriggers/modules/HyJanitor/icons/g-arrow_back.png"))
        .setColor(colorScheme.dark.primary.color)
        .setX((12).pixels())
        .setY((12).pixels())
        .setWidth((25).pixels())
        .setHeight(new AspectConstraint())
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
            ChatLib.command("hyjanitor", true);
        })
        .setChildOf(background);

    new UIText("§lHyJanitor")
        .setColor(colorScheme.dark.primary.color)
        .setX(new CenterConstraint())
        .setY((5).percent())
        .setTextScale((3).pixels())
        .setChildOf(background);

    new UIText("Settings", false)
        .setColor(colorScheme.dark.inverseOnSurface.color)
        .setX(new CenterConstraint())
        .setY(new AdditiveConstraint((5).percent(), (30).pixels()))
        .setTextScale((2).pixels())
        .setChildOf(background);

    const updateRectangle = new UIRoundedRectangle(10)
        .setColor(updates.CHECKING.backgroundColor)
        .setX((5).percent())
        .setY((3.5).percent())
        .setWidth((33).percent())
        .setHeight((14).percent())
        .onMouseClick(() => {
            Desktop.getDesktop().browse(new URI("https://github.com/cognitivitydev/HyJanitor/tree/main"));
        })
        .setChildOf(background);

    const updateTitle = new UIText(updates.CHECKING.title, false)
        .setColor(updates.CHECKING.titleColor)
        .setX(new CenterConstraint())
        .setY((20).percent())
        .setTextScale((1.5).pixels())
        .setChildOf(updateRectangle);

    const updateDescription = new UIWrappedText(updates.CHECKING.description.replace("%current%", "v"+Settings.version), false, null, true)
        .setColor(updates.CHECKING.descriptionColor)
        .setX(new CenterConstraint())
        .setY(new AdditiveConstraint(new SiblingConstraint(), (8).pixels()))
        .setWidth((90).percent())
        .setHeight(new FillConstraint())
        .setTextScale((1.5).pixels())
        .setChildOf(updateRectangle);

    const mainRectangle = new UIRoundedRectangle(10)
        .setColor(colorScheme.dark.surfaceContainer.color)
        .setX(new CenterConstraint())
        .setY((20).percent())
        .setWidth((90).percent())
        .setHeight((75).percent())
        .setChildOf(background);

    const scrollContainer = new UIContainer()
        .setX(new CenterConstraint())
        .setY((8).pixels())
        .setWidth((100).percent())
        .setHeight(new SubtractiveConstraint((100).percent(), (64).pixels()))
        .setChildOf(mainRectangle);

    const settingsContainer = new ScrollComponent()
        .setX(new CenterConstraint())
        .setY(new CenterConstraint())
        .setWidth(new SubtractiveConstraint((100).percent(), (16).pixels()))
        .setHeight((100).percent())
        .setChildOf(scrollContainer);

    const slider = new UIBlock()
        .setColor(colorScheme.dark.outline.color)
        .setX(new SubtractiveConstraint((100).percent(), (8).pixels()))
        .setWidth((2).pixels())
        .setChildOf(scrollContainer);

    settingsContainer.setScrollBarComponent(slider, true, false);

    settings.forEach(setting => {
        let container = new UIContainer()
            .setX(new CenterConstraint())
            .setY(new CramSiblingConstraint(12))
            .setWidth((100).percent())
            .setHeight((25).percent())
            .setChildOf(settingsContainer);

        let rectangle = new UIRoundedRectangle(15)
            .setColor(colorScheme.dark.surfaceContainerHigh.color)
            .setX(new CenterConstraint())
            .setY(new CenterConstraint())
            .setWidth((80).percent())
            .setHeight((100).percent())
            .setChildOf(container);

        let iconContainer = new UIContainer()
            .setX((0).pixels())
            .setY((0).pixels())
            .setWidth(new AspectConstraint())
            .setHeight((100).percent())
            .setChildOf(rectangle);

        let icon = UIImage.ofFile(new File("./config/ChatTriggers/modules/HyJanitor/icons/"+setting.icon))
            .setColor(colorScheme.dark.surfaceTint.color)
            .setX(new CenterConstraint())
            .setY(new CenterConstraint())
            .setWidth(new AspectConstraint())
            .setHeight((50).percent())
            .setChildOf(iconContainer);

        let textContainer = new UIContainer()
            .setX(new SiblingConstraint())
            .setY(new CenterConstraint())
            .setWidth(new FillConstraint())
            .setHeight(new ChildBasedSizeConstraint())
            .setChildOf(rectangle);

        let title = new UIText(setting.name, false)
            .setColor(colorScheme.dark.onSurface.color)
            .setX((0).pixels())
            .setY((0).pixels())
            .setTextScale((2).pixels())
            .setChildOf(textContainer);

        let description = new UIWrappedText(setting.description, false, null, false, true, 9, "...")
            .setColor(colorScheme.dark.onSurfaceVariant.color)
            .setX((0).pixels())
            .setY(new SiblingConstraint(2))
            .setWidth((100).percent())
            .setTextScale((1.5).pixels())
            .setChildOf(textContainer);

        let buttonContainer = new UIContainer()
            .setX((0).pixels(true))
            .setY((0).pixels())
            .setWidth((15).percent())
            .setHeight((100).percent())
            .setChildOf(rectangle);

        if(typeof setting.value === "string") {
            new Switch(Settings[setting.value])
                .setX(new CenterConstraint())
                .setY(new CenterConstraint())
                .setWidth((54).pixels())
                .setHeight((24).pixels())
                .onButtonClick((button, status) => {
                    Settings[setting.value] = status;
                })
                .setChildOf(buttonContainer);
        } else {
            new Button()
                .setText(setting.buttonLabel, 1.5, false)
                .setBackgroundColor(colorScheme.dark.primaryContainer.color)
                .setLabelColor(colorScheme.dark.primary.color)
                .setX(new CenterConstraint())
                .setY(new CenterConstraint())
                .setWidth((80).percent())
                .setHeight((30).pixels())
                .onMouseEnter((button) => {
                    button.animateBackgroundColor(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onPrimary.color));
                })
                .onMouseLeave((button) => {
                    button.animateBackgroundColor(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.primaryContainer.color));
                })
                .onMouseClick(() => {
                    setting.onClick();
                })
                .setChildOf(buttonContainer);
        }
    });
    let githubButton = new Button(new File("./config/ChatTriggers/modules/HyJanitor/icons/github-mark_white.png"))
        .setText("GitHub", 1.5, false)
        .setBackgroundColor(new Color(24/255, 20/255, 20/255))
        .setX(new SubtractiveConstraint(new CenterConstraint(), (12).percent()))
        .setY((8).pixels(true))
        .setWidth((18).percent())
        .setHeight((40).pixels())
        .setIconSize((24).pixels())
        .onMouseEnter((button) => {
            button.setText("§nGitHub");
        })
        .onMouseLeave((button) => {
            button.setText("GitHub");
        })
        .onMouseClick(() => {
            Desktop.getDesktop().browse(new URI("https://github.com/cognitivitydev/HyJanitor/"));
        })
        .setChildOf(mainRectangle);


    let discordButton = new Button(new File("./config/ChatTriggers/modules/HyJanitor/icons/discord-mark_white.png"))
        .setText("Discord", 1.5, false)
        .setBackgroundColor(new Color(88/255, 101/255, 242/255))
        .setX(new AdditiveConstraint(new CenterConstraint(), (12).percent()))
        .setY((8).pixels(true))
        .setWidth((18).percent())
        .setHeight((40).pixels())
        .setIconSize((24).pixels())
        .onMouseEnter((button) => {
            button.setText("§nDiscord");
        })
        .onMouseLeave((button) => {
            button.setText("Discord");
        })
        .onMouseClick(() => {
            Desktop.getDesktop().browse(new URI("https://github.com/cognitivitydev/HyJanitor/"));
        })
        .setChildOf(mainRectangle);

    new UIText("Made by cognitivity", false)
        .setColor(colorScheme.dark.inverseOnSurface.color)
        .setX((new CenterConstraint()))
        .setY((8).pixels(true))
        .setChildOf(background);

    muteWindow.setChildOf(window);

    const muteBackground = new UIRoundedRectangle(35)
        .setColor(colorScheme.dark.surface.color)
        .setX(new CenterConstraint())
        .setY(new CenterConstraint())
        .setWidth((60).percent())
        .setHeight((45).percent())
        .setChildOf(muteWindow);

    const closeMute = UIImage.ofFile(new File("./config/ChatTriggers/modules/HyJanitor/icons/g-close.png"))
        .setColor(colorScheme.dark.primary.color)
        .setX((16).pixels())
        .setY((8).pixels())
        .setWidth((24).pixels())
        .setHeight(new AspectConstraint())
        .onMouseEnter((comp) => {
            animate(comp, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onPrimary.color));
            });
        })
        .onMouseLeave((comp) => {
            animate(comp, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.primary.color));
            });
        })
        .onMouseClick(() => {
            muteWindow.hide(true);
        })
        .setChildOf(muteBackground);

    new UIText("Edit Mute Duration")
        .setColor(colorScheme.dark.surfaceTint.color)
        .setX(new CenterConstraint())
        .setY((5).percent())
        .setTextScale((1.5).pixels())
        .setChildOf(muteBackground);

    const inputOutline = new UIRoundedRectangle(10)
        .setColor(colorScheme.dark.outline.color)
        .setX(new CenterConstraint())
        .setY((20).percent())
        .setWidth((40).percent())
        .setHeight((25).pixels())
        .setChildOf(muteBackground);

    const inputRectangle = new UIRoundedRectangle(10)
        .setColor(colorScheme.dark.surface.color)
        .setX(new CenterConstraint())
        .setY(new CenterConstraint())
        .setWidth(new SubtractiveConstraint((100).percent(), (2).pixels()))
        .setHeight(new SubtractiveConstraint((100).percent(), (2).pixels()))
        .onMouseClick(() => {
            inputText.grabWindowFocus();
        })
        .setChildOf(inputOutline);

    const inputLabelBackground = new UIBlock()
        .setColor(colorScheme.dark.surface.color)
        .setX((16).pixels())
        .setY((-2).pixels())
        .setWidth(new AdditiveConstraint(new ChildBasedSizeConstraint(), (3).pixels()))
        .setHeight(new ChildBasedSizeConstraint())
        .setChildOf(inputOutline);

    new UIText("Duration")
        .setColor(colorScheme.dark.onSurfaceVariant.color)
        .setX((2).pixels())
        .setY((0).pixels())
        .setChildOf(inputLabelBackground);

    const inputText = new UITextInput()
        .setColor(colorScheme.dark.onSurface.color)
        .setTextScale((1.5).pixels())
        .onKeyType(() => {
            let input = inputText.getText().trim();
            let split = input.split(" ");
            let duration = 0;
            for(let word of split) {
                let time = getTime(word);
                if(time == -1) {
                    errorTitle.unhide(true);
                    errorDescription.unhide(true);
                    return;
                }
                let amount = word.replace(/(m(illi)?s(econds?)?)|(s(ec(ond)?s?)?)|(m(?!o)(in(ute)?s?)?)|(h((ou)?r)?s?)|(d(ays?)?)|(w(eeks?)?)|(mo(nths?)?)|(y(ea)?(rs?)?)$/g, "");
                duration += time*amount;
            }
            errorTitle.hide(true);
            errorDescription.hide(true);
            Settings.automaticMuteDuration = duration;
        })
        .setChildOf(inputRectangle);
    inputText.setText(timeLength(Settings.automaticMuteDuration));
    inputText.setX((8).pixels())
        .setY(new AdditiveConstraint(new CenterConstraint(), (2).pixels()))
        .setWidth(new SubtractiveConstraint(new FillConstraint(), (12).pixels()))
        .setHeight((15).pixels());


    const errorTitle = new UIText("Invalid Format!")
        .setColor(colorScheme.dark.error.color)
        .setX(new CenterConstraint())
        .setY(new AdditiveConstraint((20).percent(), (45).pixels()))
        .setTextScale((1.5).pixels())
        .setChildOf(muteBackground);

    const errorDescription = new UIText("Durations: ms, s, m, h, d, w, mo, y")
        .setColor(colorScheme.dark.error.color)
        .setX(new CenterConstraint())
        .setY(new AdditiveConstraint((20).percent(), (60).pixels()))
        .setChildOf(muteBackground);

    errorTitle.hide(true);
    errorDescription.hide(true);

    const suggestions = ["5m", "15m", "30m", "1h", "3h", "6h", "12h", "1d", "3d", "1w"];

    const suggestionContainer = new UIContainer()
        .setX(new CenterConstraint())
        .setY((60).percent())
        .setWidth((75).percent())
        .setHeight((30).percent())
        .setChildOf(muteBackground);

    for(let i in suggestions) {
        let suggestion = suggestions[i];
        let suggestionRectangle = new UIRoundedRectangle(5)
            .setColor(colorScheme.dark.warnContainer.color)
            .setX(new AdditiveConstraint(new CramSiblingConstraint(16), (8).pixels()))
            .setY(new CramSiblingConstraint(4))
            .setWidth(new SubtractiveConstraint((20).percent(), (24).pixels()))
            .setHeight(new SubtractiveConstraint((50).percent(), (4).pixels()))
            .onMouseEnter(() => {
                animate(suggestionText, (animation) => {
                    animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onWarnContainer.color));
                });
            })
            .onMouseLeave(() => {
                animate(suggestionText, (animation) => {
                    animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.warn.color));
                });
            })
            .onMouseClick(() => {
                inputText.setText(suggestion);
                let duration = 0;
                let time = getTime(suggestion);
                let amount = suggestion.replace(/(m(illi)?s(econds?)?)|(s(ec(ond)?s?)?)|(m(?!o)(in(ute)?s?)?)|(h((ou)?r)?s?)|(d(ays?)?)|(w(eeks?)?)|(mo(nths?)?)|(y(ea)?(rs?)?)$/g, "");
                duration += time*amount;
                Settings.automaticMuteDuration = duration;
            })
            .setChildOf(suggestionContainer);

        let suggestionText = new UIText(suggestion)
            .setColor(colorScheme.dark.warn.color)
            .setX(new CenterConstraint())
            .setY(new CenterConstraint())
            .setTextScale((1.5).pixels())
            .setChildOf(suggestionRectangle);
    }

    muteWindow.hide(true);

    const gui = new JavaAdapter(WindowScreen, {
        init() {
            window.setChildOf(this.getWindow());
        }
    });
    gui.init();
    GuiHandler.openGui(gui);

    new Thread(() => {
        let update = checkForUpdates();
        let status = undefined;
        let latest = undefined;
        if(!update.latest.git || !update.latest.ct) {
            status = updates.ERROR;
        } else if(update.current == update.latest.git) {
            status = updates.LATEST;
            latest = update.current;
        } else if(update.current == update.latest.ct) {
            if(ct != git) {
                status = updates.GITHUB;
                latest = update.latest.git;
            } else {
                status = updates.LATEST;
                latest = update.current;
            }
        } else if(update.latest.git != update.latest.ct) {
            status = updates.GITHUB;
            latest = update.latest.git;
        } else {
            status = updates.CHATTRIGGERS;
            latest = update.latest.ct;
        }
        let description = status.description.replace("%current%", update.current).replace("%latest%", latest);
        updateRectangle.setColor(status.backgroundColor);
        updateTitle.setText(status.title).setColor(status.titleColor);
        updateDescription.setText(description).setColor(status.descriptionColor);
    }).start();
}

function checkForUpdates() {
    let ct = undefined;
    let git = undefined;

    try {
        ctApi = JSON.parse(FileLib.getUrlContent("https://chattriggers.com/api/modules/HyJanitor"));
        ct = "v"+ctApi.releases[0]?.releaseVersion;

        gitApi = JSON.parse(FileLib.getUrlContent("https://api.github.com/repos/cognitivitydev/HyJanitor/releases"));
        git = gitApi[0]?.name;

        return {
            current: "v"+Settings.version,
            latest: {
                ct: ct,
                git: git
            }
        };
    } catch(exception) {
        console.error(exception)
        return {
            current: "v"+Settings.version,
            latest: {
                ct: undefined,
                git: undefined
            }
        };
    }
}