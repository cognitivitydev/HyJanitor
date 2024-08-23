/// <reference types="../../../CTAutocomplete" />
/// <reference lib="es2015" />

import {
    AdditiveConstraint,
    Animations,
    AspectConstraint,
    CenterConstraint,
    ChildBasedMaxSizeConstraint,
    ChildBasedSizeConstraint,
    ConstantColorConstraint,
    SiblingConstraint,
    SubtractiveConstraint,
    UIContainer,
    UIImage,
    UIRoundedRectangle,
    UIWrappedText
} from "../../../Elementa";
import { colorScheme } from "../color/ColorScheme";

const Color = Java.type("java.awt.Color");

class Dialog {
    #components = {
        background: undefined,
        icon: {
            container: undefined,
            component: undefined
        },
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
    #primaryEnabled = true;
    #secondaryEnabled = true;

    constructor(primaryButton, secondaryButton = undefined, icon = undefined) {
        this.#components.background = new UIRoundedRectangle(25)
            .setColor(colorScheme.light.surfaceContainerHigh.color)
            .setHeight(new ChildBasedSizeConstraint());
        if (icon) {
            this.#components.icon.container = new UIContainer()
                .setX((0).pixels())
                .setY(new SiblingConstraint())
                .setWidth((100).percent())
                .setHeight((24).pixels())
                .setChildOf(this.#components.background);
            this.#components.icon.component = UIImage.ofFile(icon)
                .setColor(colorScheme.light.secondary.color)
                .setX(new CenterConstraint())
                .setY((50).percent())
                .setWidth((16).pixels())
                .setHeight(new AspectConstraint())
                .setChildOf(this.#components.icon.container);
        }
        this.#components.title.container = new UIContainer()
            .setX((0).pixels())
            .setY(new SiblingConstraint())
            .setWidth((100).percent())
            .setHeight(new AdditiveConstraint(new ChildBasedMaxSizeConstraint(), icon ? (24).pixels() : (16).pixels()))
            .setChildOf(this.#components.background);
        this.#components.title.component = new UIWrappedText("", false, null, icon !== undefined)
            .setColor(colorScheme.light.onSurface.color)
            .setX(new CenterConstraint())
            .setY(icon ? new CenterConstraint() : (50).percent())
            .setWidth((85).percent())
            .setTextScale((1.5).pixels())
            .setChildOf(this.#components.title.container);

        this.#components.description.container = new UIContainer()
            .setX((0).pixels())
            .setY(new SiblingConstraint())
            .setWidth((100).percent())
            .setHeight(new AdditiveConstraint(new ChildBasedMaxSizeConstraint(), (8).pixels()))
            .setChildOf(this.#components.background);
        this.#components.description.component = new UIWrappedText("", false)
            .setColor(colorScheme.light.onSurfaceVariant.color)
            .setX(new CenterConstraint())
            .setY(new CenterConstraint())
            .setWidth((85).percent())
            .setChildOf(this.#components.description.container);

        this.#components.actions.container = new UIContainer()
            .setX((0).pixels())
            .setY(new SiblingConstraint())
            .setWidth((100).percent())
            .setHeight((32).pixels())
            .setChildOf(this.#components.background);

        this.#components.actions.primary = primaryButton
            .setBackgroundColor(colorScheme.light.surfaceContainerHigh.color)
            .setLabelColor(colorScheme.light.primary.color)
            .setX(new SubtractiveConstraint((0).pixels(true), (8).percent()))
            .setY(new CenterConstraint())
            .setWidth((25).percent())
            .setHeight((20).pixels())
            .setChildOf(this.#components.actions.container);
        this.#components.actions.primary.onMouseEnter(() => {
            this.#components.actions.primary.animateBackgroundColor(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.light.primaryContainer.color))
        })
            .onMouseLeave(() => {
                this.#components.actions.primary.animateBackgroundColor(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.light.surfaceContainerHigh.color))
            });

        if (secondaryButton) {
            this.#components.actions.secondary = secondaryButton
                .setBackgroundColor(colorScheme.light.surfaceContainerHigh.color)
                .setLabelColor(colorScheme.light.primary.color)
                .setX(new SubtractiveConstraint((0).pixels(true), (35).percent()))
                .setY(new CenterConstraint())
                .setWidth((25).percent())
                .setHeight((20).pixels())
                .setChildOf(this.#components.actions.container);

            this.#components.actions.secondary.onMouseEnter(() => {
                this.#components.actions.secondary.animateBackgroundColor(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.light.primaryContainer.color))
            })
                .onMouseLeave(() => {
                    this.#components.actions.secondary.animateBackgroundColor(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.light.surfaceContainerHigh.color))
                });
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
        this.#components.title.component.setText((this.#components.icon.container ? "" : "§l") + text);
        if (scale != undefined) this.#components.title.component.setTextScale((scale).pixels());
        if (shadow != undefined) this.#components.title.component.setShadow(shadow);
        return this;
    }

    setDescription(text, scale, shadow) {
        this.#components.description.component.setText(text);
        if (scale != undefined) this.#components.description.component.setTextScale((scale).pixels());
        if (shadow != undefined) this.#components.description.component.setShadow(shadow);
        return this;
    }

    isPrimaryEnabled() {
        return this.#primaryEnabled;
    }

    setPrimaryEnabled(enabled) {
        this.#primaryEnabled = enabled;
        if (enabled) {
            this.#components.actions.primary
                .setBackgroundColor(colorScheme.light.surfaceContainerHigh.color)
                .setLabelColor(colorScheme.light.primary.color);
        } else {
            this.#components.actions.primary
                .setBackgroundColor(colorScheme.light.surfaceContainerHigh.color)
                .setLabelColor(colorScheme.light.onSurface.color);
        }
        return this;
    }

    isSecondaryEnabled() {
        return this.#secondaryEnabled;
    }

    setSecondaryEnabled(enabled) {
        this.#secondaryEnabled = enabled;
        if (enabled) {
            this.#components.actions.secondary
                .setBackgroundColor(colorScheme.light.surfaceContainerHigh.color)
                .setLabelColor(colorScheme.light.primary.color);
        } else {
            this.#components.actions.secondary
                .setBackgroundColor(colorScheme.light.surfaceContainerHigh.color)
                .setLabelColor(colorScheme.light.onSurface.color);
        }
        return this;
    }

    onPrimaryClick(event) {
        this.#components.actions.primary.onMouseClick(() => {
            if (this.isPrimaryEnabled()) {
                event(this);
            }
        });
        return this;
    }

    onSecondaryClick(event) {
        this.#components.actions.secondary.onMouseClick(() => {
            if (this.isSecondaryEnabled()) {
                event(this);
            }
        });
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

export {Dialog};