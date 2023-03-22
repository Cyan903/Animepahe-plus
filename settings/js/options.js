const conf = document.querySelectorAll(".conf");
const config = {
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

conf.forEach((elm) => {
    elm.addEventListener("change", async function () {
        config.settings[this.name] = !config.settings[this.name];

        chrome.storage.sync.set(config);
        chrome.tabs.reload({ bypassCache: true });

        respond();
    });
});

async function respond() {
    const db = await chrome.storage.sync.get(["settings"]);
    const save = await chrome.storage.sync.get(["saved"]);

    // load settings
    for (const o of Object.keys(config.settings)) {
        const stored = JSON.parse(JSON.stringify(db))?.settings;

        // assign to config
        config.settings[o] = Object.keys(db).length == 0 ? false : !!stored[o];
        document.querySelector(`input[name="${o}"]`).checked =
            config.settings[o];
    }

    // load save
    if (Object.keys(save).length != 0) {
        config.saved = save.saved.slice();
    }

    initSave();

    document.getElementById("debug-console").innerHTML = JSON.stringify(
        config,
        null,
        4
    );
}

document.addEventListener("DOMContentLoaded", respond);
