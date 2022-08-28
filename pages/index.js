// TODO: doc here

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

        // general
        "random-anime": false,
        "fakesite-ignore": false,
    },

    // saved episodes
    saved: [],
};

(async () => {
    // load storage
    const settings = await browser.storage.sync.get("settings");

    for (const o of Object.keys(conf.settings)) {
        if (Object.keys(settings).length != 0) {
            conf.settings[o] = settings.settings[o];
        }
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
