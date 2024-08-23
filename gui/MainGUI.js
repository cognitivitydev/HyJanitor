/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import Settings from "../config";
import {
    AdditiveConstraint,
    animate,
    Animations,
    CenterConstraint,
    ConstantColorConstraint,
    FillConstraint,
    SiblingConstraint,
    SubtractiveConstraint,
    UIBlock,
    UIImage,
    UIRoundedRectangle,
    UIText,
    UIWrappedText,
    WindowScreen
} from "../../Elementa";
import { colorScheme } from "./color/ColorScheme";
import { editRuleset } from "./EditRulesetGUI";
import { openRulesets } from "./ViewRulesGUI";
import { openSettings } from "./SettingsGUI";
import { Button } from "./components/Button";
import { importPreset } from "./sharing/import/ImportPresetGUI";
import { Dialog } from "./components/Dialog";
import { openMutes } from "./MuteGUI";

const Color = Java.type("java.awt.Color");
const File = Java.type("java.io.File");

export function openMain() {
    let rulesets = Settings.rulesets;

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

    new UIText("§lHyJanitor")
        .setColor(colorScheme.dark.primary.color)
        .setX(new CenterConstraint())
        .setY((5).percent())
        .setTextScale((3).pixels())
        .setChildOf(background);

    new UIText("Main Menu", false)
        .setColor(colorScheme.dark.inverseOnSurface.color)
        .setX(new CenterConstraint())
        .setY(new AdditiveConstraint((5).percent(), (30).pixels()))
        .setTextScale((2).pixels())
        .setChildOf(background);

    new Button(new File("./config/ChatTriggers/modules/HyJanitor/icons/g-settings.png"))
        .setText("Settings", 2, false)
        .setColor("tertiary", false)
        .setX(new CenterConstraint())
        .setY((45).percent())
        .setWidth((20).percent())
        .setHeight((60).pixels())
        .setIconSize((32).pixels())
        .onMouseClick(() => {
            openSettings();
        })
        .setChildOf(background);

    const statisticsTab = new UIRoundedRectangle(10)
        .setColor(colorScheme.dark.surfaceContainerLow.color)
        .setX((5).percent())
        .setY(new SubtractiveConstraint((25).percent(), (30).pixels()))
        .setWidth((30).percent())
        .setHeight((50).pixels())
        .setChildOf(background);

    const statisticsName = new UIText("Statistics", false)
        .setColor(colorScheme.dark.surfaceVariant.color)
        .setX(new CenterConstraint())
        .setY((10).pixels())
        .setTextScale((1.5).pixels())
        .setChildOf(statisticsTab);

    const statisticsMain = new UIRoundedRectangle(10)
        .setColor(colorScheme.dark.surfaceContainer.color)
        .setX((5).percent())
        .setY((25).percent())
        .setWidth((30).percent())
        .setHeight((65).percent())
        .setChildOf(background);

    let mostTriggeredCount = -1;
    let mostTriggeredName = "?";
    for (let ruleset of rulesets) {
        if (ruleset.removals > mostTriggeredCount) {
            mostTriggeredCount = ruleset.removals;
            mostTriggeredName = ruleset.name;
        }
    }

    let statistics = [
        {name: "Messages Received", value: addCommas(Settings.receivedMessages)},
        {name: "Messages Blocked", value: addCommas(Settings.blockedMessages)},
        {
            name: "Percentage Blocked",
            value: (Settings.receivedMessages == 0 ? "0.00" : ((Settings.blockedMessages / Settings.receivedMessages) * 100).toFixed(2)) + "%"
        },
        {name: "Session Blocked Messages", value: addCommas(Settings.sessionBlocked)},
        {name: "Most Triggered Rule", value: mostTriggeredName}
    ]

    for (let statistic of statistics) {
        let statisticRectangle = new UIRoundedRectangle(8)
            .setColor(colorScheme.dark.surfaceContainerHighest.color)
            .setX(new CenterConstraint())
            .setY(new SiblingConstraint(5))
            .setWidth((90).percent())
            .setHeight((14).percent())
            .setChildOf(statisticsMain);
        if (statistics.indexOf(statistic) === 0) {
            statisticRectangle.setY((10).pixels());
        }

        new UIText("§o" + statistic.name, false)
            .setColor(colorScheme.dark.surfaceTint.color)
            .setX((8).pixels())
            .setY((8).pixels())
            .setTextScale((1.5).pixels())
            .setChildOf(statisticRectangle);

        new UIText("§o" + statistic.value, false)
            .setColor(colorScheme.dark.onSurface.color)
            .setX((6).pixels(true))
            .setY((4).pixels(true))
            .setTextScale((1.5).pixels())
            .setChildOf(statisticRectangle);
    }

    new Button(new File("./config/ChatTriggers/modules/HyJanitor/icons/g-comments_disabled.png"))
        .setText("Muted Players", 1.5, false)
        .setIconSize((21).pixels())
        .setColor("warn", true)
        .setX(new CenterConstraint())
        .setY((16).pixels(true))
        .setWidth((60).percent())
        .setHeight((40).pixels())
        .onMouseClick(() => {
            openMutes();
        })
        .setChildOf(statisticsMain);

    const rulesetsTab = new UIRoundedRectangle(10)
        .setColor(colorScheme.dark.surfaceContainerLow.color)
        .setX((65).percent())
        .setY(new SubtractiveConstraint((25).percent(), (30).pixels()))
        .setWidth((30).percent())
        .setHeight((50).pixels())
        .setChildOf(background);

    const rulesetsName = new UIText("Message Rules", false)
        .setColor(colorScheme.dark.surfaceVariant.color)
        .setX(new CenterConstraint())
        .setY((10).pixels())
        .setTextScale((1.5).pixels())
        .setChildOf(rulesetsTab);

    const rulesetsMain = new UIRoundedRectangle(10)
        .setColor(colorScheme.dark.surfaceContainer.color)
        .setX((65).percent())
        .setY((25).percent())
        .setWidth((30).percent())
        .setHeight((65).percent())
        .setChildOf(background);

    for (let i = 0; i < 5; i++) {
        let index = i;
        let ruleset = rulesets[i];

        let rulesetRectangle = new UIRoundedRectangle(8)
            .setX(new CenterConstraint())
            .setY(i === 0 ? (10).pixels() : new SiblingConstraint(5))
            .setWidth((90).percent())
            .setHeight((14).percent())
            .setChildOf(rulesetsMain);

        let ruleTitle = new UIWrappedText("Create Ruleset", false, null, false, true)
            .setX((8).pixels())
            .setY(new CenterConstraint())
            .setWidth(new FillConstraint())
            .setHeight((15).pixels())
            .setTextScale((1.5).pixels())
            .setChildOf(rulesetRectangle);

        let arrow = UIImage.ofFile(new File("./config/ChatTriggers/modules/HyJanitor/icons/g-forward.png"))
            .setX((90).percent())
            .setY(new CenterConstraint())
            .setWidth((25).pixels())
            .setHeight((25).pixels())
            .setChildOf(rulesetRectangle);

        if (!ruleset) {
            rulesetRectangle.setColor(colorScheme.dark.onPrimary.color)
                .onMouseEnter((comp) => {
                    animate(comp, (animation) => {
                        animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.primaryContainer.color));
                    });
                })
                .onMouseLeave((comp) => {
                    animate(comp, (animation) => {
                        animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onPrimary.color));
                    });
                })
                .onMouseClick(() => {
                    editRuleset(-1);
                });
            ruleTitle.setText("Create Ruleset").setColor(colorScheme.dark.primary.color);
            arrow.setColor(colorScheme.dark.primary.color);
        } else {
            rulesetRectangle.setColor(colorScheme.dark.surfaceContainerHighest.color)
                .onMouseEnter((comp) => {
                    animate(comp, (animation) => {
                        animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.surfaceVariant.color));
                    });
                })
                .onMouseLeave((comp) => {
                    animate(comp, (animation) => {
                        animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.surfaceContainerHighest.color));
                    });
                })
                .onMouseClick(() => {
                    editRuleset(index);
                });
            ruleTitle.setText(ruleset.name).setColor(colorScheme.dark.onSurface.color);
            arrow.setColor(colorScheme.dark.surfaceTint.color);
        }
    }

    new Button(new File("./config/ChatTriggers/modules/HyJanitor/icons/g-edit_square.png"))
        .setText("Edit Rulesets", 1.5, false)
        .setIconSize((21).pixels())
        .setColor("primary", true)
        .setX(new CenterConstraint())
        .setY((16).pixels(true))
        .setWidth((60).percent())
        .setHeight((40).pixels())
        .onMouseClick(() => {
            openRulesets();
        })
        .setChildOf(rulesetsMain);

    if (Settings.mainPresetTutorial) {
        const welcomeWindow = new UIBlock()
            .setColor(new Color(0, 0, 0, 127 / 255))
            .setX((0).pixels())
            .setY((0).pixels())
            .setWidth((100).percent())
            .setHeight((100).percent())
            .setChildOf(window);

        const welcomeConfirm = new Button()
            .setText("Download", 1, false);

        const welcomeCancel = new Button()
            .setText("Cancel", 1, false);

        new Dialog(welcomeConfirm, welcomeCancel, new File("./config/ChatTriggers/modules/HyJanitor/icons/g-draw.png"))
            .setTitle("Welcome to HyJanitor!", 1.5, false)
            .setDescription("This module contains premade presets to get you started. Would you like to choose some presets to download?", 1, false)
            .setX(new CenterConstraint())
            .setY(new CenterConstraint())
            .setWidth((25).percent())
            .onPrimaryClick(() => {
                Settings.mainPresetTutorial = false;
                importPreset();
            })
            .onSecondaryClick(() => {
                Settings.mainPresetTutorial = false;
                welcomeWindow.hide(true);
            })
            .setChildOf(welcomeWindow);
    }

    const gui = new JavaAdapter(WindowScreen, {
        init() {
            window.setChildOf(this.getWindow());
        }
    });
    gui.init();
    GuiHandler.openGui(gui);
}

function addCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}