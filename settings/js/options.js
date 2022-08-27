const conf = document.querySelectorAll(".conf");
const config = {
    "anilist-score": false,
    "blur-cover": false,
    "show-upcoming": false,

    "episode-bookmark": false,
    "season-number": false,
    "highest-resolution": false,

    "random-anime": false,
    "fakesite-ignore": false,
};

conf.forEach((elm) => {
    elm.addEventListener("change", async function () {
        config[this.name] = !config[this.name];

        browser.storage.sync.set(config);
        browser.tabs.reload(); // TODO: this will break with options_ui
        await respond();
    });
});

async function respond() {
    for (const o of Object.keys(config)) {
        const stored = await browser.storage.sync.get(o);

        // assign to config
        config[o] = !!stored[o];
        document.querySelector(`input[name="${o}"]`).checked = config[o];
    }

    document.getElementById("debug-console").innerHTML = JSON.stringify(
        config,
        null,
        4
    );
}

document.addEventListener("DOMContentLoaded", respond);
