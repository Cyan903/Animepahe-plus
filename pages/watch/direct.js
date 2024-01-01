// direct.js
//   direct-links
//
//  Skip pahe.win redirect when downloading
//  episodes.
//

function getURLS(str, lower = false) {
    const regexp =
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()'@:%_\+.~#?!&//=]*)/gi;
    const bracketsRegexp = /[()]/g;
    const urls = str.match(regexp);

    // https://github.com/huckbit/extract-urls
    if (urls) {
        return lower
            ? urls.map((item) => item.toLowerCase().replace(bracketsRegexp, ""))
            : urls.map((item) => item.replace(bracketsRegexp, ""));
    }

    return [];
}

async function getDirectDonwload(e) {
    e.preventDefault();

    // Get URL
    const dl = e.target.href;

    if (!dl) {
        console.warn("[pahe-plus] could not find url.");
        return;
    }

    const req = await fetch(dl)
        .then((t) => t.text())
        .catch(() => {
            console.warn(`[pahe-plus] could not fetch ${dl}!`);
        });

    if (!req) return;

    // Find location
    try {
        const urls = getURLS(req, true);
        const dl = urls.filter((n) => n.includes("kwik.cx/"));

        if (dl.length > 0 && dl[0]) {
            window.open(dl[0], "_blank");
            return;
        }

        throw new Error("Video not found.");
    } catch (e) {
        console.warn("[pahe-plus] error parsing direct download.");
        console.error(e);
    }
}

function insertDownloads() {
    const options = document.querySelectorAll("#pickDownload a");

    if (!options || !options.length) {
        return false;
    }

    options.forEach((elm) => {
        elm.insertAdjacentHTML(
            "beforeend",
            `<span class="direct-link-item"> (Direct) </span>`,
        );

        elm.onclick = getDirectDonwload;
        elm.target = "";
    });

    return true;
}

function direct() {
    if (!insertDownloads()) {
        console.warn("[pahe-plus] could not get insert direct download links!");
    }
}

pahe["direct-links"] = direct;
