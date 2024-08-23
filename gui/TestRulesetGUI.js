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
    UIContainer,
    ScrollComponent,
    UITextInput,
    ChildBasedSizeConstraint
} from "../../Elementa";
import { evaluateRuleset } from "../chat/ChatManager";
import { colorScheme } from "./color/ColorScheme";

const Color = Java.type("java.awt.Color");
const File = Java.type("java.io.File");
const System = Java.type("java.lang.System");

export function testRuleset(id) {
    let rulesets = Settings.rulesets;
    let ruleset = rulesets[id];
    if(!ruleset) {
        return;
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
            ChatLib.command("hyjanitor ruleset "+id, true);
        })
        .setChildOf(background);

    new UIText("§lHyJanitor")
        .setColor(colorScheme.dark.surfaceTint.color)
        .setX(new CenterConstraint())
        .setY((5).percent())
        .setTextScale((3).pixels())
        .setChildOf(background);

    new UIText("Test Ruleset", false)
        .setColor(colorScheme.dark.inverseOnSurface.color)
        .setX(new CenterConstraint())
        .setY(new AdditiveConstraint((5).percent(), (30).pixels()))
        .setTextScale((2).pixels())
        .setChildOf(background);

    const inputOutline = new UIRoundedRectangle(10)
        .setColor(colorScheme.dark.outline.color)
        .setX(new CenterConstraint())
        .setY((25).percent())
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
        .setY((-2).pixels())
        .setWidth(new AdditiveConstraint(new ChildBasedSizeConstraint(), (3).pixels()))
        .setHeight(new ChildBasedSizeConstraint())
        .setChildOf(inputOutline);

    const inputLabel = new UIText("Input")
        .setColor(colorScheme.dark.onSurfaceVariant.color)
        .setX((2).pixels())
        .setY((0).pixels())
        .setChildOf(inputLabelBackground);

    let results = [];

    const inputText = new UITextInput()
        .setColor(colorScheme.dark.onSurface.color)
        .setX((8).pixels())
        .setY(new AdditiveConstraint(new CenterConstraint(), (2).pixels()))
        .setWidth(new SubtractiveConstraint(new FillConstraint(), (12).pixels()))
        .setHeight((15).pixels())
        .setTextScale((1.5).pixels())
        .onKeyType(() => {
            let start = System.nanoTime();
            results = evaluateRuleset(ruleset, inputText.getText(), inputText.getText());
            let end = System.nanoTime();
            let elapsed = ((end-start)/1000000);
            time.setText("Evaluated in "+elapsed.toFixed(2)+" ms");
            if(elapsed > 1) {
                time.setColor(colorScheme.dark.onError.color);
            } else {
                time.setColor(colorScheme.dark.surfaceVariant.color);
            }
            if(results.includes(true)) {
                checkIcon.hide(true);
                failIcon.unhide(true);
                description.setText("Your input text will be removed by this ruleset.");
            } else {
                checkIcon.unhide(true);
                failIcon.hide(true);
                description.setText("Your input text will not be removed by this ruleset.")
            }
            scroll.clearChildren();
            for(let i = 0; i < results.length; i++) {
                let result = results[i];

                let resultContainer = new UIContainer()
                    .setX(new CramSiblingConstraint(8))
                    .setY(new CramSiblingConstraint(8))
                    .setWidth(new SubtractiveConstraint((50).percent(), (15).pixels()))
                    .setHeight((10).percent())
                    .setChildOf(scroll);

                let image;
                let color1;
                let color2;
                if(result) {
                    image = UIImage.ofFile(new File("./config/ChatTriggers/modules/HyJanitor/icons/g-close.png"));
                    color1 = colorScheme.dark.error.color;
                    color2 = colorScheme.dark.onErrorContainer.color;
                } else {
                    image = UIImage.ofFile(new File("./config/ChatTriggers/modules/HyJanitor/icons/g-check.png"));
                    color1 = colorScheme.dark.primary.color;
                    color2 = colorScheme.dark.secondary.color;
                }

                image.setColor(color1)
                    .setX(new SubtractiveConstraint(new CenterConstraint(), (25).percent()))
                    .setY(new CenterConstraint())
                    .setWidth((result ? 20 : 16).pixels())
                    .setHeight(new AspectConstraint())
                    .setChildOf(resultContainer);

                new UIText("Rule #"+(i+1))
                    .setColor(color2)
                    .setX((40).percent())
                    .setY(new AdditiveConstraint(new CenterConstraint(), (2).pixels()))
                    .setTextScale((1.5).pixels())
                    .setChildOf(resultContainer);
            }
        })
        .setChildOf(inputRectangle);

    const checkIcon = UIImage.ofFile(new File("./config/ChatTriggers/modules/HyJanitor/icons/g-check.png"))
        .setColor(colorScheme.dark.primary.color)
        .setX(new AdditiveConstraint((100).percent(), (8).pixels()))
        .setY(new CenterConstraint())
        .setWidth((24).pixels())
        .setHeight(new AspectConstraint())
        .setChildOf(inputOutline);

    const failIcon = UIImage.ofFile(new File("./config/ChatTriggers/modules/HyJanitor/icons/g-close.png"))
        .setColor(colorScheme.dark.primary.color)
        .setX(new AdditiveConstraint((100).percent(), (8).pixels()))
        .setY(new CenterConstraint())
        .setWidth((28).pixels())
        .setHeight(new AspectConstraint())
        .setChildOf(inputOutline);

    const description = new UIText("Input a sample message above to see if the rules will remove it.")
        .setColor(colorScheme.dark.secondary.color)
        .setX(new CenterConstraint())
        .setY((33).percent())
        .setTextScale((1.5).pixels())
        .setChildOf(background);

    const mainRectangle = new UIRoundedRectangle(20)
        .setColor(colorScheme.dark.surfaceContainer.color)
        .setX(new CenterConstraint())
        .setY((40).percent())
        .setWidth((30).percent())
        .setHeight((50).percent())
        .setChildOf(background);

    const time = new UIText("Evaluated in 0.00 ms")
        .setColor(colorScheme.dark.surfaceVariant.color)
        .setX(new CenterConstraint())
        .setY(new AdditiveConstraint((100).percent(), (8).pixels()))
        .setChildOf(mainRectangle)

    const scroll = new ScrollComponent()
        .setX(new CenterConstraint())
        .setY(new CenterConstraint())
        .setWidth(new SubtractiveConstraint((100).percent(), (4).pixels()))
        .setHeight(new SubtractiveConstraint((100).percent(), (4).pixels()))
        .setChildOf(mainRectangle);

    const slider = new UIBlock()
        .setColor(colorScheme.dark.outline.color)
        .setX(new SubtractiveConstraint((100).percent(), (18).pixels()))
        .setY((5).pixels())
        .setWidth((2).pixels())
        .setHeight((2).pixels())
        .setChildOf(mainRectangle);

    scroll.setScrollBarComponent(slider, true, false)

    checkIcon.hide(true);
    failIcon.hide(true);

    const gui = new JavaAdapter(WindowScreen, {
        init() {
            window.setChildOf(this.getWindow());
        }
    });
    gui.init();
    GuiHandler.openGui(gui);
}