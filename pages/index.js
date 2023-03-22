// index.js
//   The main entry point for all scripts.
//   Loads storage and calls related functions.
//

const pahe = {};
const endpoints = {
    info: "https://graphql.anilist.co",
    api: `https://${location.hostname}/api`,
};

const conf = {
    settings: {
        // info
        "anilist-score": false,
        "blur-cover": false,
        "show-upcoming": false,

        // watch
        "episode-bookmark": false,
        "season-number": false,
        "highest-resolution": false,
        "save-episode": false,
        "toggle-lights": false,

        // general
        "random-anime": false,
        "fakesite-ignore": false,
    },

    // saved episodes
    saved: [],
};

(async () => {
    // load storage
    const settings = await chrome.storage.sync.get(["settings"]);
    for (const o of Object.keys(conf.settings)) {
        if (
            Object.keys(settings).length != 0 &&
            typeof conf.settings[o] == "boolean"
        ) {
            conf.settings[o] = settings.settings[o];
        }
    }

    // load save
    const save = await chrome.storage.sync.get(["saved"]);
    if (Object.keys(save).length != 0) {
        conf.saved = save.saved.slice();
    }

    // execute functions
    for (const func of Object.keys(pahe)) {
        try {
            if (conf.settings[func]) await pahe[func]();
        } catch (e) {
            console.warn(`[pahe-plus] internal error ${e}`);
        }
    }
})();
