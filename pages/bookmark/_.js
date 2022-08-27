// _.js
//   _
//
//  Files named _ will always be executed, there is no
//  option to disable them.
//

function replaceError() {
    const err = document.querySelector("main.text-center");

    if (!err) return false;

    err.innerHTML = `
        <h1 style="margin-top: 10%;">Loading...</h1>
        <div class="spinner">
            <div class="rect1"></div>
            <div class="rect2"></div>
            <div class="rect3"></div>
            <div class="rect4"></div>
        </div>
    `;

    return true;
}

async function getAnimeID(id) {
    const cid = await fetch(`https://${location.hostname}/a/${id}`).catch(
        (e) => {
            console.warn("[pahe-plus]", e);
        }
    );

    if (!cid || cid.status != 200 || !cid.url.includes("/anime/")) {
        location.href = "/";
        return false;
    }

    return cid.url.split("/anime/")[1];
}

async function redirect(url) {
    let id, json;

    try {
        json = JSON.parse(atob(url));
        id = await getAnimeID(json.id);
    } catch (e) {
        console.warn("[pahe-plus]", e);
        location.href = "/";

        return false;
    }

    if (!id) return false;

    const req = await fetch(
        `https://${location.hostname}/api?m=release&id=${id}&sort=episode_asc&page=${json.page}`
    )
        .then((j) => j.json())
        .catch((e) => {
            console.warn(`[pahe-plus] could not fetch API!`, e);
        });

    if (!req || !req.data) return false;

    const ep = req.data.map((d) => d.episode).indexOf(json.episode);
    const name = req.data[ep].session;

    location.href = `/play/${id}/${name}`;

    return true;
}

(() => {
    if (!replaceError()) {
        console.warn("[pahe-plus] failed to replace error!");
        return;
    }

    const u = location.href.split("/b/");

    if (!redirect(u[1])) {
        console.warn("[pahe-plus] failed to redirect!");
    }
})();
