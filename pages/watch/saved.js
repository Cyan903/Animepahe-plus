// saved.js
//   save-episode
//
//  Alternative to bookmarks, save episodes into
//  extension storage.
//

const isSaved = (title) => conf.saved.map((n) => n.name).includes(title);

async function saveItem(name, url) {
    conf.saved.push({
        name,
        url,
    });

    await browser.storage.sync.set({
        saved: conf.saved.slice(),
    });
}

async function deleteItem(name) {
    conf.saved = conf.saved.filter((i) => i.name != name);

    await browser.storage.sync.set({
        saved: conf.saved.slice(),
    });
}

async function savedToggle(_this, title, url) {
    if (!isSaved(title)) {
        await saveItem(title, url);
        // prettier-ignore
        _this.style = `mask: url(${browser.runtime.getURL("img/remove.svg")}) no-repeat center;`;
        _this.classList.add("save-active");
        _this.classList.remove("remove-active");

        return;
    }

    await deleteItem(title);
    _this.classList.remove("save-active");
    _this.classList.add("remove-active");

    // prettier-ignore
    _this.style = `mask: url(${browser.runtime.getURL("img/add.svg")}) no-repeat center;`;
}

function saveButton(title) {
    const info = document.querySelector(".theatre-info");
    const icon = `img/${isSaved(title) ? "remove" : "add"}.svg`;
    if (!info) return;

    // prettier-ignore
    info.insertAdjacentHTML("beforeend", `
        <button 
            class="player-button" id="save-episode"
            style="mask: url(${browser.runtime.getURL(icon)}) no-repeat center;"
        >x</button>
    `);

    document.getElementById("save-episode").onclick = async function () {
        const static = await getStaticIDs(getIDs());

        if (!static) {
            console.warn("[pahe-plus] could not get permalink!");
            return;
        }

        const mark = `https://${location.hostname}/b/${buildBookmark(
            static.anime_id,
            static.episode,
            static.page,
        )}`;

        await savedToggle(this, title, mark);
    };

    return true;
}

function saveEpisode() {
    const title = document.title.replace(" :: animepahe", "");

    if (!saveButton(title)) {
        console.warn("[pahe-plus] could not insert save button!");
    }
}

pahe["save-episode"] = saveEpisode;
