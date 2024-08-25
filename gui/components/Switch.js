/// <reference types="../../../CTAutocomplete" />
/// <reference lib="es2015" />

import {
    AdditiveConstraint,
    animate,
    Animations,
    AspectConstraint,
    CenterConstraint,
    ConstantColorConstraint,
    SubtractiveConstraint,
    UIBlock,
    UICircle,
    UIContainer,
    UIImage
} from "../../../Elementa";
import { colorScheme, setAlpha } from "../color/ColorScheme";

const File = Java.type("java.io.File");

class Switch {
    #components = {
        container: undefined,
        rectangle: undefined,
        outline: undefined,
        outlineL: undefined,
        outlineR: undefined,
        button: undefined,
        buttonL: undefined,
        buttonR: undefined,
        target: {
            circle: undefined,
            hover: undefined,
            iconOn: undefined,
            iconOff: undefined
        }
    }
    #selected;
    #enabled = true;
    #showIcon = false;

    constructor(selected = false, showIcon = false) {
        this.#selected = selected;
        this.#showIcon = showIcon;
        this.#components.container = new UIContainer()
            .onMouseEnter(() => {
                let outlineColor;
                let backgroundColor;
                let targetColor;
                if (this.#enabled) {
                    if (this.#selected) {
                        outlineColor = colorScheme.dark.primary.color;
                        backgroundColor = colorScheme.dark.primary.color;
                        targetColor = colorScheme.dark.primaryContainer.color;
                    } else {
                        outlineColor = colorScheme.dark.outline.color;
                        backgroundColor = colorScheme.dark.surfaceContainerHighest.color;
                        targetColor = colorScheme.dark.onSurfaceVariant.color;
                    }
                } else {
                    if (this.#selected) {
                        outlineColor = colorScheme.dark.onBackground.color;
                        backgroundColor = colorScheme.dark.onBackground.color;
                        targetColor = colorScheme.dark.surface.color;
                    } else {
                        outlineColor = colorScheme.dark.outline.color;
                        backgroundColor = colorScheme.dark.outlineVariant.color;
                        targetColor = colorScheme.dark.onSurface.color;
                    }
                }
                this.animateOutlineColor(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(outlineColor));
                this.animateBackgroundColor(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(backgroundColor));
                animate(this.#components.target.circle, (animation) => {
                    animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(targetColor));
                });
                animate(this.#components.target.hover, (animation) => {
                    animation.setRadiusAnimation(Animations.OUT_EXP, 0.2, (75).percent().getHeightImpl(this.#components.outline).pixels());
                });
            })
            .onMouseLeave(() => {
                let outlineColor;
                let backgroundColor;
                let targetColor;
                if (this.#enabled) {
                    if (this.#selected) {
                        outlineColor = colorScheme.dark.primary.color;
                        backgroundColor = colorScheme.dark.primary.color;
                        targetColor = colorScheme.dark.onPrimary.color;
                    } else {
                        outlineColor = colorScheme.dark.outline.color;
                        backgroundColor = colorScheme.dark.surfaceContainerHighest.color;
                        targetColor = colorScheme.dark.outline.color;
                    }
                } else {
                    if (this.#selected) {
                        outlineColor = colorScheme.dark.onBackground.color;
                        backgroundColor = colorScheme.dark.onBackground.color;
                        targetColor = colorScheme.dark.surface.color;
                    } else {
                        outlineColor = colorScheme.dark.outline.color;
                        backgroundColor = colorScheme.dark.outlineVariant.color;
                        targetColor = colorScheme.dark.onSurface.color;
                    }
                }
                this.animateOutlineColor(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(outlineColor));
                this.animateBackgroundColor(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(backgroundColor));
                animate(this.#components.target.circle, (animation) => {
                    animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(targetColor));
                });
                animate(this.#components.target.hover, (animation) => {
                    animation.setRadiusAnimation(Animations.OUT_EXP, 0.2, (0).percent());
                });
            });
        this.#components.outline = new UIBlock()
            .setX(new CenterConstraint()).setY(new CenterConstraint())
            .setChildOf(this.#components.container);
        this.#components.outlineL = new UICircle()
            .setX((0).percent()).setY(new CenterConstraint())
            .setChildOf(this.#components.outline);
        this.#components.outlineR = new UICircle()
            .setX((100).percent()).setY(new CenterConstraint())
            .setChildOf(this.#components.outline);
        this.#components.button = new UIBlock()
            .setX(new CenterConstraint()).setY(new CenterConstraint())
            .setChildOf(this.#components.container);
        this.#components.buttonL = new UICircle()
            .setX((0).percent()).setY(new CenterConstraint())
            .setChildOf(this.#components.button);
        this.#components.buttonR = new UICircle()
            .setX((100).percent()).setY(new CenterConstraint())
            .setChildOf(this.#components.button);
        this.#components.target.circle = new UICircle()
            .setY(new CenterConstraint())
            .setChildOf(this.#components.container);
        this.#components.target.hover = new UICircle()
            .setColor(setAlpha(selected ? colorScheme.dark.primary.color : colorScheme.dark.onSurface.color, 0.1))
            .setX(new CenterConstraint()).setY(new CenterConstraint())
            .setChildOf(this.#components.target.circle);
        if (showIcon) {
            this.#components.target.iconOn = UIImage.ofFile(new File("./config/ChatTriggers/modules/HyJanitor/icons/g-check.png"))
                .setColor(setAlpha(colorScheme.dark.onPrimaryContainer.color, selected ? 1 : 0))
                .setX(new CenterConstraint()).setY(new CenterConstraint())
                .setWidth((200 / 3).percent()).setHeight(new AspectConstraint())
                .setChildOf(this.#components.target.circle);
            this.#components.target.iconOn.textureMinFilter = UIImage.TextureScalingMode.LINEAR;
            this.#components.target.iconOn.textureMagFilter = UIImage.TextureScalingMode.LINEAR;

            this.#components.target.iconOff = UIImage.ofFile(new File("./config/ChatTriggers/modules/HyJanitor/icons/g-close.png"))
                .setColor(setAlpha(colorScheme.dark.surfaceContainerHighest.color, selected ? 0 : 1))
                .setX(new CenterConstraint()).setY(new CenterConstraint())
                .setWidth((200 / 3).percent()).setHeight(new AspectConstraint())
                .setChildOf(this.#components.target.circle);
            this.#components.target.iconOff.textureMinFilter = UIImage.TextureScalingMode.LINEAR;
            this.#components.target.iconOff.textureMagFilter = UIImage.TextureScalingMode.LINEAR;
        }
        if (selected) {
            this.setOutlineColor(colorScheme.dark.primary.color);
            this.setBackgroundColor(colorScheme.dark.primary.color);
            this.#components.target.circle.setColor(colorScheme.dark.onPrimary.color);
        } else {
            this.setOutlineColor(colorScheme.dark.outline.color);
            this.setBackgroundColor(colorScheme.dark.surfaceContainerHighest.color);
            this.#components.target.circle.setColor(colorScheme.dark.outline.color);
        }
    }

    setOutlineColor(color) {
        this.#components.outline.setColor(color);
        this.#components.outlineL.setColor(color);
        this.#components.outlineR.setColor(color);
        return this;
    }

    animateOutlineColor(strategy, time, newConstraint, delay = 0) {
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
            .setHeight(new SubtractiveConstraint(height, (4).pixels()));
        this.#components.buttonL.setRadius(new SubtractiveConstraint((50).percent(), (1.5).pixels()).getHeightImpl(this.#components.outlineL).pixels());
        this.#components.buttonR.setRadius(new SubtractiveConstraint((50).percent(), (1.5).pixels()).getHeightImpl(this.#components.outlineR).pixels());
        if (this.isSelected()) {
            let targetRadius = new SubtractiveConstraint((50).percent(), (3).pixels()).getHeightImpl(this.#components.outline);
            this.#components.target.circle.setRadius(targetRadius.pixels())
            this.#components.target.circle.setX(new SubtractiveConstraint((100).percent(), (3 + targetRadius).pixels()));
        } else {
            let targetRadius = new SubtractiveConstraint((this.#showIcon ? 50 : 33).percent(), (3).pixels()).getHeightImpl(this.#components.outline);
            this.#components.target.circle.setRadius(targetRadius.pixels())
            this.#components.target.circle.setX((this.#showIcon ? 4 + targetRadius : 7 + targetRadius).pixels());
        }
        return this;
    }

    isSelected() {
        return this.#selected;
    }

    setSelected(selected) {
        this.#selected = selected;
        if (selected) {
            let targetRadius = new SubtractiveConstraint((50).percent(), (2).pixels()).getHeightImpl(this.#components.outline);
            animate(this.#components.target.circle, (animation) => {
                animation.setXAnimation(Animations.OUT_EXP, 0.2, new SubtractiveConstraint((100).percent(), (3 + targetRadius).pixels()))
                animation.setRadiusAnimation(Animations.OUT_EXP, 0.2, (targetRadius).pixels());
                animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(this.#components.container.isHovered() ? colorScheme.dark.primaryContainer.color : colorScheme.dark.onPrimary.color));
            });
            if (this.#showIcon) {
                animate(this.#components.target.iconOn, (animation) => {
                    animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(setAlpha(
                        this.#enabled ? colorScheme.dark.onPrimaryContainer.color : colorScheme.dark.onSurface.color, this.#enabled ? 1 : 0.38
                    )));
                });
                animate(this.#components.target.iconOff, (animation) => {
                    animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(setAlpha(colorScheme.dark.surfaceContainerHighest.color, 0)));
                });
            }
            this.animateOutlineColor(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.primary.color));
            this.animateBackgroundColor(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.primary.color));
            animate(this.#components.target.hover, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(setAlpha(colorScheme.dark.primary.color, 0.1)));
            });
        } else {
            let targetRadius = new SubtractiveConstraint((this.#showIcon ? 50 : 33).percent(), (3).pixels()).getHeightImpl(this.#components.outline);
            animate(this.#components.target.circle, (animation) => {
                animation.setXAnimation(Animations.OUT_EXP, 0.2, (this.#showIcon ? 4 + targetRadius : 7 + targetRadius).pixels())
                animation.setRadiusAnimation(Animations.OUT_EXP, 0.2, (targetRadius).pixels())
                animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(this.#components.container.isHovered() ? colorScheme.dark.onSurfaceVariant.color : colorScheme.dark.outline.color));
            });
            if (this.#showIcon) {
                animate(this.#components.target.iconOn, (animation) => {
                    animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(setAlpha(
                        this.#enabled ? colorScheme.dark.onPrimaryContainer.color : colorScheme.dark.onSurface.color, 0
                    )));
                });
                animate(this.#components.target.iconOff, (animation) => {
                    animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(setAlpha(colorScheme.dark.surfaceContainerHighest.color, this.#enabled ? 1 : 0.38)));
                });
            }
            this.animateOutlineColor(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.outline.color));
            this.animateBackgroundColor(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(colorScheme.dark.surfaceContainerHighest.color));
            animate(this.#components.target.hover, (animation) => {
                animation.setColorAnimation(Animations.OUT_EXP, 0.2, new ConstantColorConstraint(setAlpha(colorScheme.dark.onSurface.color, 0.1)));
            });
        }
        return this;
    }

    isEnabled() {
        return this.#enabled;
    }

    setEnabled(enabled) {
        this.#enabled = enabled;
        let outlineColor;
        let backgroundColor;
        let targetColor;
        if (this.#selected) {
            outlineColor = colorScheme.dark.onBackground.color;
            backgroundColor = colorScheme.dark.onBackground.color;
            targetColor = colorScheme.dark.surface.color;
        } else {
            outlineColor = colorScheme.dark.outline.color;
            backgroundColor = colorScheme.dark.outlineVariant.color;
            targetColor = colorScheme.dark.onSurface.color;
        }
        this.#components.outline.setColor(outlineColor);
        this.#components.outlineL.setColor(outlineColor);
        this.#components.outlineR.setColor(outlineColor);
        this.#components.button.setColor(backgroundColor);
        this.#components.buttonL.setColor(backgroundColor);
        this.#components.buttonR.setColor(backgroundColor);
        this.#components.target.circle.setColor(targetColor);
        return this;
    }

    onButtonClick(event) {
        this.#components.container.onMouseClick(() => {
            if (this.isEnabled()) {
                this.setSelected(!this.isSelected());
                event(this, this.isSelected());
            }
        });
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

export { Switch };