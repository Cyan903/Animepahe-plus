const saveList = document.querySelector(".saved-items");

const clean = (s) => {
    return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/"/g, "&quot;");
};

const shorten = (s) => {
    return s.length > 30 ? s.slice(0, 30) + "..." : s;
};

async function removeSaved() {
    config.saved = config.saved.filter(
        (i) => i.name != this.parentElement.children[0].title
    );

    await chrome.storage.sync.set({
        saved: config.saved.slice(),
    });

    saveList.innerHTML = null;
    chrome.tabs.reload({ bypassCache: true });
    respond();
}

async function purgeSaved() {
    if (confirm("Are you sure?")) {
        config.saved = [];

        await chrome.storage.sync.set({
            saved: [],
        });

        saveList.innerHTML = null;
        chrome.tabs.reload({ bypassCache: true });
        respond();
    }
}

function initSave() {
    if (config.saved.length == 0) {
        saveList.innerHTML = "<h4>Nothing saved yet...</h4>";
        document.getElementById("purgeSaved").addEventListener("click", () => {
            alert("Nothing to purge!");
        });

        return;
    }

    saveList.innerHTML = null;

    for (const obj of config.saved) {
        saveList.insertAdjacentHTML(
            "afterbegin",
            `
            <li>
                <a href="${obj.url}" title="${clean(obj.name)}">${shorten(
                clean(obj.name)
            )}</a>
                <button class="saved-remove">X</button>
            </li>
        `
        );
    }

    document.querySelectorAll(".saved-remove").forEach((elm) => {
        elm.addEventListener("click", removeSaved);
    });

    document.getElementById("purgeSaved").addEventListener("click", purgeSaved);
}
