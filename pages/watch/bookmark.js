// bookmark.js
//   episode-bookmark
//
//  Custom bookmarks for episodes. Bookmarks are permanent and will always
//  bring you back to the epsiode you saved.
//

function getIDs() {
    try {
        const urls = location.href.split("/play/")[1].split("/");
        return {
            series: urls[0],
            episode: urls[1],
        };
    } catch (e) {
        console.warn("[pahe-plus]", e);
        return false;
    }
}

function buildBookmark(id, episode, page) {
    return btoa(
        JSON.stringify({
            id,
            episode,
            page,
        })
    );
}

async function getStaticIDs({ series, episode }) {
    let page = 1;

    do {
        const req = await fetch(
            `${endpoints.api}?m=release&id=${series}&sort=episode_asc&page=${page}`
        )
            .then((j) => j.json())
            .catch((e) => {
                console.warn(
                    `[pahe-plus] could not fetch ${endpoints.api}!`,
                    e
                );
            });

        if (!req || page > req.last_page || !req.data) {
            return false;
        }

        // find episode
        const session = req.data.map((d) => d.session);

        if (session.includes(episode)) {
            return { ...req.data[session.indexOf(episode)], page };
        }
    } while (page++);
}

async function promptBookmark(ids) {
    const static = await getStaticIDs(ids);

    if (!static) {
        console.warn("[pahe-plus] failed to get static ids!");
        return;
    }

    const bookmarkHref = document.getElementById("bookmark-href");

    bookmarkHref.innerHTML = document.title.replace(" :: animepahe", "");
    bookmarkHref.href = `/b/${buildBookmark(
        static.anime_id,
        static.episode,
        static.page
    )}`;

    return true;
}

function insertBookmark() {
    const info = document.querySelector(".theatre-info");
    const ids = getIDs();

    if (!info || !ids) return;

    // prettier-ignore
    info.insertAdjacentHTML("beforeend", `
        <div class="player-button pmax">
            <button class="player-button-inner" id="ppahe-bookmark" style="mask: url(${chrome.runtime.getURL("img/bookmark.svg")}) no-repeat center;"></button>
            <div id="player-bookmark-popout" style="display: none;">
                <a id="bookmark-href"></a>
                <div id="bookmark-how">Loading...</div>
            </div>
        </div>
    `);

    document.getElementById("ppahe-bookmark").onclick = async function () {
        const popout = document.getElementById("player-bookmark-popout");

        this.style.opacity = "0.5";
        this.disabled = true;

        popout.style.display =
            popout.style.display == "none" ? "block" : "none";
        document.getElementById("bookmark-how").innerHTML = "Loading...";
        document.getElementById("bookmark-href").innerHTML = `
            <div class="spinner">
                <div class="rect1"></div>
                <div class="rect2"></div>
                <div class="rect3"></div>
                <div class="rect4"></div>
            </div>
        `;

        await promptBookmark(ids);

        document.getElementById("bookmark-how").innerHTML =
            "Drag to bookmark toolbar";
        this.style.opacity = "1";
        this.disabled = false;
    };

    return true;
}

function bookmark() {
    const ids = getIDs();

    if (!ids) {
        console.warn("[pahe-plus] could not get anime id!");
        return;
    }

    // don't insert if the url is invalid
    if (!insertBookmark()) {
        console.warn(
            "[pahe-plus] could not find proper elements... possible 404?"
        );
    }
}

pahe["episode-bookmark"] = bookmark;
