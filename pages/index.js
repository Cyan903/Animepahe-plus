// TODO: doc here

const pahe = {};
const endpoints = {
    info: "https://graphql.anilist.co",
};

const conf = {
    "blur-cover": false,
    "show-upcoming": false,
};

(async () => {
    for (const o of Object.keys(conf)) {
        conf[o] = !!(await browser.storage.sync.get(o))[o];
    }

    for (const func of Object.keys(pahe)) {
        try {
            if (conf[func]) await pahe[func]();
        } catch (e) {
            console.error(e);
        }
    }
})();
