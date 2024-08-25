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
    CramSiblingConstraint,
    AspectConstraint,
    ScrollComponent,
    UIWrappedText
} from "../../Elementa";
import { colorScheme } from "./color/ColorScheme";
import { editRuleset } from "./EditRulesetGUI";
import { exportRulesets } from "./sharing/export/ExportGUI";
import { Snackbar } from "./components/Snackbar";
import { Button } from "./components/Button";

const Color = Java.type("java.awt.Color");
const File = Java.type("java.io.File");

export function openRulesets(imported) {
    let errors = [];
    let rulesets = Settings.rulesets;

    const window = new UIBlock()
        .setX((0).pixels()).setY((0).pixels())
        .setWidth(new FillConstraint()).setHeight(new FillConstraint())
        .setColor(new Color(0, 0, 0, 0));

    const background = new UIRoundedRectangle(35)
        .setColor(colorScheme.dark.surface.color)
        .setX(new CenterConstraint()).setY(new CenterConstraint())
        .setWidth(new SubtractiveConstraint((100).percent(), (50).pixels())).setHeight(new SubtractiveConstraint((100).percent(), (50).pixels()))
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
            ChatLib.command("hyjanitor", true);
        })
        .setChildOf(background);


    new UIText("§lHyJanitor")
        .setColor(colorScheme.dark.surfaceTint.color)
        .setX(new CenterConstraint()).setY((5).percent())
        .setTextScale((3).pixels())
        .setChildOf(background);

    new UIText("Edit Rulesets", false)
        .setColor(colorScheme.dark.inverseOnSurface.color)
        .setX(new CenterConstraint()).setY(new AdditiveConstraint((5).percent(), (30).pixels()))
        .setTextScale((2).pixels())
        .setChildOf(background);

    const mainRectangle = new UIRoundedRectangle(10)
        .setColor(colorScheme.dark.surfaceContainer.color)
        .setX(new CenterConstraint()).setY((20).percent())
        .setWidth((90).percent()).setHeight((75).percent())
        .setChildOf(background);

    const container = new ScrollComponent()
        .setX((10).pixels()).setY((10).pixels())
        .setWidth(new SubtractiveConstraint((100).percent(), (20).pixels())).setHeight(new SubtractiveConstraint((100).percent(), (20).pixels()))
        .setChildOf(mainRectangle);

    const slider = new UIBlock()
        .setColor(colorScheme.dark.outline.color)
        .setX(new SubtractiveConstraint((100).percent(), (8).pixels()))
        .setWidth((2).pixels()).setHeight((2).pixels())
        .setChildOf(mainRectangle);

    container.setScrollBarComponent(slider, true, false)


    for(let i = 0; i < rulesets.length; i++) {
        let ruleset = rulesets[i];
        let error = ruleset.version > Settings.rulesetVersion;

        let rulesetRectangle = new UIRoundedRectangle(10)
            .setX(new CramSiblingConstraint(7.5)).setY(new CramSiblingConstraint(7.5))
            .setWidth(new SubtractiveConstraint((33.3).percent(), (5).pixels())).setHeight(new SubtractiveConstraint((14.2).percent(), (6.4).pixels()))
            .onMouseEnter((comp) => {
                animate(comp, (animation) => {
                    animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(!error ? colorScheme.dark.surfaceVariant.color : colorScheme.dark.errorContainer.color));
                });
                animate(rulesetTitle, (animation) => {
                    animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(!error ? colorScheme.dark.onSurface.color : colorScheme.dark.onErrorContainer.color));
                });
            })
            .onMouseLeave((comp) => {
                animate(comp, (animation) => {
                    animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(!error ? colorScheme.dark.surfaceContainerHighest.color : colorScheme.dark.onError.color));
                });
                animate(rulesetTitle, (animation) => {
                    animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(!error ? colorScheme.dark.onSurfaceVariant.color : colorScheme.dark.error.color));
                });
            })
            .onMouseClick(() => {
                editRuleset(rulesets.indexOf(ruleset));
            })
            .setChildOf(container);

        let rulesetTitle = new UIWrappedText("", false, null, false, true, 9, "...")
            .setX((12).pixels()).setY(new CenterConstraint())
            .setWidth(new SubtractiveConstraint(new FillConstraint(), (8).pixels())).setHeight((15).pixels())
            .setTextScale((1.5).pixels())
            .setChildOf(rulesetRectangle);

        rulesetTitle.setText(ruleset.name);
        if(error) {
            rulesetRectangle.setColor(colorScheme.dark.onError.color);
            rulesetTitle.setColor(colorScheme.dark.error.color);
            let difference = ruleset.version-Settings.rulesetVersion;
            errors.push("\""+ruleset.name+"\" is made for "+difference+" version"+(difference == 1 ? "" : "s")+" ahead of your current version. (v"+Settings.version+")");
        } else {
            rulesetRectangle.setColor(colorScheme.dark.surfaceContainerHighest.color);
            rulesetTitle.setColor(colorScheme.dark.onSurface.color);
        }

        UIImage.ofFile(new File("./config/ChatTriggers/modules/HyJanitor/icons/g-forward.png"))
            .setColor(!error ? colorScheme.dark.surfaceTint.color : colorScheme.dark.onErrorContainer.color)
            .setX(new AdditiveConstraint(new CenterConstraint(), (42.5).percent())).setY(new CenterConstraint())
            .setWidth((24).pixels()).setHeight(new AspectConstraint())
            .setChildOf(rulesetRectangle);
    }

    let rulesetRectangle = new UIRoundedRectangle(10)
        .setColor(colorScheme.dark.onSecondary.color)
        .setX(new CramSiblingConstraint(7.5)).setY(new CramSiblingConstraint(7.5))
        .setWidth(new SubtractiveConstraint((33.3).percent(), (5).pixels())).setHeight(new SubtractiveConstraint((14.2).percent(), (6.4).pixels()))
        .onMouseEnter((comp) => {
            animate(comp, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.secondaryContainer.color));
            });
        })
        .onMouseLeave((comp) => {
            animate(comp, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onSecondary.color));
            });
        })
        .onMouseClick(() => {
            editRuleset(-1);
        })
        .setChildOf(container);

    let rulesetTitle = new UIText("Create", false)
        .setColor(colorScheme.dark.onSecondaryContainer.color)
        .setX((12).pixels()).setY(new CenterConstraint())
        .setTextScale((1.5).pixels())
        .setChildOf(rulesetRectangle);

    let rulesetIcon = UIImage.ofFile(new File("./config/ChatTriggers/modules/HyJanitor/icons/g-edit_pencil.png"))
        .setColor(colorScheme.dark.onSecondaryContainer.color)
        .setX(new AdditiveConstraint(new CenterConstraint(), (42).percent())).setY(new CenterConstraint())
        .setWidth((16).pixels()).setHeight(new AspectConstraint())
        .setChildOf(rulesetRectangle);

    let importRectangle = new UIRoundedRectangle(10)
        .setColor(colorScheme.dark.onSuccess.color)
        .setX(new CramSiblingConstraint(7.5)).setY(new CramSiblingConstraint(7.5))
        .setWidth(new SubtractiveConstraint((33.3).percent(), (5).pixels())).setHeight(new SubtractiveConstraint((14.2).percent(), (6.4).pixels()))
        .onMouseEnter((comp) => {
            animate(comp, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.successContainer.color));
            });
        })
        .onMouseLeave((comp) => {
            animate(comp, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onSuccess.color));
            });
        })
        .onMouseClick(() => {
            ChatLib.command("hyjanitor import", true);
        })
        .setChildOf(container);

    let importTitle = new UIText("Import", false)
        .setColor(colorScheme.dark.success.color)
        .setX((12).pixels()).setY(new CenterConstraint())
        .setTextScale((1.5).pixels())
        .setChildOf(importRectangle);

    let importIcon = UIImage.ofFile(new File("./config/ChatTriggers/modules/HyJanitor/icons/g-download.png"))
        .setColor(colorScheme.dark.success.color)
        .setX(new AdditiveConstraint(new CenterConstraint(), (42).percent())).setY(new CenterConstraint())
        .setWidth((20).pixels()).setHeight(new AspectConstraint())
        .setChildOf(importRectangle);

    let exportRectangle = new UIRoundedRectangle(10)
        .setColor(colorScheme.dark.onWarn.color)
        .setX(new CramSiblingConstraint(7.5)).setY(new CramSiblingConstraint(7.5))
        .setWidth(new SubtractiveConstraint((33.3).percent(), (5).pixels())).setHeight(new SubtractiveConstraint((14.2).percent(), (6.4).pixels()))
        .onMouseEnter((comp) => {
            animate(comp, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.warnContainer.color));
            });
        })
        .onMouseLeave((comp) => {
            animate(comp, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onWarn.color));
            });
        })
        .onMouseClick(() => {
            exportRulesets();
        })
        .setChildOf(container);

    let exportTitle = new UIText("Export", false)
        .setColor(colorScheme.dark.warn.color)
        .setX((12).pixels()).setY(new CenterConstraint())
        .setTextScale((1.5).pixels())
        .setChildOf(exportRectangle);

    let exportIcon = UIImage.ofFile(new File("./config/ChatTriggers/modules/HyJanitor/icons/g-upload.png"))
        .setColor(colorScheme.dark.warn.color)
        .setX(new AdditiveConstraint(new CenterConstraint(), (42).percent())).setY(new CenterConstraint())
        .setWidth((20).pixels()).setHeight(new AspectConstraint())
        .setChildOf(exportRectangle);

    const gui = new JavaAdapter(WindowScreen, {
        init() {
            window.setChildOf(this.getWindow());
        }
    });
    gui.init();
    GuiHandler.openGui(gui);

    if(errors.length > 0) {
        let text;
        if(errors.length > 2) {
            text = errors[0]+"\n§o  ... "+(errors.length-1)+" other rulesets have errors.";
        } else {
            text = errors.join("\n");
        }
        let closeButton = new Button()
            .setText("Close", 1, false)
            .setWidth((75).pixels());
        new Snackbar(10000, closeButton)
            .setText(text, 1, false)
            .setWidth((75).percent())
            .onButtonClick((snackbar) => {
                snackbar.hide();
            })
            .setChildOf(window)
            .unhide();
    }

    if(imported) {
        const welcomeConfirm = new Button()
            .setText("Undo", 1, false)
            .setWidth((75).pixels());
        let importedSnackbar = new Snackbar(5000, welcomeConfirm)
            .setText(imported.reason)
            .setWidth((200).pixels())
            .onButtonClick((button) => {
                button.hide();
                if(imported.backup) {
                    Settings.rulesets = imported.backup;
                    openRulesets();
                } else {
                    let errorSnackbar = new Snackbar(5000)
                        .setText("Something went wrong.")
                        .setWidth((200).pixels())
                        .setChildOf(window);
                    errorSnackbar.unhide();
                }
            })
            .setChildOf(window);
        importedSnackbar.unhide();
    }
}