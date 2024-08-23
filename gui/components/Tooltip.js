/// <reference types="../../../CTAutocomplete" />
/// <reference lib="es2015" />

import {
    AdditiveConstraint,
    Animations,
    CenterConstraint,
    ChildBasedMaxSizeConstraint,
    ChildBasedSizeConstraint,
    ConstantColorConstraint,
    SiblingConstraint,
    UIContainer,
    UIRoundedRectangle,
    UIWrappedText
} from "../../../Elementa";
import { colorScheme } from "../color/ColorScheme";

const Color = Java.type("java.awt.Color");

class Tooltip {
    #components = {
        background: undefined,
        title: {
            container: undefined,
            component: undefined
        },
        description: {
            container: undefined,
            component: undefined
        },
        actions: {
            container: undefined,
            primary: undefined,
            secondary: undefined
        }
    }

    constructor(primaryButton = undefined, secondaryButton = undefined) {
        this.#components.background = new UIRoundedRectangle(12)
            .setColor(colorScheme.light.surfaceContainerHigh.color)
            .setHeight(new ChildBasedSizeConstraint());
        this.#components.title.container = new UIContainer()
            .setX((0).pixels())
            .setY(new SiblingConstraint())
            .setWidth((100).percent())
            .setHeight(new AdditiveConstraint(new ChildBasedMaxSizeConstraint(), (8).pixels()))
            .setChildOf(this.#components.background);
        this.#components.title.component = new UIWrappedText("")
            .setColor(colorScheme.light.onSurface.color)
            .setX(new CenterConstraint())
            .setY((-2).pixels(true))
            .setWidth((85).percent())
            .setChildOf(this.#components.title.container);

        this.#components.description.container = new UIContainer()
            .setX((0).pixels())
            .setY(new SiblingConstraint())
            .setWidth((100).percent())
            .setHeight(new AdditiveConstraint(new ChildBasedMaxSizeConstraint(), (16).pixels()))
            .setChildOf(this.#components.background);
        this.#components.description.component = new UIWrappedText()
            .setColor(colorScheme.light.outline.color)
            .setX(new CenterConstraint())
            .setY(new CenterConstraint())
            .setWidth((85).percent())
            .setChildOf(this.#components.description.container);

        if (primaryButton) {
            this.#components.actions.container = new UIContainer()
                .setX((0).pixels())
                .setY(new SiblingConstraint())
                .setWidth((100).percent())
                .setHeight((24).pixels())
                .setChildOf(this.#components.background);

            this.#components.actions.primary = primaryButton
                .setBackgroundColor(colorScheme.light.surfaceContainerHigh.color)
                .setLabelColor(colorScheme.light.primary.color)
                .setX((16).pixels())
                .setY((0).pixels())
                .setWidth((25).percent())
                .setHeight((20).pixels())
                .onMouseEnter((button) => {
                    button.animateBackgroundColor(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.light.primaryContainer.color))
                })
                .onMouseLeave((button) => {
                    button.animateBackgroundColor(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.light.surfaceContainerHigh.color))
                })
                .setChildOf(this.#components.actions.container);
        }
        if (secondaryButton) {
            this.#components.actions.secondary = secondaryButton
                .setBackgroundColor(colorScheme.light.surfaceContainerHigh.color)
                .setLabelColor(colorScheme.light.primary.color)
                .setX(new SiblingConstraint(16))
                .setY((0).pixels())
                .setWidth((25).percent())
                .setHeight((20).pixels())
                .onMouseEnter((button) => {
                    button.animateBackgroundColor(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.light.primaryContainer.color))
                })
                .onMouseLeave((button) => {
                    button.animateBackgroundColor(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.light.surfaceContainerHigh.color))
                })
                .setChildOf(this.#components.actions.container);
        }
    }

    setX(x) {
        this.#components.background.setX(x);
        return this;
    }

    setY(y) {
        this.#components.background.setY(y);
        return this;
    }

    setWidth(width) {
        this.#components.background.setWidth(width);
        return this;
    }

    setTitle(text, scale, shadow) {
        this.#components.title.component.setText(text);
        if (scale !== undefined) this.#components.title.component.setTextScale((scale).pixels());
        if (shadow !== undefined) this.#components.title.component.setShadow(shadow);
        return this;
    }

    setDescription(text, scale, shadow) {
        this.#components.description.component.setText(text);
        if (scale !== undefined) this.#components.description.component.setTextScale((scale).pixels());
        if (shadow !== undefined) this.#components.description.component.setShadow(shadow);
        return this;
    }

    onPrimaryClick(event) {
        this.#components.actions.primary.onMouseClick(() => event(this));
        return this;
    }

    onSecondaryClick(event) {
        this.#components.actions.secondary.onMouseClick(() => event(this));
        return this;
    }

    setChildOf(component) {
        this.#components.background.setChildOf(component);
        return this;
    }

    getComponents() {
        return this.#components;
    }
}

export {Tooltip};