/// <reference types="../../../CTAutocomplete" />
/// <reference lib="es2015" />

import Settings from "../../../config";
import {
    AdditiveConstraint,
    animate,
    Animations,
    AspectConstraint,
    CenterConstraint,
    ChildBasedRangeConstraint,
    ChildBasedSizeConstraint,
    ConstantColorConstraint,
    FillConstraint,
    ScrollComponent,
    SiblingConstraint,
    SubtractiveConstraint,
    UIBlock,
    UIContainer,
    UIImage,
    UIMultilineTextInput,
    UIRoundedRectangle,
    UIText,
    UITextInput,
    UIWrappedText,
    WindowScreen
} from "../../../../Elementa";
import { colorScheme, setAlpha } from "../../color/ColorScheme";
import { Button } from "../../components/Button";
import request from "../../../../requestV2";

const Color = Java.type("java.awt.Color");
const File = Java.type("java.io.File");
const StringSelection = Java.type("java.awt.datatransfer.StringSelection");
const Toolkit = Java.type("java.awt.Toolkit");

export function openPresetForm(ruleset) {
    const window = new UIBlock()
        .setX((0).pixels()).setY((0).pixels())
        .setWidth(new FillConstraint()).setHeight(new FillConstraint())
        .setColor(new Color(0, 0, 0, 0));

    const background = new UIRoundedRectangle(35)
        .setColor(colorScheme.dark.surface.color)
        .setX(new CenterConstraint()).setY(new CenterConstraint())
        .setWidth((60).percent()).setHeight((90).percent())
        .setChildOf(window);

    const container = new ScrollComponent()
        .setX(new CenterConstraint()).setY((0).pixels())
        .setWidth((95).percent()).setHeight((100).percent())
        .setChildOf(background);

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
            ChatLib.command("hyjanitor export", true);
        })
        .setChildOf(background);

    const sliderContainer = new UIContainer()
        .setX(new SubtractiveConstraint((100).percent(), (8).pixels())).setY(new CenterConstraint())
        .setWidth((2).pixels()).setHeight(new SubtractiveConstraint((100).percent(), (35).pixels()))
        .setChildOf(background)

    const slider = new UIBlock()
        .setColor(colorScheme.dark.outline.color)
        .setX(new CenterConstraint())
        .setWidth((100).percent())
        .setChildOf(sliderContainer);

    container.setScrollBarComponent(slider, false, false);

    new UIContainer()
        .setX((0).pixels()).setY((0).pixels())
        .setWidth((100).percent()).setHeight((32).pixels());

    new UIText("§lUpload Ruleset", false)
        .setColor(colorScheme.dark.surfaceTint.color)
        .setX((10).percent()).setY((0).pixels())
        .setTextScale((2).pixels())
        .setChildOf(container);

    new UIWrappedText("Before uploading your ruleset, make sure a similar preset does not already exist. " +
        "Additionally, make sure that your ruleset does not remove unrelated messages. Once uploaded, your ruleset needs to be verified and will usually be public within 3 days.\n" +
        "\n" +
        `If your preset is accepted, it will be visible to the public (with attribution to "${Player.getName()}") and anyone will be able to view, install, and edit your code. `)
        .setColor(colorScheme.dark.onSurfaceVariant.color)
        .setX((7.5).percent()).setY(new SiblingConstraint(16))
        .setWidth((80).percent())
        .setChildOf(container);

    new UIBlock()
        .setX((0).pixels()).setY(new SiblingConstraint(15))
        .setWidth((100).percent()).setHeight((1).pixels())
        .setColor(colorScheme.dark.outline.color)
        .setChildOf(container);

    const form = new UIRoundedRectangle(15)
        .setColor(colorScheme.dark.surfaceContainerLow.color)
        .setX(new CenterConstraint()).setY(new SiblingConstraint(16))
        .setWidth((67).percent()).setHeight(new AdditiveConstraint(new ChildBasedRangeConstraint(), (32).pixels()))
        .setChildOf(container);

    new UIText("Author")
        .setColor(colorScheme.dark.surfaceTint.color)
        .setX((8.75).percent()).setY((16).pixels())
        .setTextScale((1.5).pixels())
        .setChildOf(form);

    const authorContainer = new UIContainer()
        .setX((0).pixels()).setY(new SiblingConstraint(8))
        .setWidth((100).percent()).setHeight((40).pixels())
        .setChildOf(form);

    UIImage.ofFile(new File("./config/ChatTriggers/modules/HyJanitor/icons/g-id_card.png"))
        .setColor(colorScheme.dark.onSurfaceVariant.color)
        .setX((7.5).percent()).setY(new CenterConstraint())
        .setWidth(new AspectConstraint()).setHeight((50).percent())
        .setChildOf(authorContainer);

    const nameInputOutline = new UIRoundedRectangle(4)
        .setColor(colorScheme.dark.outline.color)
        .setX((15).percent()).setY(new CenterConstraint())
        .setWidth((45).percent()).setHeight((67).percent())
        .setChildOf(authorContainer);

    const nameInputRectangle = new UIRoundedRectangle(4)
        .setColor(colorScheme.dark.surfaceContainerLow.color)
        .setX(new CenterConstraint()).setY(new CenterConstraint())
        .setWidth(new SubtractiveConstraint((100).percent(), (2).pixels())).setHeight(new SubtractiveConstraint((100).percent(), (2).pixels()))
        .onMouseClick(() => {
            nameInputText.grabWindowFocus();
        })
        .setChildOf(nameInputOutline);

    const nameInputLabelBackground = new UIBlock()
        .setColor(colorScheme.dark.surfaceContainerLow.color)
        .setX((12).pixels()).setY((-2).pixels())
        .setWidth(new AdditiveConstraint(new ChildBasedSizeConstraint(), (3).pixels())).setHeight(new ChildBasedSizeConstraint())
        .setChildOf(nameInputOutline);

    new UIText("Username")
        .setColor(setAlpha(colorScheme.dark.onSurfaceVariant.color, 0.5))
        .setX((2).pixels()).setY((0).pixels())
        .setChildOf(nameInputLabelBackground);

    const nameInputText = new UIText(Player.getName())
        .setColor(setAlpha(colorScheme.dark.onSurfaceVariant.color, 0.5))
        .setX((8).pixels()).setY(new CenterConstraint())
        .setTextScale((1.5).pixels())
        .setChildOf(nameInputRectangle);

    new UIText("Preset Information")
        .setColor(colorScheme.dark.surfaceTint.color)
        .setX((8.75).percent()).setY(new SiblingConstraint(16))
        .setTextScale((1.5).pixels())
        .setChildOf(form);

    const infoContainer = new UIContainer()
        .setX((0).pixels()).setY(new SiblingConstraint(12))
        .setWidth((100).percent()).setHeight((120).pixels())
        .setChildOf(form);

    UIImage.ofFile(new File("./config/ChatTriggers/modules/HyJanitor/icons/g-description.png"))
        .setColor(colorScheme.dark.onSurfaceVariant.color)
        .setX((7.5).percent()).setY(new SubtractiveConstraint(new CenterConstraint(), (40).percent()))
        .setWidth(new AspectConstraint()).setHeight((16.7).percent())
        .setChildOf(infoContainer);

    const titleInputOutline = new UIRoundedRectangle(4)
        .setColor(colorScheme.dark.outline.color)
        .setX((15).percent()).setY(new SubtractiveConstraint(new CenterConstraint(), (40).percent()))
        .setWidth((70).percent()).setHeight((22).percent())
        .setChildOf(infoContainer);

    const titleInputRectangle = new UIRoundedRectangle(4)
        .setColor(colorScheme.dark.surfaceContainerLow.color)
        .setX(new CenterConstraint()).setY(new CenterConstraint())
        .setWidth(new SubtractiveConstraint((100).percent(), (2).pixels())).setHeight(new SubtractiveConstraint((100).percent(), (2).pixels()))
        .onMouseClick(() => {
            titleInputText.grabWindowFocus();
        })
        .setChildOf(titleInputOutline);

    const titleInputLabelBackground = new UIBlock()
        .setColor(colorScheme.dark.surfaceContainerLow.color)
        .setX((16).pixels()).setY((-2).pixels())
        .setWidth(new AdditiveConstraint(new ChildBasedSizeConstraint(), (3).pixels())).setHeight(new ChildBasedSizeConstraint())
        .setChildOf(titleInputOutline);

    new UIText("Preset Name")
        .setColor(colorScheme.dark.onSurfaceVariant.color)
        .setX((2).pixels()).setY((0).pixels())
        .setChildOf(titleInputLabelBackground);

    const titleInputText = new UITextInput()
        .setColor(colorScheme.dark.onSurface.color)
        .setTextScale((1.5).pixels())
        .onKeyType(() => {
            if (titleInputText.getText().length > 20) {
                titleWarning.unhide(true);
            } else {
                titleWarning.hide(true);
            }
        })
        .setChildOf(titleInputRectangle);
    titleInputText.setText(ruleset.name);
    titleInputText.setX((8).pixels()).setY(new CenterConstraint())
        .setWidth(new SubtractiveConstraint(new FillConstraint(), (12).pixels())).setHeight((15).pixels());

    const descriptionInputOutline = new UIRoundedRectangle(4)
        .setColor(colorScheme.dark.outline.color)
        .setX((15).percent()).setY(new SiblingConstraint(10))
        .setWidth((70).percent()).setHeight((70).percent())
        .setChildOf(infoContainer);

    const descriptionInputRectangle = new UIRoundedRectangle(4)
        .setColor(colorScheme.dark.surfaceContainerLow.color)
        .setX(new CenterConstraint()).setY(new CenterConstraint())
        .setWidth(new SubtractiveConstraint((100).percent(), (2).pixels())).setHeight(new SubtractiveConstraint((100).percent(), (2).pixels()))
        .onMouseClick(() => {
            descriptionInputText.grabWindowFocus();
        })
        .setChildOf(descriptionInputOutline);

    const descriptionInputLabelBackground = new UIBlock()
        .setColor(colorScheme.dark.surfaceContainerLow.color)
        .setX((16).pixels()).setY((-2).pixels())
        .setWidth(new AdditiveConstraint(new ChildBasedSizeConstraint(), (3).pixels())).setHeight(new ChildBasedSizeConstraint())
        .setChildOf(descriptionInputOutline);

    new UIText("Preset Description")
        .setColor(colorScheme.dark.onSurfaceVariant.color)
        .setX((2).pixels()).setY((0).pixels())
        .setChildOf(descriptionInputLabelBackground);

    const descriptionInputText = new UIMultilineTextInput()
        .setColor(colorScheme.dark.onSurface.color)
        .setX(new CenterConstraint()).setY((8).pixels())
        .setWidth(new SubtractiveConstraint(new FillConstraint(), (12).pixels())).setHeight((72).pixels())
        .onKeyType(() => {
            if (descriptionInputText.getText().length > 200) {
                descriptionWarning.unhide(true);
            } else {
                descriptionWarning.hide(true);
            }
        })
        .setChildOf(descriptionInputRectangle);

    new UIText("Ruleset Information")
        .setColor(colorScheme.dark.surfaceTint.color)
        .setX((8.75).percent()).setY(new SiblingConstraint(16))
        .setTextScale((1.5).pixels())
        .setChildOf(form);

    const rulesetContainer = new UIContainer()
        .setX((0).pixels()).setY(new SiblingConstraint())
        .setWidth((100).percent()).setHeight((120).pixels())
        .setChildOf(form);

    UIImage.ofFile(new File("./config/ChatTriggers/modules/HyJanitor/icons/g-rule.png"))
        .setColor(colorScheme.dark.onSurfaceVariant.color)
        .setX((7.5).percent()).setY(new SubtractiveConstraint(new CenterConstraint(), (25).percent()))
        .setWidth(new AspectConstraint()).setHeight((16.7).percent())
        .setChildOf(rulesetContainer);

    const rulesetInputOutline = new UIRoundedRectangle(4)
        .setColor(colorScheme.dark.outline.color)
        .setX((15).percent()).setY(new SubtractiveConstraint(new CenterConstraint(), (25).percent()))
        .setWidth((70).percent()).setHeight((22).percent())
        .setChildOf(rulesetContainer);

    const rulesetInputRectangle = new UIRoundedRectangle(4)
        .setColor(colorScheme.dark.surfaceContainerLow.color)
        .setX(new CenterConstraint()).setY(new CenterConstraint())
        .setWidth(new SubtractiveConstraint((100).percent(), (2).pixels())).setHeight(new SubtractiveConstraint((100).percent(), (2).pixels()))
        .onMouseClick(() => {
            rulesetInputText.grabWindowFocus();
        })
        .setChildOf(rulesetInputOutline);

    const rulesetInputLabelBackground = new UIBlock()
        .setColor(colorScheme.dark.surfaceContainerLow.color)
        .setX((16).pixels()).setY((-2).pixels())
        .setWidth(new AdditiveConstraint(new ChildBasedSizeConstraint(), (3).pixels())).setHeight(new ChildBasedSizeConstraint())
        .setChildOf(rulesetInputOutline);

    new UIText("Ruleset Name")
        .setColor(setAlpha(colorScheme.dark.onSurfaceVariant.color, 0.5))
        .setX((2).pixels()).setY((0).pixels())
        .setChildOf(rulesetInputLabelBackground);

    const rulesetInputText = new UIText(ruleset.name)
        .setColor(setAlpha(colorScheme.dark.onSurfaceVariant.color, 0.5))
        .setX((8).pixels()).setY(new CenterConstraint())
        .setTextScale((1.5).pixels())
        .setChildOf(rulesetInputRectangle);

    const rulesInputOutline = new UIRoundedRectangle(4)
        .setColor(colorScheme.dark.outline.color)
        .setX((15).percent()).setY(new SiblingConstraint(8))
        .setWidth((32.5).percent()).setHeight((22).percent())
        .setChildOf(rulesetContainer);

    const rulesInputRectangle = new UIRoundedRectangle(4)
        .setColor(colorScheme.dark.surfaceContainerLow.color)
        .setX(new CenterConstraint()).setY(new CenterConstraint())
        .setWidth(new SubtractiveConstraint((100).percent(), (2).pixels())).setHeight(new SubtractiveConstraint((100).percent(), (2).pixels()))
        .onMouseClick(() => {
            rulesInputText.grabWindowFocus();
        })
        .setChildOf(rulesInputOutline);

    const rulesInputLabelBackground = new UIBlock()
        .setColor(colorScheme.dark.surfaceContainerLow.color)
        .setX((8).pixels()).setY((-2).pixels())
        .setWidth(new AdditiveConstraint(new ChildBasedSizeConstraint(), (3).pixels())).setHeight(new ChildBasedSizeConstraint())
        .setChildOf(rulesInputOutline);

    new UIText("Rules")
        .setColor(setAlpha(colorScheme.dark.onSurfaceVariant.color, 0.5))
        .setX((2).pixels()).setY((0).pixels())
        .setChildOf(rulesInputLabelBackground);

    const rulesInputText = new UIText(ruleset.rules.length)
        .setColor(setAlpha(colorScheme.dark.onSurfaceVariant.color, 0.5))
        .setX((8).pixels()).setY(new CenterConstraint())
        .setTextScale((1.5).pixels())
        .setChildOf(rulesInputRectangle);

    const versionInputOutline = new UIRoundedRectangle(4)
        .setColor(colorScheme.dark.outline.color)
        .setX((52.5).percent()).setY(new AdditiveConstraint(new CenterConstraint(), (3).percent()))
        .setWidth((32.5).percent()).setHeight((22).percent())
        .setChildOf(rulesetContainer);

    const versionInputRectangle = new UIRoundedRectangle(4)
        .setColor(colorScheme.dark.surfaceContainerLow.color)
        .setX(new CenterConstraint()).setY(new CenterConstraint())
        .setWidth(new SubtractiveConstraint((100).percent(), (2).pixels())).setHeight(new SubtractiveConstraint((100).percent(), (2).pixels()))
        .onMouseClick(() => {
            versionInputText.grabWindowFocus();
        })
        .setChildOf(versionInputOutline);

    const versionInputLabelBackground = new UIBlock()
        .setColor(colorScheme.dark.surfaceContainerLow.color)
        .setX((8).pixels()).setY((-2).pixels())
        .setWidth(new AdditiveConstraint(new ChildBasedSizeConstraint(), (3).pixels())).setHeight(new ChildBasedSizeConstraint())
        .setChildOf(versionInputOutline);

    new UIText("Version")
        .setColor(setAlpha(colorScheme.dark.onSurfaceVariant.color, 0.5))
        .setX((2).pixels()).setY((0).pixels())
        .setChildOf(versionInputLabelBackground);

    const versionInputText = new UIText(ruleset.version)
        .setColor(setAlpha(colorScheme.dark.onSurfaceVariant.color, 0.5))
        .setX((8).pixels()).setY(new CenterConstraint())
        .setTextScale((1.5).pixels())
        .setChildOf(versionInputRectangle);

    const typeInputOutline = new UIRoundedRectangle(4)
        .setColor(colorScheme.dark.outline.color)
        .setX((15).percent()).setY(new AdditiveConstraint(new CenterConstraint(), (31).percent()))
        .setWidth((70).percent()).setHeight((22).percent())
        .setChildOf(rulesetContainer);

    const typeInputRectangle = new UIRoundedRectangle(4)
        .setColor(colorScheme.dark.surfaceContainerLow.color)
        .setX(new CenterConstraint()).setY(new CenterConstraint())
        .setWidth(new SubtractiveConstraint((100).percent(), (2).pixels())).setHeight(new SubtractiveConstraint((100).percent(), (2).pixels()))
        .onMouseClick(() => {
            typeInputText.grabWindowFocus();
        })
        .setChildOf(typeInputOutline);

    const typeInputLabelBackground = new UIBlock()
        .setColor(colorScheme.dark.surfaceContainerLow.color)
        .setX((12).pixels()).setY((-2).pixels())
        .setWidth(new AdditiveConstraint(new ChildBasedSizeConstraint(), (3).pixels())).setHeight(new ChildBasedSizeConstraint())
        .setChildOf(typeInputOutline);

    new UIText("Ruleset Type")
        .setColor(setAlpha(colorScheme.dark.onSurfaceVariant.color, 0.5))
        .setX((2).pixels()).setY((0).pixels())
        .setChildOf(typeInputLabelBackground);

    let type;
    switch (ruleset.type) {
        case "ALL": {
            type = "ALL MESSAGES";
            break;
        }
        case "PLAYER": {
            type = "PLAYER MESSAGES ONLY";
            break;
        }
    }

    const typeInputText = new UIText(type)
        .setColor(setAlpha(colorScheme.dark.onSurfaceVariant.color, 0.5))
        .setX((8).pixels()).setY(new CenterConstraint())
        .setTextScale((1.5).pixels())
        .setChildOf(typeInputRectangle);

    const titleWarning = new UIContainer()
        .setX(new CenterConstraint()).setY(new SiblingConstraint())
        .setWidth(new AdditiveConstraint(new ChildBasedSizeConstraint(), (8).pixels())).setHeight((20).pixels())
        .setChildOf(form);
    titleWarning.hide(true);

    const titleWarningIcon = UIImage.ofFile(new File("./config/ChatTriggers/modules/HyJanitor/icons/g-error-filled.png"))
        .setColor(colorScheme.dark.warn.color)
        .setX((0).pixels()).setY(new CenterConstraint())
        .setWidth(new AspectConstraint()).setHeight((67).percent())
        .setChildOf(titleWarning);

    titleWarningIcon.textureMinFilter = UIImage.TextureScalingMode.LINEAR;
    titleWarningIcon.textureMagFilter = UIImage.TextureScalingMode.LINEAR;

    new UIText("Preset Name may be cut off after about 20 characters.", false)
        .setColor(colorScheme.dark.onWarnContainer.color)
        .setX(new SiblingConstraint(8)).setY(new CenterConstraint())
        .setChildOf(titleWarning);

    const descriptionWarning = new UIContainer()
        .setX(new CenterConstraint()).setY(new SiblingConstraint())
        .setWidth(new AdditiveConstraint(new ChildBasedSizeConstraint(), (8).pixels())).setHeight((20).pixels())
        .setChildOf(form);
    descriptionWarning.hide(true);

    const descriptionWarningIcon = UIImage.ofFile(new File("./config/ChatTriggers/modules/HyJanitor/icons/g-error-filled.png"))
        .setColor(colorScheme.dark.warn.color)
        .setX((0).pixels()).setY(new CenterConstraint())
        .setWidth(new AspectConstraint()).setHeight((67).percent())
        .setChildOf(descriptionWarning);

    descriptionWarningIcon.textureMinFilter = UIImage.TextureScalingMode.LINEAR;
    descriptionWarningIcon.textureMagFilter = UIImage.TextureScalingMode.LINEAR;

    new UIText("Preset Description may be cut off after about 200 characters.", false)
        .setColor(colorScheme.dark.onWarnContainer.color)
        .setX(new SiblingConstraint(8)).setY(new CenterConstraint())
        .setChildOf(descriptionWarning);

    new UIBlock()
        .setColor(colorScheme.dark.outline.color)
        .setX((0).pixels()).setY(new SiblingConstraint(15))
        .setWidth((100).percent()).setHeight((1).pixels())
        .setChildOf(container);

    const footerContainer = new UIContainer()
        .setX(new CenterConstraint()).setY(new SiblingConstraint())
        .setWidth((70).percent()).setHeight((50).pixels())
        .setChildOf(container);

    const verifyIcon = UIImage.ofFile(new File("./config/ChatTriggers/modules/HyJanitor/icons/g-verified_user.png"))
        .setColor(colorScheme.dark.tertiary.color)
        .setX((0).pixels()).setY(new CenterConstraint())
        .setWidth(new AspectConstraint()).setHeight((16).pixels())
        .setChildOf(footerContainer);

    verifyIcon.textureMinFilter = UIImage.TextureScalingMode.LINEAR;
    verifyIcon.textureMagFilter = UIImage.TextureScalingMode.LINEAR;

    new UIText("Presets are typically verified within 3 days.", false)
        .setColor(colorScheme.dark.tertiary.color)
        .setX(new SiblingConstraint(8)).setY(new CenterConstraint())
        .setChildOf(footerContainer);

    new Button()
        .setColor("primary", true)
        .setText("Submit", 1.5, false)
        .setX((0).pixels(true)).setY(new CenterConstraint())
        .setWidth((25).percent()).setHeight((25).pixels())
        .onMouseClick(() => {
            loadingWindow.unhide(true);
            request({
                url: 'https://hyjanitor.cognitivitydev.workers.dev/upload',
                headers: {
                    'User-Agent': 'HyJanitor/' + Settings.version,
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: {
                    username: Player.getName(),
                    title: titleInputText.getText(),
                    description: descriptionInputText.getText(),
                    timestamp: Date.now(),
                    content: ruleset
                }
            })
                .then(function (response) {
                    console.log("Uploaded ruleset: " + JSON.parse(response).message);
                    result(JSON.parse(response), true);
                })
                .catch(function (error) {
                    console.error("Failed to upload ruleset: " + error);
                    result(JSON.parse(error), false);
                });
        })
        .setChildOf(footerContainer);

    const loadingWindow = new UIBlock()
        .setColor(new Color(0, 0, 0, 0.5))
        .setX((0).pixels()).setY((0).pixels())
        .setWidth((100).percent()).setHeight((100).percent())
        .setChildOf(window);
    loadingWindow.hide();

    new UIText("Uploading...")
        .setColor(colorScheme.dark.secondary.color)
        .setX(new CenterConstraint()).setY(new CenterConstraint())
        .setTextScale((2).pixels())
        .setChildOf(loadingWindow);

    const gui = new JavaAdapter(WindowScreen, {
        init() {
            window.setChildOf(this.getWindow());
        }
    });
    gui.init();
    GuiHandler.openGui(gui);
}

function result(response, success) {
    const window = new UIBlock()
        .setX((0).pixels()).setY((0).pixels())
        .setWidth(new FillConstraint()).setHeight(new FillConstraint())
        .setColor(new Color(0, 0, 0, 0));

    const background = new UIRoundedRectangle(35)
        .setColor(colorScheme.dark.surface.color)
        .setX(new CenterConstraint()).setY(new CenterConstraint())
        .setWidth((75).percent()).setHeight((70).percent())
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

    const container = new UIContainer()
        .setX(new CenterConstraint()).setY(new CenterConstraint())
        .setWidth((70).percent()).setHeight((30).percent())
        .setChildOf(background);

    const resultContainer = new UIRoundedRectangle(25)
        .setColor(success ? colorScheme.dark.successContainer.color : colorScheme.dark.errorContainer.color)
        .setX((0).pixels()).setY((0).pixels())
        .setWidth(new AspectConstraint()).setHeight((100).percent())
        .setChildOf(container);

    const resultIcon = UIImage.ofFile(new File("./config/ChatTriggers/modules/HyJanitor/icons/g-" + (success ? "check" : "close") + ".png"))
        .setColor(success ? colorScheme.dark.onSuccessContainer.color : colorScheme.dark.onErrorContainer.color)
        .setX(new CenterConstraint()).setY(new CenterConstraint())
        .setWidth(new AspectConstraint()).setHeight((60).percent())
        .setChildOf(resultContainer);

    resultIcon.textureMinFilter = UIImage.TextureScalingMode.LINEAR;
    resultIcon.textureMagFilter = UIImage.TextureScalingMode.LINEAR;

    const textContainer = new UIContainer()
        .setX(new SiblingConstraint(24)).setY(new CenterConstraint())
        .setWidth(new FillConstraint()).setHeight(new ChildBasedSizeConstraint())
        .setChildOf(container);

    new UIWrappedText(success ? "Your ruleset has been submitted for review!" : "Failed to submit your ruleset, try again later.", false)
        .setColor(success ? colorScheme.dark.success.color : colorScheme.dark.error.color)
        .setX((0).pixels()).setY((0).pixels())
        .setWidth((100).percent()).setHeight((15).pixels())
        .setTextScale((1.5).pixels())
        .setChildOf(textContainer);

    new UIContainer()
        .setX((0).pixels()).setY(new SiblingConstraint())
        .setWidth((100).percent()).setHeight((4).pixels())
        .setChildOf(textContainer);

    let text = success ? "It should be verified within 3 days. If you are submitting a preset that you have already created, the existing preset will receive an update."
        : "See the error message below for more info.";

    new UIWrappedText(text, false)
        .setColor(colorScheme.dark.onSurfaceVariant.color)
        .setX((0).pixels()).setY(new SiblingConstraint())
        .setWidth((100).percent())
        .setTextScale((1.5).pixels())
        .setChildOf(textContainer);

    if (!success) {
        const errorContainer = new UIRoundedRectangle(4)
            .setColor(colorScheme.dark.onError.color)
            .setX(new CenterConstraint()).setY(new SiblingConstraint(12))
            .setWidth((70).percent()).setHeight(new AdditiveConstraint(new ChildBasedSizeConstraint(), (8).pixels()))
            .setChildOf(background);

        new UIWrappedText(response.message, false)
            .setColor(colorScheme.dark.error.color)
            .setX(new CenterConstraint()).setY(new CenterConstraint())
            .setWidth(new SubtractiveConstraint((100).percent(), (8).pixels()))
            .setTextScale((1.5).pixels())
            .setChildOf(errorContainer);
    }

    const gui = new JavaAdapter(WindowScreen, {
        init() {
            window.setChildOf(this.getWindow());
        }
    });
    gui.init();
    GuiHandler.openGui(gui);
}