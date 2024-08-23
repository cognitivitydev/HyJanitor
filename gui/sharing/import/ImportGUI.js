/// <reference types="../../../CTAutocomplete" />
/// <reference lib="es2015" />

import Settings from "../../../config";
import {
    animate,
    Animations,
    AspectConstraint,
    CenterConstraint,
    ChildBasedSizeConstraint,
    ConstantColorConstraint,
    FillConstraint,
    SiblingConstraint,
    UIBlock,
    UIContainer,
    UIImage,
    UIRoundedRectangle,
    UIText,
    WindowScreen
} from "../../../../Elementa";
import { colorScheme } from "../../color/ColorScheme";
import { importPreset } from "./ImportPresetGUI";
import { importUrl } from "./ImportUrl";
import { Button } from "../../components/Button";
import { Snackbar } from "../../components/Snackbar";
import { editRuleset } from "../../EditRulesetGUI";
import { openRulesets } from "../../ViewRulesGUI";

const Color = Java.type("java.awt.Color");
const DataFlavor = Java.type("java.awt.datatransfer.DataFlavor");
const File = Java.type("java.io.File");
const Toolkit = Java.type("java.awt.Toolkit");

const options = [
    {title: "Import from Presets", icon: "g-language", click: () => importPreset()},
    {title: "Import from Clipboard", icon: "g-assignment", click: () => importClipboard()},
    {title: "Import from File / URL", icon: "g-draft", click: () => importUrl()}
]

let window;

export function openImports() {
    window = new UIBlock()
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

    new UIText("Import Ruleset...", false)
        .setColor(colorScheme.dark.surfaceTint.color)
        .setX(new CenterConstraint())
        .setY((5).percent())
        .setTextScale((2).pixels())
        .setChildOf(background);

    const container = new UIContainer()
        .setX(new CenterConstraint())
        .setY(new CenterConstraint())
        .setWidth((70).percent())
        .setHeight(new ChildBasedSizeConstraint())
        .setChildOf(background);

    for (let i in options) {
        let option = options[i];

        let optionButton = new Button(new File("./config/ChatTriggers/modules/HyJanitor/icons/" + option.icon + ".png"))
            .setText(option.title, 1.5, false)
            .setBackgroundColor(colorScheme.dark.surfaceContainer.color)
            .setLabelColor(colorScheme.dark.secondary.color)
            .setX(new CenterConstraint())
            .setY(new SiblingConstraint(8))
            .setWidth((100).percent())
            .setHeight((40).pixels())
            .setIconSize((24).pixels())
            .onMouseEnter((button) => {
                button.animateBackgroundColor(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.surfaceContainerHigh.color));
            })
            .onMouseLeave((button) => {
                button.animateBackgroundColor(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.surfaceContainer.color));
            })
            .onMouseClick(() => option.click())
            .setChildOf(container);
    }

    const gui = new JavaAdapter(WindowScreen, {
        init() {
            window.setChildOf(this.getWindow());
        }
    });
    gui.init();
    GuiHandler.openGui(gui);
}

function importClipboard() {
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
        console.warn("Couldn't get rulesets from clipboard: " + exception)
    }

    let retryButton = new Button()
        .setWidth((50).pixels())
        .setText("Retry", 1, false);

    let errorSnackbar = new Snackbar(5000, retryButton)
        .setText("No rulesets were detected in your clipboard.")
        .setWidth((200).pixels())
        .onButtonClick((button) => {
            button.hide();
            importClipboard();
        })
        .setChildOf(window);
    errorSnackbar.unhide();
}

function isValid(json) {
    return json.version && typeof json.version === "number" && json.name && typeof json.name === "string" && json.rules && Array.isArray(json.rules);
}