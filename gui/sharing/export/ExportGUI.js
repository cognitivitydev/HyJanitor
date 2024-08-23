/// <reference types="../../../CTAutocomplete" />
/// <reference lib="es2015" />

import Settings from "../../../config";
import {
    AdditiveConstraint,
    animate,
    Animations,
    AspectConstraint,
    CenterConstraint,
    ChildBasedSizeConstraint,
    ConstantColorConstraint,
    FillConstraint,
    ScrollComponent,
    SiblingConstraint,
    SubtractiveConstraint,
    UIBlock,
    UIContainer,
    UIImage,
    UIRoundedRectangle,
    UIText,
    UIWrappedText,
    WindowScreen
} from "../../../../Elementa";
import { colorScheme } from "../../color/ColorScheme";
import { Button } from "../../components/Button";
import { Checkbox } from "../../components/Checkbox";
import { openPresetForm } from "./ExportPresetGUI";

const Color = Java.type("java.awt.Color");
const File = Java.type("java.io.File");
const StringSelection = Java.type("java.awt.datatransfer.StringSelection");
const Toolkit = Java.type("java.awt.Toolkit");

export function exportRulesets() {
    let rulesets = Settings.rulesets.map(ruleset => {
        let value = JSON.parse(JSON.stringify(ruleset));
        value.removals = undefined;
        return {selected: false, container: undefined, value: value};
    });

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
        .setWidth((80).percent())
        .setHeight((70).percent())
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
            ChatLib.command("hyjanitor rulesets", true);
        })
        .setChildOf(background);


    new UIText("Export Rulesets", false)
        .setColor(colorScheme.dark.surfaceTint.color)
        .setX(new CenterConstraint())
        .setY((5).percent())
        .setTextScale((2).pixels())
        .setChildOf(background);

    const mainRectangle = new UIRoundedRectangle(15)
        .setColor(colorScheme.dark.surfaceContainer.color)
        .setX(new CenterConstraint())
        .setY((15).percent())
        .setWidth((90).percent())
        .setHeight((80).percent())
        .setChildOf(background);

    let selectButton = new Button()
        .setText("Select All", 1.5, false)
        .setColor("success", true)
        .setX(new SubtractiveConstraint(new CenterConstraint(), (30).percent()))
        .setY((5).percent())
        .setWidth((20).percent())
        .setHeight((30).pixels())
        .onMouseClick(() => {
            for (let ruleset of rulesets) {
                if (!ruleset.selected) ruleset.container.mouseClick(0, 0, 1)
            }
        })
        .setChildOf(mainRectangle);

    let exportButton = new Button()
        .setText("Export...", 1.5, false)
        .setBackgroundColor(colorScheme.dark.primaryContainer.color)
        .setLabelColor(colorScheme.dark.onPrimaryContainer.color)
        .setX(new CenterConstraint())
        .setY((5).percent())
        .setWidth((25).percent())
        .setHeight((30).pixels())
        .onMouseEnter((button) => {
            button.animateBackgroundColor(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onPrimary.color));
            button.animateLabelColor(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.primary.color));
        })
        .onMouseLeave((button) => {
            button.animateBackgroundColor(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.primaryContainer.color));
            button.animateLabelColor(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onPrimaryContainer.color));
        })
        .onMouseClick(() => {
            optionsVisible = !optionsVisible;
            if (optionsVisible) {
                options.unhide(true);
            } else {
                options.hide(true);
            }

            let selected = getSelected(rulesets);
            clipboardText.setColor(colorScheme.dark.onSurface.color);
            presetText.setColor(colorScheme.dark.onSurface.color);
            if (selected.length === 0) {
                clipboardText.setColor(colorScheme.dark.surfaceVariant.color);
            }
            if (selected.length !== 1 || selected.filter(ruleset => ruleset.preset).length !== 0) {
                presetText.setColor(colorScheme.dark.surfaceVariant.color);
            }
        })
        .setChildOf(mainRectangle);

    let deselectButton = new Button()
        .setText("Deselect All", 1.5, false)
        .setBackgroundColor(colorScheme.dark.surfaceDim.color)
        .setLabelColor(colorScheme.dark.onSurfaceVariant.color)
        .setX(new AdditiveConstraint(new CenterConstraint(), (30).percent()))
        .setY((5).percent())
        .setWidth((20).percent())
        .setHeight((30).pixels())
        .onMouseEnter((button) => {
            button.animateBackgroundColor(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.inverseOnSurface.color));
        })
        .onMouseLeave((button) => {
            button.animateBackgroundColor(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.surfaceDim.color));
        })
        .onMouseClick(() => {
            for (let ruleset of rulesets) {
                if (ruleset.selected) ruleset.container.mouseClick(0, 0, 1)
            }
        })
        .setChildOf(mainRectangle);

    const scrollContainer = new UIContainer()
        .setX(new CenterConstraint())
        .setY(new AdditiveConstraint((5).percent(), (38).pixels()))
        .setWidth((100).percent())
        .setHeight(new SubtractiveConstraint((95).percent(), (44).pixels()))
        .setChildOf(mainRectangle);

    const container = new ScrollComponent()
        .setX(new CenterConstraint())
        .setY(new CenterConstraint())
        .setWidth((95).percent())
        .setHeight((100).percent())
        .setChildOf(scrollContainer);

    const slider = new UIBlock()
        .setColor(colorScheme.dark.outline.color)
        .setX(new SubtractiveConstraint((100).percent(), (12).pixels()))
        .setWidth((2).pixels())
        .setChildOf(scrollContainer);

    container.setScrollBarComponent(slider, true, false);

    for (let i in rulesets) {
        let ruleset = rulesets[i];

        const rulesetContainer = new UIRoundedRectangle(10)
            .setColor(colorScheme.dark.surfaceContainerHigh.color)
            .setX(new CenterConstraint())
            .setY(new SiblingConstraint(8))
            .setWidth((100).percent())
            .setHeight((40).pixels())
            .onMouseClick(() => {
                ruleset.selected = !ruleset.selected;
                rulesetCheck.setSelected(ruleset.selected);
                optionsVisible = false;
                options.hide(true);
            })
            .setChildOf(container);
        ruleset.container = rulesetContainer;

        const rulesetCheck = new Checkbox(colorScheme.dark.surfaceContainerHigh.color, false)
            .setX((8).pixels())
            .setY(new CenterConstraint())
            .setChildOf(rulesetContainer);

        const rulesetTitle = new UIWrappedText(ruleset.value.name, false, null, false, true)
            .setColor(colorScheme.dark.surfaceTint.color)
            .setX((38).pixels())
            .setY(ruleset.value.preset ? new SubtractiveConstraint(new CenterConstraint(), (6).pixels()) : new CenterConstraint())
            .setWidth(new FillConstraint())
            .setHeight((15).pixels())
            .setTextScale((1.5).pixels())
            .setChildOf(rulesetContainer);

        if (ruleset.value.preset) {
            new UIText("Preset", false)
                .setColor(colorScheme.dark.onSurfaceVariant.color)
                .setX((38).pixels())
                .setY(new AdditiveConstraint(new CenterConstraint(), (6).pixels()))
                .setChildOf(rulesetContainer);
        }

        new UIText(ruleset.value.rules.length + " rules", false)
            .setColor(colorScheme.dark.onSurface.color)
            .setTextScale((1.5).pixels())
            .setX((8).pixels(true))
            .setY(new CenterConstraint())
            .setChildOf(rulesetContainer);
    }

    let options = new UIContainer()
        .setX(new CenterConstraint())
        .setY(new AdditiveConstraint((5).percent(), (30).pixels()))
        .setWidth((25).percent())
        .setHeight(new ChildBasedSizeConstraint())
        .setChildOf(mainRectangle);

    let optionsVisible = false;
    options.hide(true);

    let clipboardOption = new UIBlock()
        .setColor(colorScheme.dark.surfaceContainerLow.color)
        .setX((0).pixels())
        .setY(new SiblingConstraint())
        .setWidth((100).percent())
        .setHeight((20).pixels())
        .onMouseEnter(() => {
            if (getSelected(rulesets).length === 0) return;
            animate(clipboardOption, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.secondaryContainer.color));
            });
            animate(clipboardText, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onSecondaryContainer.color));
            });
        })
        .onMouseLeave(() => {
            if (getSelected(rulesets).length === 0) return;
            animate(clipboardOption, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.surfaceContainerLow.color));
            });
            animate(clipboardText, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onSurface.color));
            });
        })
        .onMouseClick(() => {
            let selected = getSelected(rulesets);
            if (selected.length === 0) return;
            optionsVisible = false;
            options.hide(true);
            Toolkit.getDefaultToolkit().getSystemClipboard().setContents(new StringSelection(JSON.stringify(selected)), null)
            exportButton.animateBackgroundColor(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.successContainer.color));
            exportButton.animateLabelColor(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.success.color));
            exportButton.setText("Copied to Clipboard!");
            setTimeout(() => {
                exportButton.animateBackgroundColor(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.primaryContainer.color));
                exportButton.animateLabelColor(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onPrimaryContainer.color));
                exportButton.setText("Export...");
            }, 2000);
        })
        .setChildOf(options);

    let clipboardText = new UIText("Clipboard", false)
        .setColor(colorScheme.dark.onSurface.color)
        .setX((5).percent())
        .setY(new CenterConstraint())
        .setChildOf(clipboardOption);

    let presetOption = new UIBlock()
        .setColor(colorScheme.dark.surfaceContainerLow.color)
        .setX((0).pixels())
        .setY(new SiblingConstraint())
        .setWidth((100).percent())
        .setHeight((20).pixels())
        .onMouseEnter(() => {
            let selected = getSelected(rulesets);
            if (selected.length !== 1 || selected.filter(ruleset => ruleset.preset).length !== 0) return;
            animate(presetOption, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.secondaryContainer.color));
            });
            animate(presetText, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onSecondaryContainer.color));
            });
        })
        .onMouseLeave(() => {
            let selected = getSelected(rulesets);
            if (selected.length !== 1 || selected.filter(ruleset => ruleset.preset).length !== 0) return;
            animate(presetOption, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.surfaceContainerLow.color));
            });
            animate(presetText, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onSurface.color));
            });
        })
        .onMouseClick(() => {
            openPresetForm(getSelected(rulesets)[0]);
        })
        .setChildOf(options);

    let presetText = new UIText("Preset", false)
        .setColor(colorScheme.dark.onSurface.color)
        .setX((5).percent())
        .setY(new CenterConstraint())
        .setChildOf(presetOption);

    const gui = new JavaAdapter(WindowScreen, {
        init() {
            window.setChildOf(this.getWindow());
        }
    });
    gui.init();
    GuiHandler.openGui(gui);
}

function getSelected(rulesets) {
    return rulesets.filter(ruleset => ruleset.selected).map(ruleset => ruleset.value);
}