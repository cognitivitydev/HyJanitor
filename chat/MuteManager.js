/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import {
    Animations,
    UIText,
    CenterConstraint,
    SubtractiveConstraint,
    AdditiveConstraint,
    UIRoundedRectangle,
    SiblingConstraint,
    CramSiblingConstraint,
    UIContainer,
    Window,
    ChildBasedMaxSizeConstraint,
    ChildBasedRangeConstraint
} from "../../Elementa";
import Settings from "../config";
import { colorScheme } from "../gui/color/ColorScheme";

const SlideToTransition = Java.type("gg.essential.elementa.transitions.SlideToTransition");

const muteFormat = ["%player% ", "has ", "been ", "muted ", "for ", "%time%", "."];
const unmuteFormat = ["%player% ", "has ", "been ", "unmuted", "."]
const hud = new Window();

export function mutePlayer(name, duration, manual = false) {
    if(duration < 0) return;
    let expires = Date.now()+duration;
    Settings.mutedPlayers.push({name: name, expires: expires});
    Settings.saveSettings(true);
    if(!manual && !Settings.muteToastEnter) return;

    const outline = new UIRoundedRectangle(8)
        .setColor(colorScheme.dark.outline.color)
        .setX((100).percent()).setY(new SubtractiveConstraint(new SiblingConstraint(2, true), (2).pixels()))
        .setWidth((20).percent())
        .setChildOf(hud);

    const background = new UIRoundedRectangle(8)
        .setColor(colorScheme.dark.background.color)
        .setX((0.5).pixels()).setY((0.5).pixels())
        .setWidth(new SubtractiveConstraint((100).percent(), (1).pixels())).setHeight(new AdditiveConstraint(new ChildBasedMaxSizeConstraint(), (16).pixels()))
        .setChildOf(outline);

    const container = new UIContainer()
        .setX(new CenterConstraint()).setY((8).pixels())
        .setWidth((90).percent()).setHeight(new ChildBasedRangeConstraint())
        .setChildOf(background);
    let lastText = "";
    for(let word of muteFormat) {
        let text = new UIText(word.replace("%player%", name).replace("%time%", timeLength(duration)))
            .setColor(colorScheme.dark.primary.color)
            .setX(new CramSiblingConstraint()).setY(new CramSiblingConstraint())
            .setChildOf(container);
        if(word === "%player% ") {
            text.setColor(colorScheme.dark.tertiary.color);
        } else if(word === "%time%") {
            text.setColor(colorScheme.dark.error.color);
        } else if(word === ".") { // prevent line wrapping
            text.setX((lastText.getRight()-container.getLeft()).pixels()).setY((lastText.getTop()-container.getTop()).pixels());
        }
        lastText = text;
    }

    new UIText("§lHYJANITOR")
        .setColor(colorScheme.dark.secondaryContainer.color)
        .setX((4).pixels(true)).setY((2).pixels(true))
        .setTextScale((0.5).pixels())
        .setChildOf(background);

    outline.setHeight((background.getHeight()+1).pixels())

    const transitionIn = new SlideToTransition.Left(0.5, Animations.OUT_EXP, false);
    const transitionOut = new SlideToTransition.Right(0.5, Animations.OUT_EXP, false);
    transitionIn.transition(outline);
    setTimeout(() => {
        transitionOut.transition(outline);
    }, 5000);
    setTimeout(() => {
        hud.removeChild(outline);
    }, 5500);
}

export function unmutePlayer(name, manual = false) {
    Settings.mutedPlayers = Settings.mutedPlayers.filter(mutedPlayer => mutedPlayer.name.toLowerCase() !== name.toLowerCase());
    if(!manual && !Settings.muteToastLeave) return;

    const outline = new UIRoundedRectangle(8)
        .setColor(colorScheme.dark.outline.color)
        .setX((100).percent()).setY(new SubtractiveConstraint(new SiblingConstraint(2, true), (2).pixels()))
        .setWidth((20).percent())
        .setChildOf(hud);

    const background = new UIRoundedRectangle(8)
        .setColor(colorScheme.dark.background.color)
        .setX((0.5).pixels()).setY((0.5).pixels())
        .setWidth(new SubtractiveConstraint((100).percent(), (1).pixels())).setHeight(new AdditiveConstraint(new ChildBasedMaxSizeConstraint(), (16).pixels()))
        .setChildOf(outline);

    const container = new UIContainer()
        .setX(new CenterConstraint()).setY((8).pixels())
        .setWidth((90).percent()).setHeight(new ChildBasedRangeConstraint())
        .setChildOf(background);
    let lastText;
    for(let word of unmuteFormat) {
        let text = new UIText(word.replace("%player%", name))
            .setColor(colorScheme.dark.primary.color)
            .setX(new CramSiblingConstraint()).setY(new CramSiblingConstraint())
            .setChildOf(container);
        if(word === "%player% ") {
            text.setColor(colorScheme.dark.warn.color);
        } else if(word === "unmuted") {
            text.setColor(colorScheme.dark.error.color);
        } else if(word === ".") { // prevent line wrapping
            text.setX((lastText.getRight()-container.getLeft()).pixels()).setY((lastText.getTop()-container.getTop()).pixels());
        }
        lastText = text;
    }

    new UIText("§lHYJANITOR")
        .setColor(colorScheme.dark.secondaryContainer.color)
        .setX((4).pixels(true)).setY((2).pixels(true))
        .setTextScale((0.5).pixels())
        .setChildOf(background);

    outline.setHeight((background.getHeight()+1).pixels())

    const transitionIn = new SlideToTransition.Left(0.5, Animations.OUT_EXP, false);
    const transitionOut = new SlideToTransition.Right(0.5, Animations.OUT_EXP, false);
    transitionIn.transition(outline);
    setTimeout(() => {
        transitionOut.transition(outline);
    }, 5000);
    setTimeout(() => {
        hud.removeChild(outline);
    }, 5500);
}

register("renderOverlay", () => {
    hud.draw();
});

register("step", () => {
    let initMutedPlayers = Settings.mutedPlayers;
    let newMutedPlayers = Settings.mutedPlayers.filter(muted => Date.now() < muted.expires);
    let difference = initMutedPlayers.filter(mutedPlayer => !newMutedPlayers.includes(mutedPlayer));
    if(difference.length > 0) {
        Settings.mutedPlayers = newMutedPlayers;
        difference.forEach(old => unmutePlayer(old.name));
    }
}).setDelay(1);

export function getTime(string) {
    let time = string.toLowerCase().trim();
    if(/(\d?.)?\d+m(illi)?s(econds?)?$/g.exec(time)) {
        return 1;
    } else if(/(\d?.)?\d+s(ec(ond)?s?)?$/g.exec(time)) {
        return 1000;
    } else if(/(\d?.)?\d+m(in(ute)?s?)?$/g.exec(time)) {
        return 60000;
    } else if(/(\d?.)?\d+h((ou)?rs?)?$/g.exec(time)) {
        return 3600000;
    } else if(/(\d?.)?\d+d(ays?)?$/g.exec(time)) {
        return 86400000;
    } else if(/(\d?.)?\d+w(eeks?)?$/g.exec(time)) {
        return 604800000;
    } else if(/(\d?.)?\d+mo(nths?)?$/g.exec(time)) {
        return 2592000000;
    } else if(/(\d?.)?\d+y(ea)?(rs?)?$/g.exec(time)) {
        return 31536000000;
    }
    return -1;
}

export function timeLength(time) {
    if(time <= 0) {
        return "0ms";
    }
    let string = "";

    let days = Math.floor(time / 86400000);
    time %= 86400000;
    let hours = Math.floor(time / 3600000);
    time %= 3600000;
    let minutes = Math.floor(time / 60000);
    time %= 60000;
    let seconds = Math.floor(time / 1000);
    let milliseconds = time % 1000;

    if(days != 0) {
        string = string+days+"d ";
    }
    if(hours != 0) {
        string = string+hours+"h ";
    }
    if(minutes != 0) {
        string = string+minutes+"m ";
    }
    if(seconds != 0) {
        string = string+seconds+"s ";
    }
    if(days == 0 && hours == 0 && minutes == 0 && seconds == 0) {
        string = string+milliseconds+"ms ";
    }
    return string.trim();
}