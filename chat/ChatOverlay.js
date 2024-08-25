/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import {
    UIBlock,
    animate,
    Animations,
    ConstantColorConstraint,
    UIText,
    CenterConstraint,
    AdditiveConstraint,
    UIImage,
    SiblingConstraint,
    AspectConstraint,
    UIContainer,
    ChildBasedSizeConstraint,
    ChildBasedMaxSizeConstraint,
    UIWrappedText,
    Window
} from "../../Elementa";
import { timeLength } from "./MuteManager";
import Settings from "../config";

const Color = Java.type("java.awt.Color");
const File = Java.type("java.io.File");

const hud = new Window();
let isOpen = false;
let lastOpen = false;
let deletedMessages = [];
let hovering = false;

let lines = [];

const icon = UIImage.ofFile(new File("./config/ChatTriggers/modules/HyJanitor/icons/g-delete.png"))
    .setColor(new Color(0, 0, 0, 0))
    .setX((5).pixels()).setY((19).pixels(true))
    .setWidth((17).pixels()).setHeight(new AspectConstraint())
    .onMouseEnter(() => {
        if(!isOpen) {
            return;
        }
        hovering = true;
        timestampOverlay.unhide(false);
        chatOverlay.unhide(false);
        reasonOverlay.unhide(false);
        setTimeout(() => {
            if(hovering) {
                animate(footer, (animation) => {
                    animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(new Color(1, 1, 1, 0.5)));
                });
                animate(timestampOverlay, (animation) => {
                    animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(new Color(0.5, 0.5, 0, 0.75)));
                });
                animate(chatOverlay, (animation) => {
                    animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(new Color(0, 0, 0, 0.5)));
                });
                animate(reasonOverlay, (animation) => {
                    animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(new Color(0.5, 0, 0, 0.75)));
                });
                for(let line of lines) {
                    animate(line.timestamp, (animation) => {
                        animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(new Color(0, 0, 0, 1)));
                    });
                    animate(line.line, (animation) => {
                        animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(new Color(0, 0, 0, 1)));
                    });
                    animate(line.reason, (animation) => {
                        animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(new Color(0, 0, 0, 1)));
                    });
                }
            }
        }, 200)
    })
    .onMouseLeave(() => {
        hovering = false;
        timestampOverlay.hide(false);
        chatOverlay.hide(false);
        reasonOverlay.hide(false);
        animate(footer, (animation) => {
            animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(new Color(1, 1, 1, 0)));
        });
        animate(timestampOverlay, (animation) => {
            animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(new Color(0, 0, 0, 0)));
        });
        animate(chatOverlay, (animation) => {
            animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(new Color(0, 0, 0, 0)));
        });
        animate(reasonOverlay, (animation) => {
            animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(new Color(0, 0, 0, 0)));
        });
        for(let line of lines) {
            animate(line.timestamp, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(new Color(0, 0, 0, 0)));
            });
            animate(line.line, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(new Color(0, 0, 0, 0)));
            });
            animate(line.reason, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(new Color(0, 0, 0, 0)));
            });
        }
    })
    .setChildOf(hud);
// icon.textureMinFilter = UIImage.TextureScalingMode.LINEAR;
// icon.textureMagFilter = UIImage.TextureScalingMode.LINEAR;

const container = new UIContainer()
    .setX(new CenterConstraint()).setY(new CenterConstraint())
    .setWidth(new ChildBasedSizeConstraint()).setHeight(new ChildBasedMaxSizeConstraint())
    .setChildOf(hud);

const timestampOverlay = new UIBlock()
    .setColor(new Color(0, 0, 0, 0))
    .setX(new SiblingConstraint()).setY((0).pixels())
    .setWidth(new AdditiveConstraint(new ChildBasedMaxSizeConstraint(), (8).pixels())).setHeight(new AdditiveConstraint(new ChildBasedSizeConstraint(), (8).pixels()))
    .setChildOf(container);
timestampOverlay.hide(true);

const chatOverlay = new UIBlock()
    .setColor(new Color(0, 0, 0, 0))
    .setX(new SiblingConstraint()).setY((0).pixels())
    .setWidth(new AdditiveConstraint(new ChildBasedMaxSizeConstraint(), (8).pixels())).setHeight(new AdditiveConstraint(new ChildBasedSizeConstraint(), (8).pixels()))
    .setChildOf(container);
chatOverlay.hide(true);

const reasonOverlay = new UIBlock()
    .setColor(new Color(0, 0, 0, 0))
    .setX(new SiblingConstraint()).setY((0).pixels())
    .setWidth(new AdditiveConstraint(new ChildBasedMaxSizeConstraint(), (8).pixels())).setHeight(new AdditiveConstraint(new ChildBasedSizeConstraint(), (8).pixels()))
    .setChildOf(container);
reasonOverlay.hide(true);

const footer = new UIText("HyJanitor")
    .setColor(new Color(1, 1, 1, 0))
    .setX(new CenterConstraint()).setY(new CenterConstraint())
    .setChildOf(hud);

for(let i = 0; i < 10; i++) {
    let timestamp = new UIText("§7???")
        .setColor(new Color(0, 0, 0, 0))
        .setX((4).pixels()).setY(i == 0 ? (4).pixels() : new SiblingConstraint())
        .setChildOf(timestampOverlay);

    let line = new UIWrappedText(i == 0 ? "§e§oRecently deleted messages will appear here." : "§7...", true, null, false, true, 1, "...")
        .setColor(new Color(0, 0, 0, 0))
        .setX((4).pixels()).setY(i == 0 ? (4).pixels() : new SiblingConstraint())
        .setWidth((320).pixels()).setHeight((9).pixels())
        .setChildOf(chatOverlay);

    let reason = new UIText("§7???")
        .setColor(new Color(0, 0, 0, 0))
        .setX((4).pixels()).setY(i == 0 ? (4).pixels() : new SiblingConstraint())
        .setChildOf(reasonOverlay);

    lines.push({timestamp: timestamp, line: line, reason: reason});
}

register("renderOverlay", () => {
    lastOpen = isOpen;
    isOpen = Client.getChatGUI()?.func_146241_e(); // getChatOpen
    if(!Settings.showChatIcon) return;
    if(isOpen) {
        icon.setColor(new Color(1, 1, 1, 0.2));
    } else if(lastOpen) {
        icon.setColor(new Color(1, 1, 1, 0));
        footer.setColor(new Color(1, 1, 1, 0));
        timestampOverlay.setColor(new Color(0, 0, 0, 0));
        chatOverlay.setColor(new Color(0, 0, 0, 0));
        reasonOverlay.setColor(new Color(0, 0, 0, 0));
        for(let i in lines) {
            let line = lines[i];
            line.timestamp.setColor(new Color(0, 0, 0, 0));
            line.line.setColor(new Color(0, 0, 0, 0));
            line.reason.setColor(new Color(0, 0, 0, 0));
        }
    }
    footer.setX((container.getRight()-footer.getWidth()).pixels())
        .setY((container.getBottom()+2).pixels());
    hud.draw();
});

register("step", () => {
    if(isOpen) {
        if(!Settings.showChatIcon) return;
        let info = false;
        for(let i in lines) {
            let line = lines[i];
            let deletedMessage = deletedMessages[i];
            if(deletedMessage) {
                let difference = Date.now()-deletedMessages[i].timestamp;
                let rounded = difference-(difference%1000);
                line.timestamp.setText("§f"+timeLength(rounded).replace("ms", "s")+" ago");
                line.line.setText(deletedMessages[i].text);
                line.reason.setText(deletedMessages[i].reason);
            } else {
                line.timestamp.setText("§7???");
                line.line.setText(info ? "§7..." : "§e§oRecently deleted messages will appear here.");
                line.reason.setText("§7???");
                info = true;
            }
        }
    }
}).setFps(1);

export function updateDeleteNotification(message, reason) {
    if(deletedMessages.length >= 10) {
        deletedMessages.splice(0, 1);
    }
    deletedMessages.push({timestamp: Date.now(), text: "§r§f"+message+"§r", reason: reason});
    if(!Settings.showChatIcon) return;
    if(!isOpen) {
        animate(icon, (animation) => {
            animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(new Color(1, 1, 1, 0.5)));
        });
    }
    setTimeout(() => {
        if(!isOpen) {
            animate(icon, (animation) => {
                animation.setColorAnimation(Animations.IN_EXP, 1, new ConstantColorConstraint(new Color(1, 1, 1, 0)));
            });
        }
    }, 250);
}