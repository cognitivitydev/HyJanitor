/// <reference types="../../../CTAutocomplete" />
/// <reference lib="es2015" />

import {
    AdditiveConstraint,
    animate,
    AspectConstraint,
    CenterConstraint,
    ChildBasedSizeConstraint,
    SiblingConstraint,
    SubtractiveConstraint,
    UIBlock,
    UICircle,
    UIContainer,
    UIImage,
    UIText
} from "../../../Elementa";

const Color = Java.type("java.awt.Color");

class OutlinedButton {
    #components = {
        container: undefined,
        outline: undefined,
        outlineL: undefined,
        outlineR: undefined,
        button: undefined,
        buttonL: undefined,
        buttonR: undefined,
        labelContainer: undefined,
        text: undefined,
        icon: undefined
    }
    #thickness;

    constructor(thickness, filledColor, icon = undefined) {
        this.#thickness = thickness;
        this.#components.container = new UIContainer();
        this.#components.outline = new UIBlock()
            .setX(new CenterConstraint())
            .setY(new CenterConstraint())
            .setChildOf(this.#components.container);
        this.#components.outlineL = new UICircle()
            .setX((0).percent())
            .setY(new CenterConstraint())
            .setChildOf(this.#components.outline);
        this.#components.outlineR = new UICircle()
            .setX((100).percent())
            .setY(new CenterConstraint())
            .setChildOf(this.#components.outline);
        this.#components.button = new UIBlock()
            .setColor(filledColor)
            .setX(new CenterConstraint())
            .setY(new CenterConstraint())
            .setChildOf(this.#components.container);
        this.#components.buttonL = new UICircle()
            .setColor(filledColor)
            .setX((0).percent())
            .setY(new CenterConstraint())
            .setChildOf(this.#components.button);
        this.#components.buttonR = new UICircle()
            .setColor(filledColor)
            .setX((100).percent())
            .setY(new CenterConstraint())
            .setChildOf(this.#components.button);
        this.#components.labelContainer = new UIContainer()
            .setX(new CenterConstraint())
            .setY(new CenterConstraint())
            .setWidth(new AdditiveConstraint(new ChildBasedSizeConstraint(), icon ? (8).pixels() : (0).pixels()))
            .setHeight((100).percent())
            .setChildOf(this.#components.container)
        if (icon) {
            this.#components.icon = UIImage.ofFile(icon)
                .setX((0).pixels())
                .setY(new CenterConstraint())
                .setWidth(new AspectConstraint())
                .setChildOf(this.#components.labelContainer);
            this.#components.icon.textureMinFilter = UIImage.TextureScalingMode.LINEAR;
            this.#components.icon.textureMagFilter = UIImage.TextureScalingMode.LINEAR;
        }
        this.#components.text = new UIText()
            .setX(icon ? new AdditiveConstraint(new SiblingConstraint(), (8).pixels()) : (0).pixels())
            .setY(new CenterConstraint())
            .setChildOf(this.#components.labelContainer);
    }

    setBackgroundColor(color) {
        this.#components.outline.setColor(color);
        this.#components.outlineL.setColor(color);
        this.#components.outlineR.setColor(color);
        return this;
    }

    animateBackgroundColor(strategy, time, newConstraint, delay = 0) {
        animate(this.#components.outline, (animation) => {
            animation.setColorAnimation(strategy, time, newConstraint, delay);
        });
        animate(this.#components.outlineL, (animation) => {
            animation.setColorAnimation(strategy, time, newConstraint, delay);
        });
        animate(this.#components.outlineR, (animation) => {
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
        this.#components.outline.setWidth(new SubtractiveConstraint((100).percent(), new AdditiveConstraint(height, (1).pixels()))).setHeight(height);
        this.#components.outlineL.setRadius(new AdditiveConstraint((50).percent(), (0.5).pixels()).getHeightImpl(this.#components.outlineL).pixels());
        this.#components.outlineR.setRadius(new AdditiveConstraint((50).percent(), (0.5).pixels()).getHeightImpl(this.#components.outlineR).pixels());
        this.#components.button.setWidth(new SubtractiveConstraint((100).percent(), new AdditiveConstraint(height, (1).pixels())))
            .setHeight(new SubtractiveConstraint(height, (this.#thickness).pixels()));
        this.#components.buttonL.setRadius(new SubtractiveConstraint((50).percent(), (this.#thickness / 2 - 0.5).pixels()).getHeightImpl(this.#components.outlineL).pixels());
        this.#components.buttonR.setRadius(new SubtractiveConstraint((50).percent(), (this.#thickness / 2 - 0.5).pixels()).getHeightImpl(this.#components.outlineR).pixels());
        return this;
    }

    setIconSize(size) {
        this.#components.icon.setHeight(size);
        return this;
    }

    setIconX(iconX) {
        this.#components.icon.setX(iconX);
        return this;
    }

    setText(text, scale = 1, shadow = true) {
        this.#components.text.setText(text).setTextScale((scale).pixels()).setShadow(shadow);
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

export {OutlinedButton};