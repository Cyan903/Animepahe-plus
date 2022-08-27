// TODO: doc here

const pahe = {};
const endpoints = {
    info: "https://graphql.anilist.co",
    api: `https://${location.hostname}/api`,
};

const conf = {
    "anilist-score": false,
    "blur-cover": false,
    "show-upcoming": false,

    "episode-bookmark": false,
    "season-number": false,
    "highest-resolution": false,

    "random-anime": false,
    "fakesite-ignore": false,
};

(async () => {
    // load storage
    for (const o of Object.keys(conf)) {
        conf[o] = !!(await browser.storage.sync.get(o))[o];
    }

    // execute functions
    for (const func of Object.keys(pahe)) {
        try {
            if (conf[func]) await pahe[func]();
        } catch (e) {
            console.warn(`[pahe-plus] internal error ${e}`);
        }
    }
})();
