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
    UITextInput,
    ChildBasedSizeConstraint
} from "../../Elementa";
import { colorScheme } from "./color/ColorScheme";
import { getTime, mutePlayer, timeLength, unmutePlayer } from "../chat/MuteManager";
import { Button } from "./components/Button";
import { Dialog } from "./components/Dialog";
import { Switch } from "./components/Switch";

const Color = Java.type("java.awt.Color");
const File = Java.type("java.io.File");

let timers = [];

export function openMutes() {
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
            ChatLib.command("hyjanitor settings", true);
        })
        .setChildOf(background);

    new UIText("§lHyJanitor")
        .setColor(colorScheme.dark.surfaceTint.color)
        .setX(new CenterConstraint())
        .setY((5).percent())
        .setTextScale((3).pixels())
        .setChildOf(background);

    new UIText("Muted Players", false)
        .setColor(colorScheme.dark.inverseOnSurface.color)
        .setX(new CenterConstraint())
        .setY(new AdditiveConstraint((5).percent(), (30).pixels()))
        .setTextScale((2).pixels())
        .setChildOf(background);

    const mainRectangle = new UIRoundedRectangle(10)
        .setColor(colorScheme.dark.surfaceContainerLow.color)
        .setX(new CenterConstraint())
        .setY((20).percent())
        .setWidth((90).percent())
        .setHeight((75).percent())
        .setChildOf(background);

    const autoMuteBackground = new UIRoundedRectangle(10)
        .setColor(colorScheme.dark.warnContainer.color)
        .setX((2.5).percent())
        .setY((4).percent())
        .setWidth((30).percent())
        .setHeight((30).pixels())
        .onMouseEnter((comp) => {
            animate(comp, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onWarn.color));
            });
            animate(autoMuteText, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.warn.color));
            });
        })
        .onMouseLeave((comp) => {
            animate(comp, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.warnContainer.color));
            });
            animate(autoMuteText, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onWarnContainer.color));
            });
        })
        .onMouseClick(() => {
            muteDurationWindow.unhide(true);
        })
        .setChildOf(mainRectangle);

    const autoMuteText = new UIText("", false)
        .setColor(colorScheme.dark.onWarnContainer.color)
        .setX(new CenterConstraint())
        .setY(new CenterConstraint())
        .setTextScale((1.5).pixels())
        .setChildOf(autoMuteBackground);

    if(!Settings.isAutomaticallyMuting) {
        autoMuteText.setText("No Automatic Mutes");
    } else {
        let time = timeLength(Settings.automaticMuteDuration);
        autoMuteText.setText("Automatic Mutes: "+time);
    }

    const totalMutesBackground = new UIRoundedRectangle(10)
        .setColor(colorScheme.dark.secondaryContainer.color)
        .setX((35).percent())
        .setY((4).percent())
        .setWidth((30).percent())
        .setHeight((30).pixels())
        .setChildOf(mainRectangle);

    const totalMutesText = new UIText("Muted Players: "+Settings.mutedPlayers.length, false)
        .setColor(colorScheme.dark.secondary.color)
        .setX(new CenterConstraint())
        .setY(new CenterConstraint())
        .setTextScale((1.5).pixels())
        .setChildOf(totalMutesBackground);

    const mutePlayerBackground = new UIRoundedRectangle(10)
        .setColor(colorScheme.dark.onError.color)
        .setX((67.5).percent())
        .setY((4).percent())
        .setWidth((30).percent())
        .setHeight((30).pixels())
        .onMouseEnter((comp) => {
            animate(comp, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.errorContainer.color));
            });
        })
        .onMouseLeave((comp) => {
            animate(comp, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onError.color));
            });
        })
        .onMouseClick(() => {
            muteWindow.unhide(true);
        })
        .setChildOf(mainRectangle);

    const mutePlayerText = new UIText("Mute Player...", false)
        .setColor(colorScheme.dark.error.color)
        .setX(new CenterConstraint())
        .setY(new CenterConstraint())
        .setTextScale((1.5).pixels())
        .setChildOf(mutePlayerBackground);

    const container = new UIContainer()
        .setX(new CenterConstraint())
        .setY(new AdditiveConstraint((5).percent(), (30).pixels()))
        .setWidth((90).percent())
        .setHeight((80).percent())
        .setChildOf(mainRectangle);

    const scroll = new ScrollComponent()
        .setX((0).pixels())
        .setY((0).pixels())
        .setWidth((100).percent())
        .setHeight((100).percent())
        .setChildOf(container);

    const slider = new UIBlock()
        .setColor(colorScheme.dark.outline.color)
        .setX((0).pixels(true))
        .setWidth((2).pixels())
        .setChildOf(container);

    scroll.setScrollBarComponent(slider, true, false);

    let mutedPlayers = Settings.mutedPlayers;
    timers = [];

    for(let i in mutedPlayers) {
        let player = mutedPlayers[i];

        let mutedRectangle = new UIRoundedRectangle(10)
            .setColor(colorScheme.dark.surfaceContainerHigh.color)
            .setX((0).pixels())
            .setY(new SiblingConstraint(10))
            .setWidth(new SubtractiveConstraint((100).percent(), (4).pixels()))
            .setHeight((15).percent())
            .setChildOf(scroll);

        new UIText(player.name)
            .setColor(colorScheme.dark.surfaceTint.color)
            .setX((5).percent())
            .setY(new CenterConstraint())
            .setTextScale((1.5).pixels())
            .setChildOf(mutedRectangle);

        let timer = new UIText(timeLength(player.expires-Date.now()))
            .setColor(colorScheme.dark.onWarnContainer.color)
            .setX(new CenterConstraint())
            .setY(new CenterConstraint())
            .setTextScale((1.5).pixels())
            .setChildOf(mutedRectangle);
        timers.push({container: mutedRectangle, component: timer, expires: player.expires});

        new Button()
            .setText("Unmute", 1.5, false)
            .setBackgroundColor(colorScheme.dark.surfaceDim.color)
            .setLabelColor(colorScheme.dark.onSurfaceVariant.color)
            .setX((80).percent())
            .setY(new CenterConstraint())
            .setWidth((15).percent())
            .setHeight((30).pixels())
            .onMouseEnter((button) => {
                button.animateBackgroundColor(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.surfaceBright.color));
                button.animateLabelColor(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onSurface.color));
            })
            .onMouseLeave((button) => {
                button.animateBackgroundColor(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.surfaceDim.color));
                button.animateLabelColor(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onSurfaceVariant.color));
            })
            .onMouseClick(() => {
                unmutePlayer(player.name, true)
                openMutes();
            })
            .setChildOf(mutedRectangle);
    }

    const muteWindow = new UIBlock()
        .setColor(new Color(0, 0, 0, 0.5))
        .setX((0).pixels())
        .setY((0).pixels())
        .setWidth((100).percent())
        .setHeight((100).percent())
        .setChildOf(window);

    const muteBackground = new UIRoundedRectangle(35)
        .setColor(colorScheme.dark.surface.color)
        .setX(new CenterConstraint())
        .setY(new CenterConstraint())
        .setWidth((60).percent())
        .setHeight((45).percent())
        .setChildOf(muteWindow);

    const closeMute = UIImage.ofFile(new File("./config/ChatTriggers/modules/HyJanitor/icons/g-close.png"))
        .setColor(colorScheme.dark.inversePrimary.color)
        .setX((16).pixels())
        .setY((8).pixels())
        .setWidth((24).pixels())
        .setHeight(new AspectConstraint())
        .onMouseEnter((comp) => {
            animate(comp, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.primary.color));
            });
        })
        .onMouseLeave((comp) => {
            animate(comp, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.inversePrimary.color));
            });
        })
        .onMouseClick(() => {
            muteWindow.hide(true);
        })
        .setChildOf(muteBackground);

    new UIText("Mute Player")
        .setColor(colorScheme.dark.surfaceTint.color)
        .setX(new CenterConstraint())
        .setY((5).percent())
        .setTextScale((1.5).pixels())
        .setChildOf(muteBackground);

    const nameInputOutline = new UIRoundedRectangle(10)
        .setColor(colorScheme.dark.outline.color)
        .setX(new SubtractiveConstraint(new CenterConstraint(), (22.5).percent()))
        .setY((20).percent())
        .setWidth((40).percent())
        .setHeight((25).pixels())
        .setChildOf(muteBackground);

    const nameInputRectangle = new UIRoundedRectangle(10)
        .setColor(colorScheme.dark.surface.color)
        .setX(new CenterConstraint())
        .setY(new CenterConstraint())
        .setWidth(new SubtractiveConstraint((100).percent(), (2).pixels()))
        .setHeight(new SubtractiveConstraint((100).percent(), (2).pixels()))
        .onMouseClick(() => {
            nameInputText.grabWindowFocus();
        })
        .setChildOf(nameInputOutline);

    const nameInputLabelBackground = new UIBlock()
        .setColor(colorScheme.dark.surface.color)
        .setX((16).pixels())
        .setY((-2).pixels())
        .setWidth(new AdditiveConstraint(new ChildBasedSizeConstraint(), (3).pixels()))
        .setHeight(new ChildBasedSizeConstraint())
        .setChildOf(nameInputOutline);

    new UIText("Username")
        .setColor(colorScheme.dark.onSurfaceVariant.color)
        .setX((2).pixels())
        .setY((0).pixels())
        .setChildOf(nameInputLabelBackground);

    const nameInputText = new UITextInput()
        .setColor(colorScheme.dark.onSurface.color)
        .setTextScale((1.5).pixels())
        .setChildOf(nameInputRectangle);
    nameInputText.setX((8).pixels())
        .setY(new AdditiveConstraint(new CenterConstraint(), (2).pixels()))
        .setWidth(new SubtractiveConstraint(new FillConstraint(), (12).pixels()))
        .setHeight((15).pixels());

    let mutePlayerButton = new Button()
        .setText("Mute Player", 1.5, false)
        .setColor("success", true)
        .setX(new SubtractiveConstraint(new CenterConstraint(), (22.5).percent()))
        .setY(new AdditiveConstraint((20).percent(), (45).pixels()))
        .setWidth((25).percent())
        .setHeight((30).pixels())
        .onMouseEnter(() => {
            let valid = true;
            let input = timeInputText.getText().trim();
            let split = input.split(" ");
            for(let word of split) {
                let time = getTime(word);
                if(time == -1) {
                    valid = false;
                }
            }
            if(!valid) return;
        })
        .onMouseLeave(() => {
            let valid = true;
            let input = timeInputText.getText().trim();
            let split = input.split(" ");
            for(let word of split) {
                let time = getTime(word);
                if(time == -1) {
                    valid = false;
                }
            }
            if(!valid) return;
        })
        .onMouseClick(() => {
            let duration = 0;
            let input = timeInputText.getText().trim();
            let split = input.split(" ");
            for(let word of split) {
                let time = getTime(word);
                if(time == -1) {
                    timeValidIcon.hide(true);
                    timeErrorTitle.unhide(true);
                    timeErrorDescription.unhide(true);
                    return;
                }
                let amount = word.replace(/(m(illi)?s(econds?)?)|(s(ec(ond)?s?)?)|(m(?!o)(in(ute)?s?)?)|(h((ou)?r)?s?)|(d(ays?)?)|(w(eeks?)?)|(mo(nths?)?)|(y(ea)?(rs?)?)$/g, "");
                duration += time*amount;
            }
            mutePlayer(nameInputText.getText(), duration, true);
            muteWindow.hide(true);
            ChatLib.command("hyjanitor mutes", true);
        })
        .setChildOf(muteBackground);

    const timeInputOutline = new UIRoundedRectangle(10)
        .setColor(colorScheme.dark.outline.color)
        .setX(new AdditiveConstraint(new CenterConstraint(), (22.5).percent()))
        .setY((20).percent())
        .setWidth((40).percent())
        .setHeight((25).pixels())
        .setChildOf(muteBackground);

    const timeInputRectangle = new UIRoundedRectangle(10)
        .setColor(colorScheme.dark.surface.color)
        .setX(new CenterConstraint())
        .setY(new CenterConstraint())
        .setWidth(new SubtractiveConstraint((100).percent(), (2).pixels()))
        .setHeight(new SubtractiveConstraint((100).percent(), (2).pixels()))
        .onMouseClick(() => {
            timeInputText.grabWindowFocus();
        })
        .setChildOf(timeInputOutline);

    const timeInputLabelBackground = new UIBlock()
        .setColor(colorScheme.dark.surface.color)
        .setX((16).pixels())
        .setY((-2).pixels())
        .setWidth(new AdditiveConstraint(new ChildBasedSizeConstraint(), (3).pixels()))
        .setHeight(new ChildBasedSizeConstraint())
        .setChildOf(timeInputOutline);

    new UIText("Duration")
        .setColor(colorScheme.dark.onSurfaceVariant.color)
        .setX((2).pixels())
        .setY((0).pixels())
        .setChildOf(timeInputLabelBackground);

    const timeInputText = new UITextInput()
        .setColor(colorScheme.dark.onSurface.color)
        .setTextScale((1.5).pixels())
        .onKeyType(() => {
            let input = timeInputText.getText().trim();
            let split = input.split(" ");
            for(let word of split) {
                let time = getTime(word);
                if(time == -1) {
                    mutePlayerButton.setBackgroundColor(colorScheme.dark.inverseOnSurface.color);
                    mutePlayerButton.setLabelColor(colorScheme.dark.onSurfaceVariant.color);
                    timeValidIcon.hide(true);
                    timeErrorTitle.unhide(true);
                    timeErrorDescription.unhide(true);
                    return;
                }
            }
            mutePlayerButton.setBackgroundColor(colorScheme.dark.successContainer.color);
            mutePlayerButton.setLabelColor(colorScheme.dark.success.color);
            timeValidIcon.unhide(true);
            timeErrorTitle.hide(true);
            timeErrorDescription.hide(true);
        })
        .setChildOf(timeInputRectangle);
    timeInputText.setText(timeLength(Settings.automaticMuteDuration));
    timeInputText.setX((8).pixels())
        .setY(new AdditiveConstraint(new CenterConstraint(), (2).pixels()))
        .setWidth(new SubtractiveConstraint(new FillConstraint(), (12).pixels()))
        .setHeight((15).pixels());

    const timeValidIcon = UIImage.ofFile(new File("./config/ChatTriggers/modules/HyJanitor/icons/g-check.png"))
        .setColor(colorScheme.dark.success.color)
        .setX(new AdditiveConstraint((100).percent(), (8).pixels()))
        .setY(new CenterConstraint())
        .setWidth((19).pixels())
        .setHeight(new AspectConstraint())
        .setChildOf(timeInputOutline);

    const timeErrorTitle = new UIText("Invalid Format!")
        .setColor(colorScheme.dark.error.color)
        .setX(new AdditiveConstraint(new CenterConstraint(), (22.5).percent()))
        .setY(new AdditiveConstraint((20).percent(), (45).pixels()))
        .setTextScale((1.5).pixels())
        .setChildOf(muteBackground);

    const timeErrorDescription = new UIText("Durations: ms, s, m, h, d, w, mo, y")
        .setColor(colorScheme.dark.error.color)
        .setX(new AdditiveConstraint(new CenterConstraint(), (22.5).percent()))
        .setY(new AdditiveConstraint((20).percent(), (60).pixels()))
        .setChildOf(muteBackground);

    timeErrorTitle.hide(true);
    timeErrorDescription.hide(true);

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
                timeInputText.setText(suggestion);
                mutePlayerButton.setBackgroundColor(colorScheme.dark.successContainer.color);
                mutePlayerButton.setLabelColor(colorScheme.dark.success.color);
                timeValidIcon.unhide(true);
                timeErrorTitle.hide(true);
                timeErrorDescription.hide(true);
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

    if(Settings.muteTutorial) {
        const tutorialWindow = new UIBlock()
            .setColor(new Color(0, 0, 0, 0.5))
            .setX((0).pixels())
            .setY((0).pixels())
            .setWidth((100).percent())
            .setHeight((100).percent())
            .setChildOf(window);

        const tutorialConfirm = new Button()
            .setText("Okay", 1, false);

        new Dialog(tutorialConfirm)
            .setTitle("Player Mutes", 1, false)
            .setDescription("You can mute players either manually or automatically. You can enable or disable automatic mutes in settings, as well as notifications for when players are muted or unmuted. Mutes currently only apply to Hypixel's chat format.", 1, false)
            .setX(new CenterConstraint())
            .setY(new CenterConstraint())
            .setWidth((30).percent())
            .onPrimaryClick(() => {
                Settings.muteTutorial = false;
                tutorialWindow.hide(true);
            })
            .setChildOf(tutorialWindow);
    }

    const muteDurationWindow = new UIBlock()
        .setColor(new Color(0, 0, 0, 0.5))
        .setX((0).pixels())
        .setY((0).pixels())
        .setWidth((100).percent())
        .setHeight((100).percent())
        .setChildOf(window);

    const muteDurationBackground = new UIRoundedRectangle(35)
        .setColor(colorScheme.dark.surface.color)
        .setX(new CenterConstraint())
        .setY(new CenterConstraint())
        .setWidth((60).percent())
        .setHeight((45).percent())
        .setChildOf(muteDurationWindow);

    const closeMuteDuration = UIImage.ofFile(new File("./config/ChatTriggers/modules/HyJanitor/icons/g-close.png"))
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
            muteDurationWindow.hide(true);
        })
        .setChildOf(muteDurationBackground);

    new UIText("Edit Mute Duration")
        .setColor(colorScheme.dark.surfaceTint.color)
        .setX(new CenterConstraint())
        .setY((5).percent())
        .setTextScale((1.5).pixels())
        .setChildOf(muteDurationBackground);

    const inputOutline = new UIRoundedRectangle(10)
        .setColor(colorScheme.dark.outline.color)
        .setX(new CenterConstraint())
        .setY((15).percent())
        .setWidth((40).percent())
        .setHeight((25).pixels())
        .setChildOf(muteDurationBackground);

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
            if(!Settings.isAutomaticallyMuting) {
                autoMuteText.setText("No Automatic Mutes");
            } else {
                let time = timeLength(Settings.automaticMuteDuration);
                autoMuteText.setText("Automatic Mutes: "+time);
            }
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
        .setY(new AdditiveConstraint((15).percent(), (45).pixels()))
        .setTextScale((1.5).pixels())
        .setChildOf(muteDurationBackground);

    const errorDescription = new UIText("Durations: ms, s, m, h, d, w, mo, y")
        .setColor(colorScheme.dark.error.color)
        .setX(new CenterConstraint())
        .setY(new AdditiveConstraint((15).percent(), (60).pixels()))
        .setChildOf(muteDurationBackground);

    errorTitle.hide(true);
    errorDescription.hide(true);

    const durationSuggestionContainer = new UIContainer()
        .setX(new CenterConstraint())
        .setY((50).percent())
        .setWidth((75).percent())
        .setHeight((30).percent())
        .setChildOf(muteDurationBackground);

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
                if(!Settings.isAutomaticallyMuting) {
                    autoMuteText.setText("No Automatic Mutes");
                } else {
                    autoMuteText.setText("Automatic Mutes: "+suggestion);
                }
            })
            .setChildOf(durationSuggestionContainer);

        let suggestionText = new UIText(suggestion)
            .setColor(colorScheme.dark.warn.color)
            .setX(new CenterConstraint())
            .setY(new CenterConstraint())
            .setTextScale((1.5).pixels())
            .setChildOf(suggestionRectangle);
    }

    const automaticMuteContainer = new UIRoundedRectangle(8)
        .setColor(colorScheme.dark.surfaceContainer.color)
        .setX(new CenterConstraint())
        .setY(new AdditiveConstraint(new CenterConstraint(), (40).percent()))
        .setWidth(new ChildBasedSizeConstraint(32))
        .setHeight((30).pixels())
        .onMouseClick(() => {
            button.setSelected(!button.isSelected());
            Settings.isAutomaticallyMuting = button.isSelected();
            if(!Settings.isAutomaticallyMuting) {
                autoMuteText.setText("No Automatic Mutes");
            } else {
                let time = timeLength(Settings.automaticMuteDuration);
                autoMuteText.setText("Automatic Mutes: "+time);
            }
        })
        .setChildOf(muteDurationBackground);

    const button = new Switch(Settings.isAutomaticallyMuting)
        .setX((16).pixels())
        .setY(new CenterConstraint())
        .setWidth((39).pixels())
        .setHeight((18).pixels())
        .setChildOf(automaticMuteContainer);

    new UIText("Automatic Mutes")
        .setColor(colorScheme.dark.onSurfaceVariant.color)
        .setX(new SiblingConstraint(8))
        .setY(new CenterConstraint())
        .setTextScale((1.5).pixels())
        .setChildOf(automaticMuteContainer);

    muteDurationWindow.hide(true);

    const gui = new JavaAdapter(WindowScreen, {
        init() {
            window.setChildOf(this.getWindow());
        }
    });
    gui.init();
    GuiHandler.openGui(gui);
}

register("step", () => {
    for(let timer of timers) {
        if(Date.now() > timer.expires) {
            timer.container.hide(true);
        } else if(timer.expires-Date.now() < 1000) {
            timer.component.setText("0s");
        } else {
            timer.component.setText(timeLength(timer.expires-Date.now()));
        }
    }
}).setDelay(1);