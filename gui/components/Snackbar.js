/// <reference types="../../../CTAutocomplete" />
/// <reference lib="es2015" />

import {
    AdditiveConstraint,
    Animations,
    CenterConstraint,
    ChildBasedMaxSizeConstraint,
    ConstantColorConstraint,
    SubtractiveConstraint,
    UIContainer,
    UIRoundedRectangle,
    UIWrappedText
} from "../../../Elementa";
import { colorScheme } from "../color/ColorScheme";

const Color = Java.type("java.awt.Color");
const SlideToTransition = Java.type("gg.essential.elementa.transitions.SlideToTransition");

class Snackbar {
    #components = {
        container: undefined,
        rectangle: undefined,
        text: undefined,
        button: undefined
    }
    #buttonEnabled = true;
    #lastHover = 0;
    #timer;

    constructor(timer = 5000, button = undefined) {
        this.#timer = timer;

        this.#components.container = new UIContainer()
            .setX(new CenterConstraint())
            .setY((100).percent())
            .setHeight(new AdditiveConstraint(new ChildBasedMaxSizeConstraint(), (8).pixels()));
        this.#components.rectangle = new UIRoundedRectangle(4)
            .setColor(colorScheme.light.surfaceContainerHigh.color)
            .setX(new CenterConstraint())
            .setY((0).pixels())
            .setWidth((100).percent())
            .setHeight(new AdditiveConstraint(new ChildBasedMaxSizeConstraint(), (12).pixels()))
            .setChildOf(this.#components.container);
        this.#components.text = new UIWrappedText("", false)
            .setColor(colorScheme.light.inverseSurface.color)
            .setX((8).pixels())
            .setY(new CenterConstraint())
            .setWidth(new SubtractiveConstraint((100).percent(), (button ? button.getComponents().container.getWidth() + 10 : 8).pixels()))
            .setChildOf(this.#components.rectangle);
        if (button) {
            this.#components.button = button
                .setBackgroundColor(colorScheme.light.surfaceContainerHigh.color)
                .setLabelColor(colorScheme.light.primary.color)
                .setX((4).pixels(true))
                .setY(new CenterConstraint())
                .setHeight((15).pixels())
                .onMouseEnter((button) => {
                    if (this.#buttonEnabled) {
                        button.animateBackgroundColor(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.light.primaryContainer.color))
                    }
                })
                .onMouseLeave((button) => {
                    if (this.#buttonEnabled) {
                        button.animateBackgroundColor(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.light.surfaceContainerHigh.color));
                    }
                })
                .setChildOf(this.#components.rectangle);
        }
        this.#components.rectangle.onMouseLeave(() => {
            let lastHover = Date.now()
            this.#lastHover = lastHover;
            setTimeout(() => {
                if (!this.#components.rectangle.isHovered() && this.#lastHover === lastHover) {
                    this.hide();
                }
            }, this.#timer)
        })
    }

    setWidth(width) {
        this.#components.container.setWidth(width);
        return this;
    }

    setText(text, scale, shadow) {
        this.#components.text.setText(text);
        if (scale != undefined) this.#components.text.setTextScale((scale).pixels());
        if (shadow != undefined) this.#components.text.setShadow(shadow);
        return this;
    }

    isButtonEnabled() {
        return this.#buttonEnabled;
    }

    setButtonEnabled(enabled) {
        this.#buttonEnabled = enabled;
        if (enabled) {
            this.#components.button
                .setBackgroundColor(colorScheme.light.surfaceContainerHigh.color)
                .setLabelColor(colorScheme.light.primary.color);
        } else {
            this.#components.button
                .setBackgroundColor(colorScheme.light.surfaceContainerHigh.color)
                .setLabelColor(colorScheme.light.onSurface.color);
        }
        return this;
    }


    onButtonEnter(event) {
        this.#components.button.onMouseEnter(() => {
            if (this.isButtonEnabled()) {
                event(this);
            }
        });
        return this;
    }

    onButtonLeave(event) {
        this.#components.button.onMouseLeave(() => {
            if (this.isButtonEnabled()) {
                event(this);
            }
        });
        return this;
    }

    onButtonClick(event) {
        this.#components.button.onMouseClick(() => {
            if (this.isButtonEnabled()) {
                event(this);
            }
        });
        return this;
    }

    setChildOf(component) {
        this.#components.container.setChildOf(component);
        this.#components.container.hide(true);
        return this;
    }

    unhide() {
        this.#components.container.unhide(true);
        new SlideToTransition.Top(0.5, Animations.OUT_EXP, false).transition(this.#components.container);
        let lastHover = Date.now()
        this.#lastHover = lastHover;
        setTimeout(() => {
            if (!this.#components.rectangle.isHovered() && this.#lastHover === lastHover) {
                this.hide();
            }
        }, this.#timer)
        return this;
    }

    hide() {
        new SlideToTransition.Bottom(0.5, Animations.OUT_EXP, false).transition(this.#components.container);
        if (this.#components.button) {
            this.setButtonEnabled(false);
        }
        Client.scheduleTask(10, () => {
            this.#components.container.hide(true); // not thread-safe
        })
        return this;
    }

    getComponents() {
        return this.#components;
    }
}

export {Snackbar};