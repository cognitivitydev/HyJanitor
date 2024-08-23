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
    MarkdownComponent,
    ScrollComponent,
    UITextInput,
    ChildBasedSizeConstraint
} from "../../Elementa";
import { colorScheme } from "./color/ColorScheme";
import { testRuleset } from "./TestRulesetGUI";
import { Button } from "./components/Button";
import { Dialog } from "./components/Dialog";
import { Snackbar } from "./components/Snackbar";

const Color = Java.type("java.awt.Color");
const File = Java.type("java.io.File");
const Pattern = Java.type("java.util.regex.Pattern");

export function editRule(id, index) {
    let rulesets = Settings.rulesets;
    let ruleset = rulesets[id];
    if(!ruleset) {
        return;
    }
    if(!ruleset.rules[index]) {
        index = ruleset.rules.push([]) - 1;
        Settings.rulesets = rulesets;
    }
    let repairs = 0;
    let rule = [];
    for(let i = 0; i < ruleset.rules[index].length; i++) {
        let component = ruleset.rules[index][i];
        if(i == 0) {
            rule.push(component);
            continue;
        }
        let lastType = rule[rule.length-1].type;
        if(component.type === "COMPARATOR" && lastType === "COMPARATOR") {
            ChatLib.chat("repairing "+i)
            repairs++;
            rule.push({"type":"MATCH","search":"start","string":"","inverse":false});
        } else if(component.type === "MATCH" && lastType === "MATCH") {
            ChatLib.chat("repairing "+i)
            repairs++;
            rule.push({"type":"COMPARATOR","operator":"and"});
        }
        rule.push(component);
    }
    if(repairs !== 0) ruleset.rules[index] = rule;

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

    new UIText("Edit Rule #"+(index+1), false)
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

    let messageButton = new Button(new File("./config/ChatTriggers/modules/HyJanitor/icons/g-chat.png"))
        .setText("...", 1.5, false)
        .setColor("tertiary", true)
        .setX((1).percent())
        .setY((10).pixels())
        .setWidth(new AdditiveConstraint((20).percent(), (20).pixels()))
        .setHeight((20).pixels())
        .setIconSize((16).pixels())
        .onMouseClick((button) => {
            if(ruleset.type === "PLAYER") {
                ruleset.type = "ALL";
                button.setText("All Messages");
            } else {
                ruleset.type = "PLAYER";
                button.setText("Player Messages");
            }
            Settings.rulesets = rulesets;
        })
        .setChildOf(mainRectangle);

        if(ruleset.type === "PLAYER") {
        messageButton.setText("Player Messages");
    } else {
        ruleset.type = "ALL";
        messageButton.setText("All Messages");
    }

    new Button(new File("./config/ChatTriggers/modules/HyJanitor/icons/g-rule.png"))
        .setText("Test Ruleset", 1.5, false)
        .setColor("success", true)
        .setX(new SubtractiveConstraint(new CenterConstraint(), (10).percent()))
        .setY((10).pixels())
        .setWidth(new AdditiveConstraint((15).percent(), (20).pixels()))
        .setHeight((20).pixels())
        .setIconSize((16).pixels())
        .onMouseClick(() => {
            testRuleset(id);
        })
        .setChildOf(mainRectangle);

    new Button(new File("./config/ChatTriggers/modules/HyJanitor/icons/g-info.png"))
        .setText("Information", 1.5, false)
        .setColor("primary", true)
        .setX(new AdditiveConstraint(new CenterConstraint(), (10).percent()))
        .setY((10).pixels())
        .setWidth(new AdditiveConstraint((15).percent(), (20).pixels()))
        .setHeight((20).pixels())
        .setIconSize((17).pixels())
        .onMouseClick(() => {
            helpWindow.unhide(true);
        })
        .setChildOf(mainRectangle);

    new Button(new File("./config/ChatTriggers/modules/HyJanitor/icons/g-delete.png"))
        .setText("Delete Rule", 1.5, false)
        .setColor("error", true)
        .setX(new AdditiveConstraint(new CenterConstraint(), (40).percent()))
        .setY((10).pixels())
        .setWidth(new AdditiveConstraint((15).percent(), (20).pixels()))
        .setHeight((20).pixels())
        .setIconSize((17).pixels())
        .onMouseClick(() => {
            ruleset.rules.splice(index, 1);
            ChatLib.command("hyjanitor ruleset "+id, true)
        })
        .setChildOf(mainRectangle);

    new UIBlock()
        .setColor(colorScheme.dark.outlineVariant.color)
        .setX(new CenterConstraint())
        .setY((40).pixels())
        .setWidth((95).percent())
        .setHeight((1).pixels())
        .setChildOf(mainRectangle);

    const container = new UIContainer()
        .setX(new CenterConstraint())
        .setY((50).pixels())
        .setWidth((100).percent())
        .setHeight(new SubtractiveConstraint((100).percent(), (50).pixels()))
        .setChildOf(mainRectangle)

    const scroll = new ScrollComponent("Loading...")
        .setX((0).pixels())
        .setY((0).pixels())
        .setWidth((95).percent())
        .setHeight((95).percent())
        .setChildOf(container);

    const slider = new UIBlock()
        .setColor(colorScheme.dark.outline.color)
        .setX(new SubtractiveConstraint((100).percent(), (8).pixels()))
        .setWidth((2).pixels())
        .setChildOf(container);

    scroll.setScrollBarComponent(slider, true, false)


    for(let i = 0; i < ruleset.rules[index].length; i++) {
        let component = ruleset.rules[index][i];
        if(component.type === "MATCH") {
            let container = new UIContainer()
                .setX(new CenterConstraint())
                .setY(new CramSiblingConstraint(4))
                .setWidth((98).percent())
                .setHeight((24).pixels())
                .setChildOf(scroll);

            let inverseRectangle = new UIRoundedRectangle(4)
                .setColor(colorScheme.dark.successContainer.color)
                .setX((0).percent())
                .setY(new CenterConstraint())
                .setWidth((20).pixels())
                .setHeight(new AspectConstraint())
                .onMouseEnter((comp) => {
                    if(component.inverse) {
                        animate(comp, (animation) => {
                            animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onError.color));
                        });
                        animate(inverseIcon, (animation) => {
                            animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.error.color));
                        });
                    } else {
                        animate(comp, (animation) => {
                            animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onSuccess.color));
                        });
                        animate(normalIcon, (animation) => {
                            animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.success.color));
                        });
                    }
                })
                .onMouseLeave((comp) => {
                    if(component.inverse) {
                        animate(comp, (animation) => {
                            animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.errorContainer.color));
                        });
                        animate(inverseIcon, (animation) => {
                            animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onErrorContainer.color));
                        });
                    } else {
                        animate(comp, (animation) => {
                            animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.successContainer.color));
                        });
                        animate(normalIcon, (animation) => {
                            animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onSuccessContainer.color));
                        });
                    }
                })
                .onMouseClick(() => {
                    component.inverse = !component.inverse;
                    Settings.rulesets = rulesets;
                    if(component.inverse) {
                        inverseRectangle.setColor(colorScheme.dark.onError.color);
                        inverseIcon.unhide(true);
                        normalIcon.hide(true);
                        matchText.setText("§m"+matchText.getText());
                    } else {
                        inverseRectangle.setColor(colorScheme.dark.onSuccess.color);
                        normalIcon.unhide(true);
                        inverseIcon.hide(true);
                        matchText.setText(matchText.getText().replace("§m", ""));
                    }
                })
                .setChildOf(container);

            if(component.inverse) {
                inverseRectangle.setColor(colorScheme.dark.errorContainer.color);
            }

            let normalIcon = UIImage.ofFile(new File("./config/ChatTriggers/modules/HyJanitor/icons/g-comment.png"))
                .setColor(colorScheme.dark.success.color)
                .setX(new CenterConstraint())
                .setY(new CenterConstraint())
                .setWidth((16).pixels())
                .setHeight(new AspectConstraint())
                .setChildOf(inverseRectangle);

            let inverseIcon = UIImage.ofFile(new File("./config/ChatTriggers/modules/HyJanitor/icons/g-comments_disabled.png"))
                .setColor(colorScheme.dark.error.color)
                .setX(new CenterConstraint())
                .setY(new CenterConstraint())
                .setWidth((16).pixels())
                .setHeight(new AspectConstraint())
                .setChildOf(inverseRectangle);

            if(component.inverse) {
                normalIcon.hide(true);
            } else {
                inverseIcon.hide(true);
            }

            let matchRectangle = new UIRoundedRectangle(4)
                .setColor(colorScheme.dark.tertiary.color)
                .setX((24).pixels())
                .setY(new CenterConstraint())
                .setWidth((16).percent())
                .setHeight((16).pixels())
                .onMouseEnter(() => {
                    animate(matchText, (animation) => {
                        animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onTertiary.color));
                    });
                })
                .onMouseLeave(() => {
                    animate(matchText, (animation) => {
                        animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.tertiaryContainer.color));
                    });
                })
                .onMouseClick(() => {
                    if(component.search === "start") {
                        component.search = "end";
                        matchText.setText("§lENDS WITH");
                    } else if(component.search === "end") {
                        component.search = "contains";
                        matchText.setText("§lCONTAINS");
                    } else if(component.search === "contains") {
                        component.search = "equals";
                        matchText.setText("§lEQUALS");
                    } else if(component.search === "equals") {
                        component.search = "regex";
                        matchText.setText("§lREGEX");
                    } else if(component.search === "regex") {
                        component.search = "start";
                        matchText.setText("§lSTARTS WITH");
                    }
                    if(component.inverse) {
                        matchText.setText("§m"+matchText.getText());
                    }
                    Settings.rulesets = rulesets;
                })
                .setChildOf(container);

            let searchName = "?"
            switch (component.search) {
                case "start":
                    searchName = "STARTS WITH";
                    break;
                case "end":
                    searchName = "ENDS WITH";
                    break;
                case "contains":
                    searchName = "CONTAINS";
                    break;
                case "equals":
                    searchName = "EQUALS";
                    break;
                case "regex":
                    searchName = "REGEX";
                    break;
            }

            let matchText = new UIText("§l"+searchName, false)
                .setColor(colorScheme.dark.tertiaryContainer.color)
                .setX(new CenterConstraint())
                .setY(new CenterConstraint())
                .setTextScale((1.5).pixels())
                .setChildOf(matchRectangle);
            if(component.inverse) matchText.setText("§m"+matchText.getText())

            let stringRectangle = new UIRoundedRectangle(4)
                .setColor(colorScheme.dark.surfaceContainerHighest.color)
                .setX(new SiblingConstraint(4))
                .setY(new CenterConstraint())
                .setWidth(new SubtractiveConstraint(new FillConstraint(), (8).pixels()))
                .setHeight((16).pixels())
                .onMouseClick(() => {
                    text.grabWindowFocus();
                })
                .setChildOf(container);

            let text = new UITextInput()
                .setColor(colorScheme.dark.onSurfaceVariant.color)
                .setX((4).pixels())
                .setY(new CenterConstraint())
                .setWidth((250).pixels())
                .setHeight((15).pixels())
                .setTextScale((1.5).pixels())
                .onKeyType(() => {
                    component.string = text.getText();
                    text.setColor(colorScheme.dark.onSurfaceVariant.color);
                    if(component.search === "regex") {
                        try {
                            Pattern.compile(component.string);
                        } catch(exception) {
                            text.setColor(colorScheme.dark.error.color);
                        }
                    }
                })
                .onFocusLost(() => {
                    Settings.rulesets = rulesets;
                })
                .setChildOf(stringRectangle);
            text.setText(component.string);
            text.setWidth(new SubtractiveConstraint(new FillConstraint(), (8).pixels()));

            let deleteRectangle = new UIRoundedRectangle(4)
                .setColor(colorScheme.dark.errorContainer.color)
                .setX(new SiblingConstraint(4))
                .setY(new CenterConstraint())
                .setWidth((16).pixels())
                .setHeight(new AspectConstraint())
                .onMouseEnter((comp) => {
                    animate(comp, (animation) => {
                        animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onError.color));
                    });
                    animate(deleteIcon, (animation) => {
                        animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.error.color));
                    });
                })
                .onMouseLeave((comp) => {
                    animate(comp, (animation) => {
                        animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.errorContainer.color));
                    });
                    animate(deleteIcon, (animation) => {
                        animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onErrorContainer.color));
                    });
                })
                .onMouseClick(() => {
                    if(ruleset.rules[index].indexOf(component) == 0) {
                        ruleset.rules[index].splice(0, 2);
                    } else {
                        ruleset.rules[index].splice(ruleset.rules[index].indexOf(component)-1, 2);
                    }
                    Settings.rulesets = rulesets;
                    editRule(id, index);
                })
                .setChildOf(container);

            let deleteIcon = UIImage.ofFile(new File("./config/ChatTriggers/modules/HyJanitor/icons/g-delete.png"))
                .setColor(colorScheme.dark.onErrorContainer.color)
                .setX(new CenterConstraint())
                .setY(new CenterConstraint())
                .setWidth((12).pixels())
                .setHeight(new AspectConstraint())
                .setChildOf(deleteRectangle);
        } else if(component.type === "COMPARATOR") {
            let container = new UIContainer()
                .setX(new CenterConstraint())
                .setY(new CramSiblingConstraint(4))
                .setWidth((98).percent())
                .setHeight((24).pixels())
                .setChildOf(scroll);

            let comparatorRectangle = new UIRoundedRectangle(4)
                .setX(new CenterConstraint())
                .setY(new CenterConstraint())
                .setWidth((6).percent())
                .setHeight((16).pixels())
                .onMouseEnter((comp) => {
                    animate(comp, (animation) => {
                        animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onSecondary.color));
                    });
                    animate(comparatorText, (animation) => {
                        animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.secondary.color));
                    });
                })
                .onMouseLeave((comp) => {
                    if(component.operator === "and") {
                        animate(comp, (animation) => {
                            animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.primaryContainer.color));
                        });
                        animate(comparatorText, (animation) => {
                            animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onPrimaryContainer.color));
                        });
                    } else if(component.operator === "or") {
                        animate(comp, (animation) => {
                            animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.secondaryContainer.color));
                        });
                        animate(comparatorText, (animation) => {
                            animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onSecondaryContainer.color));

                        });
                    }
                })
                .onMouseClick(() => {
                    comparatorRectangle.setColor(colorScheme.dark.onSecondary.color);
                    comparatorText.setColor(colorScheme.dark.secondary.color);
                    if(component.operator === "and") {
                        component.operator = "or";
                        Settings.rulesets = rulesets;
                        comparatorText.setText("§lOR");
                    } else if(component.operator === "or") {
                        component.operator = "and";
                        Settings.rulesets = rulesets;
                        comparatorText.setText("§lAND");
                    }
                })
                .setChildOf(container);

            let comparatorText = new UIText("§l???", false)
                .setX(new CenterConstraint())
                .setY(new CenterConstraint())
                .setTextScale((1.5).pixels())
                .setChildOf(comparatorRectangle);

            if(component.operator === "and") {
                comparatorRectangle.setColor(colorScheme.dark.primaryContainer.color);
                comparatorText.setText("§lAND").setColor(colorScheme.dark.primary.color);
            } else if(component.operator === "or") {
                comparatorRectangle.setColor(colorScheme.dark.secondaryContainer.color);
                comparatorText.setText("§lOR").setColor(colorScheme.dark.secondary.color);
            }
        }
    }
    let newContainer = new UIContainer()
        .setX(new CenterConstraint())
        .setY(new CramSiblingConstraint(12))
        .setWidth((98).percent())
        .setHeight((30).pixels())
        .setChildOf(scroll);

    let newButton = new UIRoundedRectangle(10)
        .setColor(colorScheme.dark.successContainer.color)
        .setX(new CenterConstraint())
        .setY(new CenterConstraint())
        .setWidth(new AdditiveConstraint(new ChildBasedSizeConstraint(), (20).pixels()))
        .setHeight((30).pixels())
        .onMouseEnter((comp) => {
            animate(comp, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onSuccess.color));
            });
            animate(newIcon, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.success.color));
            });
            animate(newText, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.success.color));
            });
        })
        .onMouseLeave((comp) => {
            animate(comp, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.successContainer.color));
            });
            animate(newIcon, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onSuccessContainer.color));
            });
            animate(newText, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onSuccessContainer.color));
            });
        })
        .onMouseClick(() => {
            if(ruleset.rules[index].length != 0) {
                ruleset.rules[index].push({"type": "COMPARATOR", "operator": "and"})
            }
            ruleset.rules[index].push({"type": "MATCH", "search": "start", "string": "", "inverse": false})
            Settings.rulesets = rulesets;
            editRule(id, index);
        })
        .setChildOf(newContainer);

    let newIcon = UIImage.ofFile(new File("./config/ChatTriggers/modules/HyJanitor/icons/g-edit_pencil.png"))
        .setColor(colorScheme.dark.onSuccessContainer.color)
        .setX((8).pixels())
        .setY(new CenterConstraint())
        .setWidth((16).pixels())
        .setHeight(new AspectConstraint())
        .setChildOf(newButton);

    let newText = new UIText("Add component", false)
        .setColor(colorScheme.dark.onSuccessContainer.color)
        .setX((28).pixels())
        .setY(new CenterConstraint())
        .setTextScale((1.5).pixels())
        .setChildOf(newButton);

    const helpWindow = new UIBlock()
        .setColor(new Color(0, 0, 0, 0.5))
        .setX((0).pixels())
        .setY((0).pixels())
        .setWidth((100).percent())
        .setHeight((100).percent())
        .setChildOf(window);
    helpWindow.hide(true);

    const helpBackground = new UIRoundedRectangle(10)
        .setColor(colorScheme.dark.surface.color)
        .setX(new CenterConstraint())
        .setY(new CenterConstraint())
        .setWidth(new AspectConstraint())
        .setHeight((80).percent())
        .setChildOf(helpWindow);

    const helpTitle = new UIText("Help")
        .setColor(colorScheme.dark.surfaceTint.color)
        .setX(new CenterConstraint())
        .setY((10).pixels())
        .setTextScale((2).pixels())
        .setChildOf(helpBackground);

    const infoScroll = new ScrollComponent("Loading...")
        .setX(new CenterConstraint())
        .setY((8).percent())
        .setWidth((90).percent())
        .setHeight((90).percent())
        .setChildOf(helpBackground);

    const infoSlider = new UIBlock()
        .setColor(colorScheme.dark.outline.color)
        .setX(new SubtractiveConstraint((100).percent(), (8).pixels()))
        .setWidth((2).pixels())
        .setChildOf(helpBackground);

    infoScroll.setScrollBarComponent(infoSlider, true, false);

    new MarkdownComponent(FileLib.read("./config/ChatTriggers/modules/HyJanitor/help.md"))
        .setX((0).pixels())
        .setY((0).pixels())
        .setWidth(new FillConstraint())
        .setHeight(new FillConstraint())
        .setChildOf(infoScroll);

    UIImage.ofFile(new File("./config/ChatTriggers/modules/HyJanitor/icons/g-close.png"))
        .setColor(colorScheme.dark.inversePrimary.color)
        .setX((5).pixels())
        .setY((5).pixels())
        .setWidth((24).pixels())
        .setHeight((24).pixels())
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
            helpWindow.hide(true);
        })
        .setChildOf(helpBackground);

    if(Settings.ruleTutorial) {
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
            .setTitle("Rules", 1, false)
            .setDescription("Rules contain the conditions for removing messages. You can check messages using 5 different strategies, click to cycle between them. You can also invert the condition using the red/green button on the left. Comparisons are separated with AND/OR statements. {OR} statements are checked first, and {AND} statements are checked last. For more information, see the Information button at the top.", 1, false)
            .setX(new CenterConstraint())
            .setY(new CenterConstraint())
            .setWidth((30).percent())
            .onPrimaryClick(() => {
                Settings.ruleTutorial = false;
                tutorialWindow.hide(true);
            })
            .setChildOf(tutorialWindow);
    }

    const gui = new JavaAdapter(WindowScreen, {
        init() {
            window.setChildOf(this.getWindow());
        }
    });
    gui.init();
    GuiHandler.openGui(gui);

    if(repairs !== 0) {
        let button = new Button()
            .setText("Close", 1, false)
            .setWidth((50).pixels());
        new Snackbar(5000, button)
            .setText("Repaired ", 1, false)
            .setWidth((30).percent())
            .setChildOf(window)
            .unhide();
    }
}