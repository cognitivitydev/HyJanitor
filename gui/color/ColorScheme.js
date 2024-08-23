/// <reference types="../../../CTAutocomplete" />
/// <reference lib="es2015" />

const Color = Java.type("java.awt.Color");

function hexToColor(hex) {
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    return new Color(r / 255, g / 255, b / 255);
}


// https://material-foundation.github.io/material-theme-builder/
export const colorScheme = {
    "light": {
        "primary": {"hex": "#605790", "color": undefined},
        "surfaceTint": {"hex": "#605790", "color": undefined},
        "onPrimary": {"hex": "#FFFFFF", "color": undefined},
        "primaryContainer": {"hex": "#E6DEFF", "color": undefined},
        "onPrimaryContainer": {"hex": "#1C1149", "color": undefined},

        "secondary": {"hex": "#605C71", "color": undefined},
        "onSecondary": {"hex": "#FFFFFF", "color": undefined},
        "secondaryContainer": {"hex": "#E6DFF9", "color": undefined},
        "onSecondaryContainer": {"hex": "#1C192B", "color": undefined},

        "tertiary": {"hex": "#7C5264", "color": undefined},
        "onTertiary": {"hex": "#FFFFFF", "color": undefined},
        "tertiaryContainer": {"hex": "#FFD8E6", "color": undefined},
        "onTertiaryContainer": {"hex": "#301120", "color": undefined},

        "success": {"hex": "#2C6A45", "color": undefined},
        "onSuccess": {"hex": "#FFFFFF", "color": undefined},
        "successContainer": {"hex": "#B0F1C3", "color": undefined},
        "onSuccessContainer": {"hex": "#00210F", "color": undefined},

        "warn": {"hex": "#765A0B", "color": undefined},
        "onWarn": {"hex": "#FFFFFF", "color": undefined},
        "warnContainer": {"hex": "#FFDF9A", "color": undefined},
        "onWarnContainer": {"hex": "#251A00", "color": undefined},

        "error": {"hex": "#904A43", "color": undefined},
        "onError": {"hex": "#FFFFFF", "color": undefined},
        "errorContainer": {"hex": "#FFDAD6", "color": undefined},
        "onErrorContainer": {"hex": "#3B0907", "color": undefined},

        "background": {"hex": "#FDF8FF", "color": undefined},
        "onBackground": {"hex": "#1C1B20", "color": undefined},

        "surface": {"hex": "#FDF8FF", "color": undefined},
        "onSurface": {"hex": "#1C1B20", "color": undefined},
        "surfaceVariant": {"hex": "#E6E0EC", "color": undefined},
        "onSurfaceVariant": {"hex": "#48454E", "color": undefined},

        "outline": {"hex": "#79757F", "color": undefined},
        "outlineVariant": {"hex": "#C9C5D0", "color": undefined},

        "shadow": {"hex": "#000000", "color": undefined},
        "scrim": {"hex": "#000000", "color": undefined},

        "inverseSurface": {"hex": "#312F36", "color": undefined},
        "inverseOnSurface": {"hex": "#F4EFF7", "color": undefined},
        "inversePrimary": {"hex": "#C9BEFF", "color": undefined},

        "primaryFixed": {"hex": "#E6DEFF", "color": undefined},
        "onPrimaryFixed": {"hex": "#1C1149", "color": undefined},
        "primaryFixedDim": {"hex": "#C9BEFF", "color": undefined},
        "onPrimaryFixedVariant": {"hex": "#483F77", "color": undefined},

        "secondaryFixed": {"hex": "#E6DFF9", "color": undefined},
        "onSecondaryFixed": {"hex": "#1C192B", "color": undefined},
        "secondaryFixedDim": {"hex": "#C9C3DC", "color": undefined},
        "onSecondaryFixedVariant": {"hex": "#484459", "color": undefined},

        "tertiaryFixed": {"hex": "#FFD8E6", "color": undefined},
        "onTertiaryFixed": {"hex": "#301120", "color": undefined},
        "tertiaryFixedDim": {"hex": "#EDB8CD", "color": undefined},
        "onTertiaryFixedVariant": {"hex": "#623B4C", "color": undefined},

        "surfaceDim": {"hex": "#DDD8E0", "color": undefined},
        "surfaceBright": {"hex": "#FDF8FF", "color": undefined},
        "surfaceContainerLowest": {"hex": "#FFFFFF", "color": undefined},
        "surfaceContainerLow": {"hex": "#F7F2FA", "color": undefined},
        "surfaceContainer": {"hex": "#F1ECF4", "color": undefined},
        "surfaceContainerHigh": {"hex": "#EBE6EE", "color": undefined},
        "surfaceContainerHighest": {"hex": "#E6E1E9", "color": undefined},
    },
    "dark": {
        "primary": {"hex": "#C9BEFF", "color": undefined},
        "surfaceTint": {"hex": "#C9BEFF", "color": undefined},
        "onPrimary": {"hex": "#31285F", "color": undefined},
        "primaryContainer": {"hex": "#483F77", "color": undefined},
        "onPrimaryContainer": {"hex": "#E6DEFF", "color": undefined},

        "secondary": {"hex": "#C9C3DC", "color": undefined},
        "onSecondary": {"hex": "#312E41", "color": undefined},
        "secondaryContainer": {"hex": "#484459", "color": undefined},
        "onSecondaryContainer": {"hex": "#E6DFF9", "color": undefined},

        "tertiary": {"hex": "#EDB8CD", "color": undefined},
        "onTertiary": {"hex": "#482535", "color": undefined},
        "tertiaryContainer": {"hex": "#623B4C", "color": undefined},
        "onTertiaryContainer": {"hex": "#FFD8E6", "color": undefined},

        "success": {"hex": "#95D5A8", "color": undefined},
        "onSuccess": {"hex": "#00391D", "color": undefined},
        "successContainer": {"hex": "#0F512F", "color": undefined},
        "onSuccessContainer": {"hex": "#B0F1C3", "color": undefined},

        "warn": {"hex": "#E7C26C", "color": undefined},
        "onWarn": {"hex": "#3F2E00", "color": undefined},
        "warnContainer": {"hex": "#5A4300", "color": undefined},
        "onWarnContainer": {"hex": "#FFDF9A", "color": undefined},

        "error": {"hex": "#FFB4AB", "color": undefined},
        "onError": {"hex": "#561E19", "color": undefined},
        "errorContainer": {"hex": "#73332D", "color": undefined},
        "onErrorContainer": {"hex": "#FFDAD6", "color": undefined},

        "background": {"hex": "#141318", "color": undefined},
        "onBackground": {"hex": "#E6E1E9", "color": undefined},

        "surface": {"hex": "#141318", "color": undefined},
        "onSurface": {"hex": "#E6E1E9", "color": undefined},
        "surfaceVariant": {"hex": "#48454E", "color": undefined},
        "onSurfaceVariant": {"hex": "#C9C5D0", "color": undefined},

        "outline": {"hex": "#938F99", "color": undefined},
        "outlineVariant": {"hex": "#48454E", "color": undefined},

        "shadow": {"hex": "#000000", "color": undefined},
        "scrim": {"hex": "#000000", "color": undefined},

        "inverseSurface": {"hex": "#E6E1E9", "color": undefined},
        "inverseOnSurface": {"hex": "#312F36", "color": undefined},
        "inversePrimary": {"hex": "#605790", "color": undefined},

        "primaryFixed": {"hex": "#E6DEFF", "color": undefined},
        "onPrimaryFixed": {"hex": "#1C1149", "color": undefined},
        "primaryFixedDim": {"hex": "#C9BEFF", "color": undefined},
        "onPrimaryFixedVariant": {"hex": "#483F77", "color": undefined},

        "secondaryFixed": {"hex": "#E6DFF9", "color": undefined},
        "onSecondaryFixed": {"hex": "#1C192B", "color": undefined},
        "secondaryFixedDim": {"hex": "#C9C3DC", "color": undefined},
        "onSecondaryFixedVariant": {"hex": "#484459", "color": undefined},

        "tertiaryFixed": {"hex": "#FFD8E6", "color": undefined},
        "onTertiaryFixed": {"hex": "#301120", "color": undefined},
        "tertiaryFixedDim": {"hex": "#EDB8CD", "color": undefined},
        "onTertiaryFixedVariant": {"hex": "#623B4C", "color": undefined},

        "surfaceDim": {"hex": "#141318", "color": undefined},
        "surfaceBright": {"hex": "#3A383E", "color": undefined},
        "surfaceContainerLowest": {"hex": "#0F0D13", "color": undefined},
        "surfaceContainerLow": {"hex": "#1C1B20", "color": undefined},
        "surfaceContainer": {"hex": "#201F25", "color": undefined},
        "surfaceContainerHigh": {"hex": "#2B292F", "color": undefined},
        "surfaceContainerHighest": {"hex": "#36343A", "color": undefined}
    }
}

for (let theme in colorScheme) {
    let colors = colorScheme[theme];
    for (let name in colors) {
        let data = colors[name];
        data.color = hexToColor(data.hex.replace("#", ""));
    }
}

export function setAlpha(color, alpha) {
    return new Color(color.getRed() / 255, color.getGreen() / 255, color.getBlue() / 255, alpha);
}