//sorry to the verifier for the many thousands lines from guis

/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />

import Settings from "./config";
import "./chat/ChatManager";
import "./chat/ChatOverlay";
import "./chat/HyJanitorCommand";
import "./chat/MuteManager";

let trigger = register("worldLoad", () => {
    setTimeout(() => {
        if(Settings.previousVersion === "") {
            ChatLib.chat(ChatLib.getCenteredText("&b&lHYJANITOR  &8&m  &7  v"+Settings.version));
            ChatLib.chat("  &7Thank you for downloading &3HyJanitor&7!");
            ChatLib.chat("  &7To start, type &3/hyjanitor &7to edit your message rules.");
            ChatLib.chat(new Message("  &7If you find any issues, please report them ", new TextComponent("&3&nhere").setClick("open_url", "https://github.com/cognitivitydev/HyJanitor"), "&7."));
        } else if(Settings.previousVersion !== Settings.version) {
            ChatLib.chat("&b&lHYJANITOR  &8&m  &7  Successfully updated. &3v"+Settings.previousVersion+"➜&bv"+Settings.version);
        }
    }, 2500);
    trigger.unregister();
});