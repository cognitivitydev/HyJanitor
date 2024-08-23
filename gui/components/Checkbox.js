/// <reference types="../../../CTAutocomplete" />
/// <reference lib="es2015" />

import {
    animate,
    Animations,
    AspectConstraint,
    CenterConstraint,
    ConstantColorConstraint,
    SubtractiveConstraint,
    UIBlock,
    UICircle,
    UIImage,
    UIRoundedRectangle
} from "../../../Elementa";
import { colorScheme, setAlpha } from "../color/ColorScheme";

const File = Java.type("java.io.File");

class Checkbox {
    #components = {
        rectangle: undefined,
        fill: undefined,
        icon: undefined,
        hover: undefined
    }
    #backgroundColor;
    #selected;
    #error;
    #enabled = true;

    constructor(backgroundColor, selected) {
        this.#selected = selected;
        this.#backgroundColor = backgroundColor;
        this.#components.rectangle = new UIRoundedRectangle(3)
            .setWidth((20).pixels())
            .setHeight(new AspectConstraint())
            .onMouseEnter(() => {
                this.#components.hover.setRadius((100).percent())
                animate(this.#components.hover, (animation) => {
                    animation.setRadiusAnimation(Animations.OUT_EXP, 0.2, (200).percent());
                });
                if (!this.#selected) {
                    animate(this.#components.rectangle, (animation) => {
                        animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onSurface.color));
                    });
                }
            })
            .onMouseLeave(() => {
                animate(this.#components.hover, (animation) => {
                    animation.setRadiusAnimation(Animations.OUT_EXP, 0.2, (0).percent());
                });
                if (!this.#selected) {
                    animate(this.#components.rectangle, (animation) => {
                        animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.onSurfaceVariant.color));
                    });
                }
            });
        this.#components.fill = new UIBlock()
            .setX(new CenterConstraint())
            .setY(new CenterConstraint())
            .setWidth(new SubtractiveConstraint((100).percent(), (4).pixels()))
            .setHeight(new AspectConstraint())
            .setChildOf(this.#components.rectangle);
        this.#components.icon = UIImage.ofFile(new File("./config/ChatTriggers/modules/HyJanitor/icons/g-check_small.png"))
            .setColor(colorScheme.dark.onPrimary.color)
            .setX(new CenterConstraint())
            .setY(new CenterConstraint())
            .setWidth((400 / 3).percent())
            .setHeight(new AspectConstraint())
            .setChildOf(this.#components.rectangle);
        this.#components.hover = new UICircle()
            .setColor(setAlpha(selected ? colorScheme.dark.primary.color : colorScheme.dark.onSurface.color, 0.1))
            .setX(new CenterConstraint())
            .setY(new CenterConstraint())
            .setChildOf(this.#components.rectangle);
        this.#components.icon.textureMinFilter = UIImage.TextureScalingMode.LINEAR;
        this.#components.icon.textureMagFilter = UIImage.TextureScalingMode.LINEAR;
        if (selected) {
            this.#components.rectangle.setColor(colorScheme.dark.primary.color);
            this.#components.fill.setColor(colorScheme.dark.primary.color);
        } else {
            this.#components.rectangle.setColor(colorScheme.dark.onSurfaceVariant.color);
            this.#components.fill.setColor(backgroundColor)
            this.#components.icon.hide(true);
        }
    }

    setX(x) {
        this.#components.rectangle.setX(x);
        return this;
    }

    setY(y) {
        this.#components.rectangle.setY(y);
        return this;
    }

    isSelected() {
        return this.#selected;
    }

    setSelected(selected) {
        this.#selected = selected;
        let color;
        if (this.#enabled) {
            if (this.#selected) {
                color = this.#error ? colorScheme.dark.error.color : colorScheme.dark.primary.color;
            } else {
                color = colorScheme.dark.onSurfaceVariant.color;
            }
        } else {
            color = colorScheme.dark.onSurface.color;
        }

        if (this.#selected) {
            this.#components.icon.unhide(true);
        } else {
            this.#components.icon.hide(true);
        }

        animate(this.#components.rectangle, (animation) => {
            animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(color));
        });
        animate(this.#components.fill, (animation) => {
            animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(this.#selected ? color : this.#backgroundColor));
        });
        animate(this.#components.hover, (animation) => {
            animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(setAlpha(selected ? colorScheme.dark.primary.color : colorScheme.dark.onSurface.color, 0.1)));
        });
        return this;
    }

    isError() {
        return this.#error;
    }

    setError(error) {
        this.#error = error;
        let color = this.#enabled ? (this.#error ? colorScheme.dark.error.color : colorScheme.dark.primary.color) : colorScheme.dark.onSurface.color;
        this.#components.rectangle.setColor(color);
        if (this.isSelected()) {
            this.#components.fill.setColor(color);
        } else {
            this.#components.fill.setColor(this.#backgroundColor);
        }
        return this;
    }

    isEnabled() {
        return this.#enabled;
    }

    setEnabled(enabled) {
        this.#enabled = enabled;
        let color = this.#enabled ? (this.#error ? colorScheme.dark.error.color : colorScheme.dark.primary.color) : colorScheme.dark.onSurface.color;
        this.#components.rectangle.setColor(color);
        if (this.isSelected()) {
            this.#components.fill.setColor(color);
        } else {
            this.#components.fill.setColor(this.#backgroundColor);
        }
        return this;
    }

    onButtonClick(event) {
        this.#components.rectangle.onMouseClick(() => {
            if (this.isEnabled()) {
                this.setSelected(!this.isSelected());
                event(this, this.isSelected());
            }
        });
        return this;
    }

    setChildOf(component) {
        this.#components.rectangle.setChildOf(component);
        return this;
    }

    getComponents() {
        return this.#components;
    }
}

export {Checkbox}