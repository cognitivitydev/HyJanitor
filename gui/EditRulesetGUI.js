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
    MarkdownComponent,
    ScrollComponent,
    UITextInput,
    ChildBasedSizeConstraint,
    UIWrappedText
} from "../../Elementa";
import { colorScheme } from "./color/ColorScheme";
import { editRule } from "./EditRuleGUI";
import { testRuleset } from "./TestRulesetGUI";
import { Button } from "./components/Button";
import { OutlinedButton } from "./components/OutlinedButton";
import { Dialog } from "./components/Dialog";
import { Snackbar } from "./components/Snackbar";

const Color = Java.type("java.awt.Color");
const Desktop = Java.type("java.awt.Desktop");
const File = Java.type("java.io.File");
const URI = Java.type("java.net.URI");

export function editRuleset(id) {
    let rulesets = Settings.rulesets;
    let ruleset = rulesets[id];
    if(!ruleset) {
        ruleset = {
            "version": 1,
            "name": "New Ruleset",
            "removals": 0,
            "type": "ALL",
            "rules": []
        };
        id = rulesets.push(ruleset) - 1;
        Settings.rulesets = rulesets;
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
            ChatLib.command("hyjanitor rulesets", true);
        })
        .setChildOf(background);

    new UIText("§lHyJanitor")
        .setColor(colorScheme.dark.surfaceTint.color)
        .setX(new CenterConstraint())
        .setY((5).percent())
        .setTextScale((3).pixels())
        .setChildOf(background);

    new UIText("Edit Ruleset", false)
        .setColor(colorScheme.dark.inverseOnSurface.color)
        .setX(new CenterConstraint())
        .setY(new AdditiveConstraint((5).percent(), (30).pixels()))
        .setTextScale((2).pixels())
        .setChildOf(background);

    const tab = new UIRoundedRectangle(10)
        .setColor(colorScheme.dark.surfaceContainerLowest.color)
        .setX(new CenterConstraint())
        .setY(new SubtractiveConstraint((25).percent(), (30).pixels()))
        .setWidth((90).percent())
        .setHeight((50).pixels())
        .setChildOf(background);

    const title = new UITextInput(ruleset.name)
        .setColor(colorScheme.dark.secondaryContainer.color)
        .setX((32).pixels())
        .setY((10).pixels())
        .setHeight((15).pixels())
        .setTextScale((1.5).pixels())
        .onFocusLost(() => {
            editing = false;
            title.setText(ruleset.name);
            editButton.setColor(colorScheme.dark.primaryContainer.color);
            editIcon.setColor(colorScheme.dark.onPrimaryContainer.color);
            confirmIcon.setColor(new Color(0, 0, 0, 0));
        })
        .setChildOf(tab);
    title.setText(ruleset.name);
    title.setWidth(new SubtractiveConstraint((100).percent(), (160).pixels()));

    let editing = false;

    const editIcon = UIImage.ofFile(new File("./config/ChatTriggers/modules/HyJanitor/icons/g-draw.png"))
        .setColor(colorScheme.dark.onPrimaryContainer.color)
        .setX(new CenterConstraint())
        .setY(new CenterConstraint())
        .setWidth((16).pixels())
        .setHeight((16).pixels());

    const confirmIcon = UIImage.ofFile(new File("./config/ChatTriggers/modules/HyJanitor/icons/g-check.png"))
        .setColor(new Color(0, 0, 0, 0))
        .setX(new CenterConstraint())
        .setY(new CenterConstraint())
        .setWidth((16).pixels())
        .setHeight((16).pixels());

    const editButton = new UIRoundedRectangle(3)
        .setColor(colorScheme.dark.primaryContainer.color)
        .setX((94).pixels(true))
        .setY((5).pixels())
        .setWidth((2.5).percent())
        .setHeight(new AspectConstraint())
        .onMouseEnter((comp) => {
            if(editing) {
                animate(comp, (animation) => {
                    animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onSuccess.color));
                });
                animate(editIcon, (animation) => {
                    animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(new Color(0, 0, 0, 0)));
                });
                animate(confirmIcon, (animation) => {
                    animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onSuccessContainer.color));
                });
                animate(title, (animation) => {
                    animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onSecondaryContainer.color));
                });
            } else {
                animate(comp, (animation) => {
                    animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onPrimary.color));
                });
                animate(editIcon, (animation) => {
                    animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onPrimaryContainer.color));
                });
                animate(confirmIcon, (animation) => {
                    animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(new Color(0, 0, 0, 0)));
                });
                animate(title, (animation) => {
                    animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onSecondaryContainer.color));
                });
            }
        })
        .onMouseLeave((comp) => {
            if(editing) {
                animate(comp, (animation) => {
                    animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.successContainer.color));
                });
                animate(editIcon, (animation) => {
                    animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(new Color(0, 0, 0, 0)));
                });
                animate(confirmIcon, (animation) => {
                    animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.success.color));
                });
                animate(title, (animation) => {
                    animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onSecondaryContainer.color));
                });
            } else {
                animate(comp, (animation) => {
                    animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.primaryContainer.color));
                });
                animate(editIcon, (animation) => {
                    animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onPrimaryContainer.color));
                });
                animate(confirmIcon, (animation) => {
                    animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(new Color(0, 0, 0, 0)));
                });
                animate(title, (animation) => {
                    animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.secondaryContainer.color));
                });
            }
        })
        .onMouseClick(() => {
            editing = !editing;
            ruleset.name = title.getText();
            Settings.rulesets = rulesets;
            if(editing) {
                editButton.setColor(colorScheme.dark.successContainer.color)
                editIcon.setColor(new Color(0, 0, 0, 0));
                confirmIcon.setColor(colorScheme.dark.success.color);
                title.grabWindowFocus();
            } else {
                editButton.setColor(colorScheme.dark.primaryContainer.color)
                editIcon.setColor(colorScheme.dark.onPrimaryContainer.color);
                confirmIcon.setColor(new Color(0, 0, 0, 0));
            }
        })
        .setChildOf(tab);

    editIcon.setChildOf(editButton);
    confirmIcon.setChildOf(editButton);

    const testButton = new UIRoundedRectangle(3)
        .setColor(colorScheme.dark.primaryContainer.color)
        .setX((68).pixels(true))
        .setY((5).pixels())
        .setWidth((2.5).percent())
        .setHeight(new AspectConstraint())
        .onMouseEnter((comp) => {
            animate(comp, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onPrimary.color));
            });
            animate(testIcon, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onPrimaryContainer.color));
            });
        })
        .onMouseLeave((comp) => {
            animate(comp, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.primaryContainer.color));
            });
            animate(testIcon, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onPrimaryContainer.color));
            });
        })
        .onMouseClick(() => {
            testRuleset(id);
        })
        .setChildOf(tab);

    const testIcon = UIImage.ofFile(new File("./config/ChatTriggers/modules/HyJanitor/icons/g-rule.png"))
        .setColor(colorScheme.dark.onPrimaryContainer.color)
        .setX(new CenterConstraint())
        .setY(new CenterConstraint())
        .setWidth((17).pixels())
        .setHeight((17).pixels())
        .setChildOf(testButton);

    const helpButton = new UIRoundedRectangle(3)
        .setColor(colorScheme.dark.primaryContainer.color)
        .setX((42).pixels(true))
        .setY((5).pixels())
        .setWidth((2.5).percent())
        .setHeight(new AspectConstraint())
        .onMouseEnter((comp) => {
            animate(comp, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onPrimary.color));
            });
        })
        .onMouseLeave((comp) => {
            animate(comp, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.primaryContainer.color));
            });
        })
        .onMouseClick(() => {
            helpWindow.unhide(true);
        })
        .setChildOf(tab);

    const helpIcon = UIImage.ofFile(new File("./config/ChatTriggers/modules/HyJanitor/icons/g-info.png"))
        .setColor(colorScheme.dark.onPrimaryContainer.color)
        .setX(new CenterConstraint())
        .setY(new CenterConstraint())
        .setWidth((17).pixels())
        .setHeight((17).pixels())
        .setChildOf(helpButton);

    const removeButton = new UIRoundedRectangle(3)
        .setColor(colorScheme.dark.errorContainer.color)
        .setX((16).pixels(true))
        .setY((5).pixels())
        .setWidth((2.5).percent())
        .setHeight(new AspectConstraint())
        .onMouseEnter((comp) => {
            animate(comp, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onError.color));
            });
        })
        .onMouseLeave((comp) => {
            animate(comp, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.errorContainer.color));
            });
        })
        .onMouseClick(() => {
            deleteWindow.unhide(true);
        })
        .setChildOf(tab);

    const removeIcon = UIImage.ofFile(new File("./config/ChatTriggers/modules/HyJanitor/icons/g-delete.png"))
        .setColor(colorScheme.dark.onErrorContainer.color)
        .setX(new CenterConstraint())
        .setY(new CenterConstraint())
        .setWidth((17).pixels())
        .setHeight(new AspectConstraint())
        .setChildOf(removeButton);

    const mainRectangle = new UIRoundedRectangle(10)
        .setColor(colorScheme.dark.surfaceContainerLow.color)
        .setX(new CenterConstraint())
        .setY((25).percent())
        .setWidth((90).percent())
        .setHeight((70).percent())
        .setChildOf(background);

    const container = new ScrollComponent()
        .setX((10).pixels())
        .setY((10).pixels())
        .setWidth(new SubtractiveConstraint((100).percent(), (20).pixels()))
        .setHeight(new SubtractiveConstraint((100).percent(), (20).pixels()))
        .setChildOf(mainRectangle);

    const slider = new UIBlock()
        .setColor(colorScheme.dark.outline.color)
        .setX(new SubtractiveConstraint((100).percent(), (8).pixels()))
        .setWidth((2).pixels())
        .setChildOf(mainRectangle);

    container.setScrollBarComponent(slider, true, false)


    for(let i = 0; i < ruleset.rules.length; i++) {
        let rule = ruleset.rules[i];
        if(!rule) continue;
        let ruleRectangle = new UIRoundedRectangle(10)
            .setColor(colorScheme.dark.surfaceContainerHighest.color)
            .setX(new CramSiblingConstraint(20))
            .setY(new CramSiblingConstraint(20))
            .setWidth(new SubtractiveConstraint((50).percent(), (15).pixels()))
            .setHeight((15).percent())
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
                if(rule) {
                    editRule(id, ruleset.rules.indexOf(rule))
                }
            })
            .setChildOf(container);

        new UIText("Rule #"+(i+1), false)
            .setColor(colorScheme.dark.surfaceTint.color)
            .setX((5).pixels())
            .setY((5).pixels())
            .setTextScale((1.5).pixels())
            .setChildOf(ruleRectangle);

        new UIText(rule.length+" component"+(rule.length != 1 ? "s" : ""), false)
            .setColor(colorScheme.dark.onSurfaceVariant.color)
            .setX(new CenterConstraint())
            .setY((5).pixels())
            .setTextScale((1.5).pixels())
            .setChildOf(ruleRectangle);

        let search = new UIRoundedRectangle(4)
            .setColor(colorScheme.dark.tertiary.color)
            .setX((8).pixels())
            .setY((25).pixels())
            .setWidth((33).percent())
            .setHeight((16).pixels())
            .setChildOf(ruleRectangle);

        let searchName = "???"
        switch (rule[0]?.search) {
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
        new UIText((rule[0]?.inverse ? "§m" : "")+"§l"+searchName, false)
            .setColor(colorScheme.dark.tertiaryContainer.color)
            .setX(new CenterConstraint())
            .setY(new CenterConstraint())
            .setTextScale((1.5).pixels())
            .setChildOf(search);

        let string = new UIRoundedRectangle(4)
            .setColor(colorScheme.dark.surfaceContainerLow.color)
            .setX(new CramSiblingConstraint(4))
            .setY((25).pixels())
            .setWidth(new SubtractiveConstraint((67).percent(), (36).pixels()))
            .setHeight((16).pixels())
            .setChildOf(ruleRectangle);

        let displayString = rule[0]?.string ?? "???";

        new UIWrappedText(displayString, false, null, false, true, 9, "...")
            .setColor(colorScheme.dark.outline.color)
            .setX(new CenterConstraint())
            .setY((3).pixels())
            .setWidth((95).percent())
            .setHeight((15).pixels())
            .setTextScale((1.5).pixels())
            .setChildOf(string);

        if(rule.length > 1) {
            new UIText("...", false)
                .setColor(colorScheme.dark.onSurfaceVariant.color)
                .setX(new CramSiblingConstraint(8))
                .setY((21).pixels())
                .setTextScale((2).pixels())
                .setChildOf(ruleRectangle);
        }
    }
    let createRectangle = new UIRoundedRectangle(10)
        .setColor(colorScheme.dark.surfaceContainerHighest.color)
        .setX(new CramSiblingConstraint(20))
        .setY(new CramSiblingConstraint(20))
        .setWidth(new SubtractiveConstraint((50).percent(), (15).pixels()))
        .setHeight((15).percent())
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
            editRule(rulesets.indexOf(ruleset), -1)
        })
        .setChildOf(container);

    new UIText("Rule #"+(ruleset.rules.length+1), false)
        .setColor(colorScheme.dark.surfaceTint.color)
        .setX((5).pixels())
        .setY((5).pixels())
        .setTextScale((1.5).pixels())
        .setChildOf(createRectangle);

    let createText = new UIRoundedRectangle(4)
        .setColor(colorScheme.dark.primaryContainer.color)
        .setX((8).pixels())
        .setY((25).pixels())
        .setWidth((33).percent())
        .setHeight((16).pixels())
        .setChildOf(createRectangle);

    new UIText("§lCREATE RULE", false)
        .setColor(colorScheme.dark.onPrimaryContainer.color)
        .setX(new CenterConstraint())
        .setY(new CenterConstraint())
        .setTextScale((1.5).pixels())
        .setChildOf(createText);
    if(ruleset.preset) {
        let presetRectangle = new UIRoundedRectangle(10)
            .setColor(colorScheme.dark.onSecondary.color)
            .setX(new CramSiblingConstraint(20))
            .setY(new CramSiblingConstraint(20))
            .setWidth(new SubtractiveConstraint((50).percent(), (15).pixels()))
            .setHeight((15).percent())
            .setChildOf(container);

        new UIText("Preset")
            .setColor(colorScheme.dark.onPrimaryContainer.color)
            .setX((5).pixels())
            .setY((5).pixels())
            .setTextScale((1.5).pixels())
            .setChildOf(presetRectangle);

        let updateRectangle = new UIRoundedRectangle(4)
            .setColor(colorScheme.dark.successContainer.color)
            .setX((8).pixels())
            .setY((25).pixels())
            .setWidth(new AdditiveConstraint(new ChildBasedSizeConstraint(8), (8).pixels()))
            .setHeight((16).pixels())
            .onMouseEnter((comp) => {
                animate(comp, (animation) => {
                    animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onSuccess.color));
                });
            })
            .onMouseLeave((comp) => {
                animate(comp, (animation) => {
                    animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.successContainer.color));
                });
            })
            .onMouseClick(() => {
                try {
                    let file = JSON.parse(FileLib.getUrlContent(ruleset.preset.url));
                    let contents = JSON.parse(FileLib.decodeBase64(file.content.replaceAll("\n", "")));
                    if(contents.updated > ruleset.preset.lastUpdate) {
                        const updateWindow = new UIBlock()
                            .setColor(new Color(0, 0, 0, 127/255))
                            .setX((0).pixels())
                            .setY((0).pixels())
                            .setWidth((100).percent())
                            .setHeight((100).percent())
                            .setChildOf(window);
                        let accept = new Button()
                            .setText("Update", 1, false);
                        let deny = new Button()
                            .setText("Cancel", 1, false);
                        new Dialog(accept, deny, new File("./config/ChatTriggers/modules/HyJanitor/icons/g-download.png"))
                            .setTitle("New update available!")
                            .setDescription("Any changes you have made to this preset will be removed after the update. This cannot be undone.")
                            .setX(new CenterConstraint())
                            .setY(new CenterConstraint())
                            .setWidth((30).percent())
                            .onPrimaryClick(() => {
                                let preset = ruleset.preset;
                                let removals = ruleset.removals;
                                let index = rulesets.indexOf(ruleset);
                                ruleset = contents.content;
                                rulesets[index] = ruleset;
                                ruleset.preset = preset;
                                ruleset.preset.lastUpdate = contents.updated;
                                ruleset.removals = removals;
                                Settings.rulesets = rulesets;
                                editRuleset(id);
                            })
                            .onSecondaryClick(() => {
                                updateWindow.hide(true);
                            })
                            .setChildOf(updateWindow);
                    } else if(contents.updated < ruleset.preset.lastUpdate) {
                        const errorWindow = new UIBlock()
                            .setColor(new Color(0, 0, 0, 127/255))
                            .setX((0).pixels())
                            .setY((0).pixels())
                            .setWidth((100).percent())
                            .setHeight((100).percent())
                            .setChildOf(window);
                        let close = new Button()
                            .setText("Close", 1, false);
                        new Dialog(close, null, new File("./config/ChatTriggers/modules/HyJanitor/icons/g-close.png"))
                            .setTitle("No updates available.")
                            .setDescription("There was an error checking for updates. Try again later.")
                            .setX(new CenterConstraint())
                            .setY(new CenterConstraint())
                            .setWidth((30).percent())
                            .onPrimaryClick(() => {
                                errorWindow.hide(true);
                            })
                            .setChildOf(errorWindow);
                    } else if(contents.updated == ruleset.preset.lastUpdate) {
                        const errorWindow = new UIBlock()
                            .setColor(new Color(0, 0, 0, 127/255))
                            .setX((0).pixels())
                            .setY((0).pixels())
                            .setWidth((100).percent())
                            .setHeight((100).percent())
                            .setChildOf(window);
                        let close = new Button()
                            .setText("Close", 1, false);
                        new Dialog(close, null, new File("./config/ChatTriggers/modules/HyJanitor/icons/g-close.png"))
                            .setTitle("No updates available.")
                            .setDescription("\""+contents.content.name+"\" was last updated by "+contents.author+" "+relative(contents.updated)+" ago.")
                            .setX(new CenterConstraint())
                            .setY(new CenterConstraint())
                            .setWidth((30).percent())
                            .onPrimaryClick(() => {
                                errorWindow.hide(true);
                            })
                            .setChildOf(errorWindow);
                    }
                } catch(exception) {
                    const errorWindow = new UIBlock()
                        .setColor(new Color(0, 0, 0, 127/255))
                        .setX((0).pixels())
                        .setY((0).pixels())
                        .setWidth((100).percent())
                        .setHeight((100).percent())
                        .setChildOf(window);
                    let close = new Button()
                        .setText("Close", 1, false);
                    new Dialog(close, null, new File("./config/ChatTriggers/modules/HyJanitor/icons/g-close.png"))
                        .setTitle("No updates available.")
                        .setDescription("There was an error checking for updates. Try again later.")
                        .setX(new CenterConstraint())
                        .setY(new CenterConstraint())
                        .setWidth((30).percent())
                        .onPrimaryClick(() => {
                            errorWindow.hide(true);
                        })
                        .setChildOf(errorWindow);
                }
            })
            .setChildOf(presetRectangle);

        let updateText = new UIText("Check for Updates", false)
            .setColor(colorScheme.dark.success.color)
            .setX(new CenterConstraint())
            .setY(new CenterConstraint())
            .setTextScale((1.5).pixels())
            .setChildOf(updateRectangle);

        let unlinkRectangle = new UIRoundedRectangle(4)
            .setColor(colorScheme.dark.primaryContainer.color)
            .setX(new SiblingConstraint(8))
            .setY((25).pixels())
            .setWidth(new AdditiveConstraint(new ChildBasedSizeConstraint(8), (8).pixels()))
            .setHeight((16).pixels())
            .onMouseEnter((comp) => {
                animate(comp, (animation) => {
                    animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onPrimary.color));
                });
            })
            .onMouseLeave((comp) => {
                animate(comp, (animation) => {
                    animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.primaryContainer.color));
                });
            })
            .onMouseClick(() => {
                unlinkWindow.unhide(true);
            })
            .setChildOf(presetRectangle);

        let unlinkText = new UIText("Unlink Preset", false)
            .setColor(colorScheme.dark.onPrimaryContainer.color)
            .setX(new CenterConstraint())
            .setY(new CenterConstraint())
            .setTextScale((1.5).pixels())
            .setChildOf(unlinkRectangle);
    }

    if(ruleset.preset) {
        new UIText("§nPreset made by "+ruleset.preset.author, false)
            .setColor(colorScheme.dark.inverseOnSurface.color)
            .setX(new CenterConstraint())
            .setY(new SubtractiveConstraint((97.5).percent(), (5).pixels()))
            .onMouseEnter((comp) => {
                animate(comp, (animation) => {
                    animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.surfaceTint.color));
                });
            })
            .onMouseLeave((comp) => {
                animate(comp, (animation) => {
                    animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.inverseOnSurface.color));
                });
            })
            .onMouseClick(() => {
                Desktop.getDesktop().browse(new URI(ruleset.preset.url.replace("https://api.github.com/repos/cognitivitydev/HyJanitorRepo/contents/", "https://github.com/cognitivitydev/HyJanitorRepo/blob/main/").replace("?ref=main", "")));
            })
            .setChildOf(background);
    }

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

    new UIText("Help")
        .setColor(colorScheme.dark.surfaceTint.color)
        .setX(new CenterConstraint())
        .setY((10).pixels())
        .setTextScale((2).pixels())
        .setChildOf(helpBackground);

    const scroll = new ScrollComponent("Loading...")
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

    scroll.setScrollBarComponent(infoSlider, true, false);

    new MarkdownComponent(FileLib.read("./config/ChatTriggers/modules/HyJanitor/help.md"))
        .setX((0).pixels())
        .setY((0).pixels())
        .setWidth(new FillConstraint())
        .setHeight(new FillConstraint())
        .setChildOf(scroll);

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

    const unlinkWindow = new UIBlock()
        .setColor(new Color(0, 0, 0, 0.5))
        .setX((0).pixels())
        .setY((0).pixels())
        .setWidth((100).percent())
        .setHeight((100).percent())
        .setChildOf(window);
    unlinkWindow.hide(true);

    const unlinkBackground = new UIRoundedRectangle(35)
        .setColor(colorScheme.dark.surfaceContainerLow.color)
        .setX(new CenterConstraint())
        .setY(new CenterConstraint())
        .setWidth((40).percent())
        .setHeight((30).percent())
        .setChildOf(unlinkWindow);

    new UIWrappedText("Unlink Preset?")
        .setColor(colorScheme.dark.error.color)
        .setX(new CenterConstraint())
        .setY((20).percent())
        .setWidth((80).percent())
        .setTextScale((2).pixels())
        .setChildOf(unlinkBackground);

    new UIWrappedText("This will remove all references to the original preset. You will not be able to receive ruleset updates unless you reinstall the preset.")
        .setColor(colorScheme.dark.onSurfaceVariant.color)
        .setX(new CenterConstraint())
        .setY(new SiblingConstraint(8))
        .setWidth((80).percent())
        .setChildOf(unlinkBackground);

    new OutlinedButton(3, colorScheme.dark.surfaceContainerLow.color)
        .setText("Cancel", 1.5, false)
        .setBackgroundColor(colorScheme.dark.surfaceVariant.color)
        .setLabelColor(colorScheme.dark.onSurface.color)
        .setX(new SubtractiveConstraint(new CenterConstraint(), (17.5).percent()))
        .setY((67).percent())
        .setWidth((30).percent())
        .setHeight((30).pixels())
        .onMouseEnter((button) => {
            button.animateBackgroundColor(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onSurfaceVariant.color));
        })
        .onMouseLeave((button) => {
            button.animateBackgroundColor(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.surfaceVariant.color));
        })
        .onMouseClick(() => {
            unlinkWindow.hide(true);
        })
        .setChildOf(unlinkBackground);

    new Button(new File("./config/ChatTriggers/modules/HyJanitor/icons/g-link_off.png"))
        .setText("Unlink", 1.5, false)
        .setColor("error", true)
        .setX(new AdditiveConstraint(new CenterConstraint(), (17.5).percent()))
        .setY((67).percent())
        .setWidth((30).percent())
        .setHeight((30).pixels())
        .setIconSize((19).pixels())
        .onMouseClick(() => {
            ruleset.preset = undefined;
            Settings.rulesets = rulesets;
            editRuleset(id);
        })
        .setChildOf(unlinkBackground);

    // const noUpdateWindow = new UIBlock()
    //     .setColor(new Color(0, 0, 0, 0.5))
    //     .setX((0).pixels())
    //     .setY((0).pixels())
    //     .setWidth((100).percent())
    //     .setHeight((100).percent())
    //     .setChildOf(window);
    // noUpdateWindow.hide(true);

    // const noUpdateBackground = new UIRoundedRectangle(20)
    //     .setColor(colorScheme.dark.surfaceContainerLow.color)
    //     .setX(new CenterConstraint())
    //     .setY(new CenterConstraint())
    //     .setWidth((30).percent())
    //     .setHeight((20).percent())
    //     .setChildOf(noUpdateWindow);

    // let noUpdateText = new UIWrappedText("", true, null, true)
    //     .setColor(colorScheme.dark.onSurfaceVariant.color)
    //     .setX(new CenterConstraint())
    //     .setY(new CenterConstraint())
    //     .setWidth((90).percent())
    //     .setHeight((40).pixels())
    //     .setTextScale((1.5).pixels())
    //     .setChildOf(noUpdateBackground);

    // let noUpdateCloseRectangle = new UIRoundedRectangle(5)
    //     .setColor(colorScheme.dark.primaryContainer.color)
    //     .setX((16).pixels(true))
    //     .setY((8).pixels(true))
    //     .setWidth(new AdditiveConstraint(new ChildBasedSizeConstraint(), (16).pixels()))
    //     .setHeight((20).pixels())
    //     .onMouseEnter((comp) => {
    //         animate(comp, (animation) => {
    //             animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onPrimary.color));
    //         });
    //     })
    //     .onMouseLeave((comp) => {
    //         animate(comp, (animation) => {
    //             animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.primaryContainer.color));
    //         });
    //     })
    //     .onMouseClick(() => {
    //         noUpdateWindow.hide(true);
    //     })
    //     .setChildOf(noUpdateBackground);

    // let noUpdateCloseText = new UIText("Close", false)
    //     .setColor(colorScheme.dark.primary.color)
    //     .setX(new CenterConstraint())
    //     .setY(new CenterConstraint())
    //     .setTextScale((1.5).pixels())
    //     .setChildOf(noUpdateCloseRectangle);

    // const updateWindow = new UIBlock()
    //     .setColor(new Color(0, 0, 0, 0.5))
    //     .setX((0).pixels())
    //     .setY((0).pixels())
    //     .setWidth((100).percent())
    //     .setHeight((100).percent())
    //     .setChildOf(window);
    // updateWindow.hide(true);

    // const updateBackground = new UIRoundedRectangle(35)
    //     .setColor(colorScheme.dark.surfaceContainerLow.color)
    //     .setX(new CenterConstraint())
    //     .setY(new CenterConstraint())
    //     .setWidth((40).percent())
    //     .setHeight((30).percent())
    //     .setChildOf(updateWindow);

    // new UIWrappedText("A new update is available.")
    //     .setColor(colorScheme.dark.success.color)
    //     .setX(new CenterConstraint())
    //     .setY((20).percent())
    //     .setWidth((80).percent())
    //     .setTextScale((2).pixels())
    //     .setChildOf(updateBackground);

    // new UIWrappedText("Any changes you have made to this preset will be removed after the update. This cannot be undone.")
    //     .setColor(colorScheme.dark.onSurfaceVariant.color)
    //     .setX(new CenterConstraint())
    //     .setY(new SiblingConstraint(8))
    //     .setWidth((80).percent())
    //     .setChildOf(updateBackground);

    // let cancelUpdateButton = new OutlinedButton(3, colorScheme.dark.surfaceContainerLow.color)
    //     .setText("Cancel", 1.5, false)
    //     .setBackgroundColor(colorScheme.dark.surfaceVariant.color)
    //     .setLabelColor(colorScheme.dark.onSurface.color)
    //     .setX(new SubtractiveConstraint(new CenterConstraint(), (17.5).percent()))
    //     .setY((67).percent())
    //     .setWidth((30).percent())
    //     .setHeight((30).pixels())
    //     .onMouseEnter((button) => {
    //         button.animateBackgroundColor(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onSurfaceVariant.color));
    //     })
    //     .onMouseLeave((button) => {
    //         button.animateBackgroundColor(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.surfaceVariant.color));
    //     })
    //     .onMouseClick(() => {
    //         updateWindow.hide(true);
    //     })
    //     .setChildOf(updateBackground);

    // let updateButton = new Button(new File("./config/ChatTriggers/modules/HyJanitor/icons/g-download.png"))
    //     .setText("Update", 1.5, false)
    //     .setColor("success", true)
    //     .setX(new AdditiveConstraint(new CenterConstraint(), (20).percent()))
    //     .setY((67).percent())
    //     .setWidth((30).percent())
    //     .setHeight((30).pixels())
    //     .setIconSize((19).pixels())
    //     .setChildOf(updateBackground);

    const deleteWindow = new UIBlock()
        .setColor(new Color(0, 0, 0, 0.5))
        .setX((0).pixels())
        .setY((0).pixels())
        .setWidth((100).percent())
        .setHeight((100).percent())
        .setChildOf(window);
    deleteWindow.hide(true);

    const deleteBackground = new UIRoundedRectangle(35)
        .setColor(colorScheme.dark.surfaceContainerLow.color)
        .setX(new CenterConstraint())
        .setY(new CenterConstraint())
        .setWidth((30).percent())
        .setHeight((30).percent())
        .setChildOf(deleteWindow);

    new UIWrappedText("Delete "+ruleset.name+"?")
        .setColor(colorScheme.dark.error.color)
        .setX(new CenterConstraint())
        .setY((20).percent())
        .setWidth((80).percent())
        .setTextScale((2).pixels())
        .setChildOf(deleteBackground);

    new UIWrappedText("This cannot be undone.")
        .setColor(colorScheme.dark.onSurfaceVariant.color)
        .setX(new CenterConstraint())
        .setY(new SiblingConstraint(8))
        .setWidth((80).percent())
        .setChildOf(deleteBackground);

    let cancelButton = new OutlinedButton(3, colorScheme.dark.surfaceContainerLow.color)
        .setText("Cancel", 1.5, false)
        .setBackgroundColor(colorScheme.dark.surfaceVariant.color)
        .setLabelColor(colorScheme.dark.onSurface.color)
        .setX(new SubtractiveConstraint(new CenterConstraint(), (17.5).percent()))
        .setY((67).percent())
        .setWidth((30).percent())
        .setHeight((30).pixels())
        .onMouseEnter((button) => {
            button.animateBackgroundColor(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onSurfaceVariant.color));
        })
        .onMouseLeave((button) => {
            button.animateBackgroundColor(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.surfaceVariant.color));
        })
        .onMouseClick(() => {
            deleteWindow.hide(true);
        })
        .setChildOf(deleteBackground);

    let deleteButton = new Button(new File("./config/ChatTriggers/modules/HyJanitor/icons/g-delete.png"))
        .setText("Delete", 1.5, false)
        .setColor("error", true)
        .setX(new AdditiveConstraint(new CenterConstraint(), (20).percent()))
        .setY((67).percent())
        .setWidth((30).percent())
        .setHeight((30).pixels())
        .setIconSize((19).pixels())
        .onMouseClick(() => {
            rulesets.splice(rulesets.indexOf(ruleset), 1);
            Settings.rulesets = rulesets;
            ChatLib.command("hyjanitor rulesets", true);
        })
        .setChildOf(deleteBackground);

    if(Settings.rulesetTutorial) {
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
            .setTitle("Rulesets", 1, false)
            .setDescription("Rulesets can contain an infinite amount of rules, and can detect either every message or only messages sent by players. If any rule inside any ruleset is a match, the chat message will be removed. See the Information icon in the top right for more information.", 1, false)
            .setX(new CenterConstraint())
            .setY(new CenterConstraint())
            .setWidth((30).percent())
            .onPrimaryClick(() => {
                Settings.rulesetTutorial = false;
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

    if(ruleset.version > Settings.rulesetVersion) {
        let difference = ruleset.version-Settings.rulesetVersion;
        let closeButton = new Button()
            .setText("Close", 1, false)
            .setWidth((75).pixels());
        new Snackbar(10000, closeButton)
            .setText("\""+ruleset.name+"\" is made for "+difference+" version"+(difference == 1 ? "" : "s")+" ahead of your current version. (v"+Settings.version+")", 1, false)
            .setWidth((50).percent())
            .onButtonClick((snackbar) => {
                snackbar.hide();
            })
            .setChildOf(window)
            .unhide();
    }
}

function relative(start) {
    let now = Date.now();
    let time = now-start;

    let years = Math.floor(time / 31536000000);
    if(years > 0) {
        return years+" year"+(years != 1 ? "s" : "");
    }
    let months = Math.floor(time / 2592000000);
    if(months > 0) {
        return months+" month"+(months != 1 ? "s" : "");
    }
    let days = Math.floor(time / 86400000);
    if(days > 0) {
        return days+" day"+(days != 1 ? "s" : "");
    }
    let hours = Math.floor(time / 3600000);
    if(hours > 0) {
        return hours+" hour"+(hours != 1 ? "s" : "");
    }
    let minutes = Math.floor(time / 60000);
    if(minutes > 0) {
        return minutes+" minute"+(minutes != 1 ? "s" : "");
    }
    let seconds = Math.floor(time / 1000);
    if(seconds > 0) {
        return seconds+" second"+(seconds != 1 ? "s" : "");
    }
    return Math.max(0, time)+" millsecond"+(time != 1 ? "s" : "");
}
