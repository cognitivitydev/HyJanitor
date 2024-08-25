/// <reference types="../../../CTAutocomplete" />
/// <reference lib="es2015" />

import {
    AdditiveConstraint,
    animate,
    Animations,
    AspectConstraint,
    CenterConstraint,
    ChildBasedSizeConstraint,
    ConstantColorConstraint,
    SiblingConstraint,
    SubtractiveConstraint,
    UIBlock,
    UICircle,
    UIContainer,
    UIImage,
    UIText
} from "../../../Elementa";
import { colorScheme } from "../color/ColorScheme";

const Color = Java.type("java.awt.Color");

class Button {
    #components = {
        container: undefined,
        button: undefined,
        buttonL: undefined,
        buttonR: undefined,
        labelContainer: undefined,
        text: undefined,
        icon: undefined
    }

    constructor(icon = undefined) {
        this.#components.container = new UIContainer();
        this.#components.button = new UIBlock()
            .setX(new CenterConstraint()).setY(new CenterConstraint())
            .setChildOf(this.#components.container);
        this.#components.buttonL = new UICircle()
            .setX((0).percent()).setY(new CenterConstraint())
            .setChildOf(this.#components.button);
        this.#components.buttonR = new UICircle()
            .setX((100).percent()).setY(new CenterConstraint())
            .setChildOf(this.#components.button);
        this.#components.labelContainer = new UIContainer()
            .setX(new CenterConstraint()).setY(new CenterConstraint())
            .setWidth(new AdditiveConstraint(new ChildBasedSizeConstraint(), icon ? (8).pixels() : (0).pixels())).setHeight((100).percent())
            .setChildOf(this.#components.container)
        if (icon) {
            this.#components.icon = UIImage.ofFile(icon)
                .setX((0).pixels()).setY(new CenterConstraint())
                .setWidth(new AspectConstraint())
                .setChildOf(this.#components.labelContainer);
            this.#components.icon.textureMinFilter = UIImage.TextureScalingMode.LINEAR;
            this.#components.icon.textureMagFilter = UIImage.TextureScalingMode.LINEAR;
        }
        this.#components.text = new UIText()
            .setX(icon ? new AdditiveConstraint(new SiblingConstraint(), (8).pixels()) : (0).pixels()).setY(new CenterConstraint())
            .setChildOf(this.#components.labelContainer);
    }

    setColor(color, container) {
        color = color.toLowerCase();
        let color2 = color[0].toUpperCase() + color.substring(1);
        let backgroundColor, backgroundColorHover;
        let labelColor, labelColorHover;
        if (container) {
            backgroundColor = colorScheme.dark[color + "Container"].color;
            labelColor = colorScheme.dark["on" + color2 + "Container"].color;
            backgroundColorHover = colorScheme.dark["on" + color2].color;
            labelColorHover = colorScheme.dark[color].color;
        } else {
            backgroundColor = colorScheme.dark[color].color;
            labelColor = colorScheme.dark["on" + color2].color;
            backgroundColorHover = colorScheme.dark["on" + color2 + "Container"].color;
            labelColorHover = colorScheme.dark[color + "Container"].color;
        }
        this.setBackgroundColor(backgroundColor);
        this.setLabelColor(labelColor);
        this.onMouseEnter(() => {
            this.animateBackgroundColor(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(backgroundColorHover));
            this.animateLabelColor(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(labelColorHover));
        })
            .onMouseLeave(() => {
                this.animateBackgroundColor(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(backgroundColor));
                this.animateLabelColor(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(labelColor));
            });
        return this;
    }

    setBackgroundColor(color) {
        this.#components.button.setColor(color);
        this.#components.buttonL.setColor(color);
        this.#components.buttonR.setColor(color);
        return this;
    }

    animateBackgroundColor(strategy, time, newConstraint, delay = 0) {
        animate(this.#components.button, (animation) => {
            animation.setColorAnimation(strategy, time, newConstraint, delay);
        });
        animate(this.#components.buttonL, (animation) => {
            animation.setColorAnimation(strategy, time, newConstraint, delay);
        });
        animate(this.#components.buttonR, (animation) => {
            animation.setColorAnimation(strategy, time, newConstraint, delay);
        });
    }

    setLabelColor(color) {
        this.#components.text.setColor(color);
        this.#components.icon?.setColor(color);
        return this;
    }

    animateLabelColor(strategy, time, newConstraint, delay = 0) {
        animate(this.#components.text, (animation) => {
            animation.setColorAnimation(strategy, time, newConstraint, delay);
        });
        if (this.#components.icon) {
            animate(this.#components.icon, (animation) => {
                animation.setColorAnimation(strategy, time, newConstraint, delay);
            });
        }
    }

    setX(x) {
        this.#components.container.setX(x);
        return this;
    }

    setY(y) {
        this.#components.container.setY(y);
        return this;
    }

    setWidth(width) {
        this.#components.container.setWidth(width);
        return this;
    }

    setHeight(height) {
        this.#components.container.setHeight(height);
        this.#components.button.setWidth(new SubtractiveConstraint((100).percent(), new AdditiveConstraint(height, (1).pixels()))).setHeight(height);
        this.#components.buttonL.setRadius(new AdditiveConstraint((50).percent(), (0.5).pixels()).getHeightImpl(this.#components.buttonL).pixels());
        this.#components.buttonR.setRadius(new AdditiveConstraint((50).percent(), (0.5).pixels()).getHeightImpl(this.#components.buttonR).pixels());
        return this;
    }

    setIconSize(size) {
        this.#components.icon.setHeight(size);
        return this;
    }

    setText(text, scale, shadow) {
        this.#components.text.setText(text);
        if (scale != undefined) this.#components.text.setTextScale((scale).pixels());
        if (shadow != undefined) this.#components.text.setShadow(shadow);
        return this;
    }

    onMouseEnter(event) {
        this.#components.container.onMouseEnter(() => event(this));
        return this;
    }

    onMouseLeave(event) {
        this.#components.container.onMouseLeave(() => event(this));
        return this;
    }

    onMouseClick(event) {
        this.#components.container.onMouseClick(() => event(this));
        return this;
    }

    setChildOf(component) {
        this.#components.container.setChildOf(component);
        return this;
    }

    getComponents() {
        return this.#components;
    }
}

export { Button };