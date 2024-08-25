/* CURRENTLY UNUSED */

/// <reference types="../../../CTAutocomplete" />
/// <reference lib="es2015" />

import { animate, Animations, CenterConstraint, ConstantColorConstraint, UICircle } from "../../../Elementa";
import { colorScheme, setAlpha } from "../color/ColorScheme";

const Color = Java.type("java.awt.Color");

class Radio {
    #components = {
        outline: undefined,
        background: undefined,
        dot: undefined,
        hover: undefined
    }
    #selected;
    #enabled = true;
    #group;
    selectEvent = () => {
    };

    constructor(backgroundColor, selected = false) {
        this.#selected = selected;
        this.#components.outline = new UICircle()
            .onMouseEnter((() => {
                if (this.isEnabled()) {
                    animate(this.#components.hover, (animation) => {
                        animation.setRadiusAnimation(Animations.OUT_EXP, 0.2, (200).percent());
                    });
                }
            }))
            .onMouseLeave((() => {
                if (this.isEnabled()) {
                    animate(this.#components.hover, (animation) => {
                        animation.setRadiusAnimation(Animations.OUT_EXP, 0.2, (0).percent());
                    });
                }
            }))
            .onMouseClick(() => {
                if (this.isEnabled()) {
                    if (this.#group) {
                        this.#group.select(!this.isSelected() ? this : undefined);
                    } else {
                        this.setSelected(!this.isSelected());
                    }
                }
            });
        this.#components.background = new UICircle()
            .setColor(backgroundColor)
            .setX(new CenterConstraint()).setY(new CenterConstraint())
            .setRadius((80).percent())
            .setChildOf(this.#components.outline);
        this.#components.dot = new UICircle()
            .setColor(new Color(0, 0, 0, 0))
            .setX(new CenterConstraint()).setY(new CenterConstraint())
            .setRadius((50).percent())
            .setChildOf(this.#components.outline);
        this.#components.hover = new UICircle()
            .setColor(setAlpha(this.#selected ? colorScheme.dark.primary.color : colorScheme.dark.onSurface.color, 0.1))
            .setX(new CenterConstraint()).setY(new CenterConstraint())
            .setRadius((0).percent())
            .setChildOf(this.#components.outline);
        if (this.#selected) {
            this.#components.outline.setColor(colorScheme.light.primary.color);
            this.#components.dot.setColor(colorScheme.light.primary.color);
        } else {
            this.#components.outline.setColor(colorScheme.light.onSurfaceVariant.color);
            this.#components.dot.setColor(new Color(0, 0, 0, 0));
        }
    }

    setX(x) {
        this.#components.outline.setX(x);
        return this;
    }

    setY(y) {
        this.#components.outline.setY(y);
        return this;
    }

    setRadius(radius) {
        this.#components.outline.setRadius(radius);
        return this;
    }

    isSelected() {
        return this.#selected;
    }

    setSelected(selected) {
        if (this.#selected === selected) return;
        this.#selected = selected;
        let outlineColor;
        let dotColor;
        if (this.#enabled) {
            if (this.#selected) {
                outlineColor = colorScheme.light.primary.color;
            } else {
                outlineColor = colorScheme.light.onSurfaceVariant.color;
            }
        } else {
            outlineColor = colorScheme.light.onSurface.color;
        }
        dotColor = this.#selected ? outlineColor : new Color(0, 0, 0, 0);

        animate(this.#components.outline, (animation) => {
            animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(outlineColor));
        });
        animate(this.#components.dot, (animation) => {
            animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(dotColor));
        });
        animate(this.#components.hover, (animation) => {
            animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(setAlpha(outlineColor, 0.1)));
        });

        this.selectEvent(this, selected);
        return this;
    }

    isEnabled() {
        return this.#enabled;
    }

    setEnabled(enabled) {
        this.#enabled = enabled;
        let color = this.#enabled ? colorScheme.light.primary.color : colorScheme.light.onSurface.color;
        this.#components.outline.setColor(color);
        if (!this.#enabled) this.#components.hover.setRadius((0).percent())
        this.#components.hover.setColor(setAlpha(color, this.#components.hover.isHovered() ? 0.1 : 0));
        if (this.#selected) {
            this.#components.dot.setColor(color);
        } else {
            this.#components.dot.setColor(new Color(0, 0, 0, 0));
        }
        return this;
    }

    onSelect(event) {
        this.selectEvent = event;
        return this;
    }

    setGroup(group) {
        if (this.#group) {
            this.#group.removeRadio(this);
        }
        this.#group = group;
        group.addRadio(this);
        return this;
    }

    setChildOf(component) {
        this.#components.outline.setChildOf(component);
        return this;
    }

    getComponents() {
        return this.#components;
    }
}

class RadioGroup {
    #radios = [];
    #selection = undefined;

    addRadio(radio) {
        this.#radios.push(radio);
    }

    select(selection) {
        this.#selection = selection;
        for (let radio of this.#radios) {
            radio.setSelected(radio === selection);
        }
    }

    getSelection() {
        return this.#selection;
    }
}

export { Radio, RadioGroup };