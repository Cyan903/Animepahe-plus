// number.js
//   season-number
//
//  Set the episode number based on season, not series. Example:
//  AOT EP 26 -> AOT Season 2, EP 1
//

function seriesID() {
    try {
        return location.href.split("/play/")[1].split("/")[0];
    } catch (e) {
        console.warn("[pahe-plus]", e);
        return false;
    }
}

async function getEpisode(id) {
    const req = await fetch(
        `${endpoints.api}?m=release&id=${id}&sort=episode_asc&page=1`
    )
        .then((j) => j.json())
        .catch((e) => {
            console.warn(`[pahe-plus] could not fetch ${endpoints.api}!`, e);
        });

    if (!req || !req.data) return false;

    return req.data[0].episode;
}

function thisEpisode() {
    try {
        return parseInt(
            document
                .getElementById("episodeMenu")
                .innerText.replace("Episode ", "")
        );
    } catch (e) {
        console.warn("[pahe-plus]", e);
        return false;
    }
}

function addTitle(real) {
    const title = document.querySelector(".theatre-info > h1:nth-child(2)");

    if (!title) return;

    title.insertAdjacentText("beforeend", ` (${real})`);

    return true;
}

async function realNumber() {
    const id = seriesID();

    if (!id) {
        console.warn("[pahe-plus] could not get series id!");
        return;
    }

    const ep = await getEpisode(id);
    const eep = thisEpisode();

    if (!ep || typeof eep == "boolean") {
        console.warn("[pahe-plus] could not get first episode!");
        return;
    }

    if (ep == 1) return;

    if (!addTitle(eep - ep + 1)) {
        console.warn("[pahe-plus] failed to add episode!");
    }
}

pahe["season-number"] = realNumber;
