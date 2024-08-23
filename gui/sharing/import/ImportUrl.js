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
    SubtractiveConstraint,
    UIBlock,
    UIImage,
    UIRoundedRectangle,
    UIText,
    UITextInput,
    WindowScreen
} from "../../../../Elementa";
import { colorScheme } from "../../color/ColorScheme";
import { openRulesets } from "../../ViewRulesGUI";
import { editRuleset } from "../../EditRulesetGUI";
import { Button } from "../../components/Button";
import { Snackbar } from "../../components/Snackbar";

const Color = Java.type("java.awt.Color");
const File = Java.type("java.io.File");

export function importUrl() {
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
        .setWidth((70).percent())
        .setHeight((40).percent())
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
            ChatLib.command("hyjanitor import", true);
        })
        .setChildOf(background);

    new UIText("Import from File / URL", false)
        .setColor(colorScheme.dark.surfaceTint.color)
        .setX(new CenterConstraint())
        .setY((5).percent())
        .setTextScale((2).pixels())
        .setChildOf(background);

    const inputOutline = new UIRoundedRectangle(10)
        .setColor(colorScheme.dark.outline.color)
        .setX(new CenterConstraint())
        .setY((33).percent())
        .setWidth((70).percent())
        .setHeight((25).pixels())
        .setChildOf(background);

    const inputRectangle = new UIRoundedRectangle(10)
        .setColor(colorScheme.dark.surface.color)
        .setX(new CenterConstraint())
        .setY(new CenterConstraint)
        .setWidth(new SubtractiveConstraint((100).percent(), (2).pixels()))
        .setHeight(new SubtractiveConstraint((100).percent(), (2).pixels()))
        .onMouseClick(() => {
            inputText.grabWindowFocus();
        })
        .setChildOf(inputOutline);

    const inputLabelBackground = new UIBlock()
        .setColor(colorScheme.dark.surface.color)
        .setX((16).pixels())
        .setY((-3).pixels())
        .setWidth(new AdditiveConstraint(new ChildBasedSizeConstraint(), (3).pixels()))
        .setHeight(new ChildBasedSizeConstraint())
        .setChildOf(inputOutline);

    const inputLabel = new UIText("Location")
        .setColor(colorScheme.dark.onSurfaceVariant.color)
        .setX((2).pixels())
        .setY((0).pixels())
        .setChildOf(inputLabelBackground);

    const inputText = new UITextInput()
        .setColor(colorScheme.dark.onSurface.color)
        .setX((8).pixels())
        .setY(new AdditiveConstraint(new CenterConstraint(), (2).pixels()))
        .setWidth(new SubtractiveConstraint(new FillConstraint(), (12).pixels()))
        .setHeight((15).pixels())
        .setTextScale((1.5).pixels())
        .setChildOf(inputRectangle);

    let fileButtonButton = new Button()
        .setText("Import File", 1.5, false)
        .setBackgroundColor(colorScheme.dark.successContainer.color)
        .setLabelColor(colorScheme.dark.success.color)
        .setX(new SubtractiveConstraint(new CenterConstraint(), (20).percent()))
        .setY((50).percent())
        .setWidth((33).percent())
        .setHeight((40).pixels())
        .onMouseEnter((button) => {
            button.animateBackgroundColor(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onSuccess.color));
        })
        .onMouseLeave((button) => {
            button.animateBackgroundColor(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.successContainer.color));
        })
        .onMouseClick(() => {
            let text = inputText.getText();
            if (!FileLib.exists(text)) {
                let errorSnackbar = new Snackbar(5000)
                    .setText("File does not exist.")
                    .setWidth((200).pixels())
                    .setChildOf(window);
                errorSnackbar.unhide();
                return;
            }
            try {
                let url = FileLib.read(text);
                let json = JSON.parse(url);
                if (!checkJson(json)) {
                    let errorSnackbar = new Snackbar(4000)
                        .setText("File does not contain a ruleset.")
                        .setWidth((250).pixels())
                        .setChildOf(window);
                    errorSnackbar.unhide();
                }
            } catch (exception) {
                let errorSnackbar = new Snackbar(4000)
                    .setText("File does not contain a ruleset.")
                    .setWidth((250).pixels())
                    .setChildOf(window);
                errorSnackbar.unhide();
            }
        })
        .setChildOf(background);

    let urlButton = new Button()
        .setText("Import URL", 1.5, false)
        .setBackgroundColor(colorScheme.dark.successContainer.color)
        .setLabelColor(colorScheme.dark.success.color)
        .setX(new AdditiveConstraint(new CenterConstraint(), (20).percent()))
        .setY((50).percent())
        .setWidth((33).percent())
        .setHeight((40).pixels())
        .onMouseEnter((button) => {
            button.animateBackgroundColor(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onSuccess.color));
        })
        .onMouseLeave((button) => {
            button.animateBackgroundColor(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.successContainer.color));
        })
        .onMouseClick(() => {
            let text = inputText.getText();
            try {
                let url = FileLib.getUrlContent(text);
                let json = JSON.parse(url);
                if (!checkJson(json)) {
                    let errorSnackbar = new Snackbar(4000)
                        .setText("Website does not contain a ruleset.")
                        .setWidth((250).pixels())
                        .setChildOf(window);
                    errorSnackbar.unhide();
                }
            } catch (exception) {
                let errorSnackbar = new Snackbar(4000)
                    .setText("Website does not contain a ruleset.")
                    .setWidth((250).pixels())
                    .setChildOf(window);
                errorSnackbar.unhide();
            }
        })
        .setChildOf(background);

    const gui = new JavaAdapter(WindowScreen, {
        init() {
            window.setChildOf(this.getWindow());
        }
    });
    gui.init();
    GuiHandler.openGui(gui);
}

function checkJson(json) {
    if (Array.isArray(json)) {
        let valid = undefined;
        for (let element of json) {
            if (!isValid(element)) {
                valid = false;
            } else if (valid == undefined) {
                valid = true;
            }
        }
        if (valid) {
            let backup = Settings.rulesets;
            Settings.rulesets = Settings.rulesets.concat(json);
            Settings.saveRulesets();
            openRulesets({
                reason: "Imported " + (json.length == 1 ? "1 ruleset." : json.length + " rulesets."),
                backup: backup
            });
            return true;
        }
    } else if (isValid(json)) {
        let id = Settings.rulesets.push(json) - 1;
        Settings.saveRulesets();
        editRuleset(id);
        return true;
    }
    return false;
}

function isValid(json) {
    return json.version && typeof json.version === "number" && json.name && typeof json.name === "string" && json.rules && Array.isArray(json.rules);
}