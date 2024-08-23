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
    UIBlock,
    UIImage,
    UIRoundedRectangle,
    UIText,
    WindowScreen
} from "../../../../Elementa";
import { colorScheme } from "../../color/ColorScheme";
import { editRuleset } from "../../EditRulesetGUI";
import { openRulesets } from "../../ViewRulesGUI";
import { Button } from "../../components/Button";
import { Snackbar } from "../../components/Snackbar";

const Color = Java.type("java.awt.Color");
const DataFlavor = Java.type("java.awt.datatransfer.DataFlavor")
const File = Java.type("java.io.File");
const Toolkit = Java.type("java.awt.Toolkit")

export function importClipboard() {
    let clipboard;
    try {
        clipboard = Toolkit.getDefaultToolkit().getSystemClipboard().getData(DataFlavor.stringFlavor);
        let json = JSON.parse(clipboard);
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
                return;
            }
        } else if (isValid(json)) {
            let id = Settings.rulesets.push(json) - 1;
            Settings.saveRulesets();
            editRuleset(id);
            return;
        }
    } catch (exception) {
    }
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
        .setWidth((40).percent())
        .setHeight((30).percent())
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

    new UIText("Import from Clipboard", false)
        .setColor(colorScheme.dark.surfaceTint.color)
        .setX(new CenterConstraint())
        .setY((5).percent())
        .setTextScale((2).pixels())
        .setChildOf(background);

    let retryButton = new Button(new File("./config/ChatTriggers/modules/HyJanitor/icons/g-restart.png"))
        .setText("Retry", 1.5, false)
        .setBackgroundColor(colorScheme.dark.inverseOnSurface.color)
        .setLabelColor(colorScheme.dark.inverseSurface.color)
        .setX(new CenterConstraint())
        .setY((50).percent())
        .setWidth(new AdditiveConstraint((30).percent(), (40).pixels()))
        .setHeight((40).pixels())
        .setIconSize((20).pixels())
        .onMouseClick(() => {
            importClipboard();
        })
        .setChildOf(background);

    const gui = new JavaAdapter(WindowScreen, {
        init() {
            window.setChildOf(this.getWindow());
        }
    });
    gui.init();
    GuiHandler.openGui(gui);
    let errorSnackbar = new Snackbar(5000)
        .setText("No rulesets were detected in your clipboard.")
        .setWidth((200).pixels())
        .setChildOf(window);
    errorSnackbar.unhide();
}

function isValid(json) {
    return json.version && typeof json.version === "number" && json.name && typeof json.name === "string" && json.rules && Array.isArray(json.rules);
}