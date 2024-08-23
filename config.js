/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />

const File = Java.type("java.io.File");

const settingsLocation = "./config/ChatTriggers/modules/HyJanitor/settings/settings.json";
const rulesetsLocation = "./config/ChatTriggers/modules/HyJanitor/settings/rulesets.json";

class Settings {
    #settings = {
        version: "",
        block: true,
        client: false,
        debug: false,
        stats: {
            messagesReceived: 0,
            messagesBlocked: 0
        },
        muted: [],
        autoMute: false,
        muteDuration: 10800000,
        muteEnter: true,
        muteLeave: false,
        chatIcon: true,
        tutorials: {
            mainPreset: true,
            ruleset: true,
            rule: true,
            mute: true
        }
    };

    #rulesets = []
    #defaultRulesets = this.#rulesets;

    #rulesetVersion = 1;

    #lastSettingsSave = 0;
    #previousVersion = "";

    get metadata() {
        return JSON.parse(FileLib.read("./config/ChatTriggers/modules/HyJanitor/metadata.json"));
    }
    get version() {
        return this.metadata.version
    }
    get previousVersion() {
        return this.#previousVersion;
    }

    get rulesets() {
        return this.#rulesets;
    }
    /**
     * @param {JSON} newRulesets
     */
    set rulesets(newRulesets) {
        this.#rulesets = newRulesets;
        this.saveRulesets();
    }

    get latestVersion() {
        return this.#settings.version;
    }

    set latestVersion(newVersion) {
        this.#settings.version = newVersion;
        this.saveSettings(false);
    }

    get rulesetVersion() {
        return this.#rulesetVersion;
    }

    get isBlocking() {
        return this.#settings.block;
    }

    set isBlocking(newStatus) {
        this.#settings.block = newStatus;
        this.saveSettings(true);
    }

    get isCheckingClient() {
        return this.#settings.client;
    }

    set isCheckingClient(newStatus) {
        this.#settings.client = newStatus;
        this.saveSettings(true);
    }
    
    get isDebugging() {
        return this.#settings.debug;
    }

    set isDebugging(newStatus) {
        this.#settings.debug = newStatus;
        this.saveSettings(true);
    }

    get receivedMessages() {
        return this.#settings.stats.messagesReceived;
    }

    set receivedMessages(newCount) {
        this.#settings.stats.messagesReceived = newCount;
        this.saveSettings();
    }

    get blockedMessages() {
        return this.#settings.stats.messagesBlocked;
    }

    set blockedMessages(newCount) {
        this.#settings.stats.messagesBlocked = newCount;
        this.saveSettings();
    }

    get mutedPlayers() {
        return this.#settings.muted;
    }

    set mutedPlayers(newPlayers) {
        this.#settings.muted = newPlayers;
        this.saveSettings(true);
    }

    get isAutomaticallyMuting() {
        return this.#settings.autoMute;
    }

    set isAutomaticallyMuting(newStatus) {
        this.#settings.autoMute = newStatus;
        this.saveSettings(true);
    }

    get automaticMuteDuration() {
        return this.#settings.muteDuration;
    }

    set automaticMuteDuration(newDuration) {
        this.#settings.muteDuration = newDuration;
        this.saveSettings(true);
    }

    get muteToastEnter() {
        return this.#settings.muteEnter;
    }

    set muteToastEnter(newStatus) {
        this.#settings.muteEnter = newStatus;
        this.saveSettings(true);
    }
    
    get muteToastLeave() {
        return this.#settings.muteLeave;
    }

    set muteToastLeave(newStatus) {
        this.#settings.muteLeave = newStatus;
        this.saveSettings(true);
    }

    get showChatIcon() {
        return this.#settings.chatIcon;
    }

    set showChatIcon(newStatus) {
        this.#settings.chatIcon = newStatus;
        this.saveSettings(true);
    }

    get mainPresetTutorial() {
        return this.#settings.tutorials.mainPreset;
    }

    set mainPresetTutorial(newStatus) {
        this.#settings.tutorials.mainPreset = newStatus;
        this.saveSettings(true);
    }

    get rulesetTutorial() {
        return this.#settings.tutorials.ruleset;
    }

    set rulesetTutorial(newStatus) {
        this.#settings.tutorials.ruleset = newStatus;
        this.saveSettings(true);
    }

    get ruleTutorial() {
        return this.#settings.tutorials.rule;
    }

    set ruleTutorial(newStatus) {
        this.#settings.tutorials.rule = newStatus;
        this.saveSettings(true);
    }
    
    get muteTutorial() {
        return this.#settings.tutorials.mute;
    }

    set muteTutorial(newStatus) {
        this.#settings.tutorials.mute = newStatus;
        this.saveSettings(true);
    }

    sessionBlocked = 0;
    
    saveSettings(instant = false) {
        if(instant || Date.now() - this.#lastSettingsSave > 60000) {
            FileLib.write(settingsLocation, JSON.stringify(this.#settings));
            this.#lastSettingsSave = Date.now();    
        }
    }

    saveRulesets() {
        FileLib.write(rulesetsLocation, JSON.stringify(this.#rulesets));
    }

    resetRulesets() {
        this.#rulesets = this.#defaultRulesets;
    }

    resetTutorials() {
        for(let tutorial in this.#settings.tutorials) {
            this.#settings.tutorials[tutorial] = true;
        }
        this.saveSettings(true);
    }

    constructor() {
        if(!FileLib.exists(settingsLocation)) {
            FileLib.write(settingsLocation, JSON.stringify(this.#settings), true);
        }
        if(!FileLib.exists(rulesetsLocation)) {
            FileLib.write(rulesetsLocation, JSON.stringify(this.#rulesets), true);
        }
        this.#settings = JSON.parse(FileLib.read(settingsLocation));
        this.#rulesets = JSON.parse(FileLib.read(rulesetsLocation));

        this.#previousVersion = this.latestVersion;
        this.latestVersion = this.version;

        if(this.previousVersion !== this.version) {
            // update settings
        }
    }
}

export default new Settings();