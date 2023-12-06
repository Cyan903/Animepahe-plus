// random.js
//   random-anime
//
//  Adds a button to the navbar that picks a random
//  anime.
//

async function getAnimeList() {
    const req = await fetch(`https://${location.hostname}/anime`)
        .then((t) => t.text())
        .catch(() => {
            console.warn("[pahe-plus] could not fetch anime list!");
        });

    if (!req) return;
    const parser = new DOMParser(req);

    return [
        ...parser
            .parseFromString(req, "text/html")
            .querySelectorAll(".tab-content a"),
    ].map((a) => a.href);
}

async function getRandomAnime() {
    const list = await getAnimeList();

    if (!list) {
        console.warn("[pahe-plus] could not get anime list!");
        return;
    }

    return list[~~(Math.random() * list.length)];
}

function randButton() {
    const navbar = document.querySelector(".navbar-nav");

    if (!navbar) return;

    // prettier-ignore
    navbar.insertAdjacentHTML("beforeend", `
        <li class="nav-item">
            <a class="nav-link" title="random" id="rand-btn">random</a>
        </li>
    `);

    return true;
}

function random() {
    if (!randButton()) {
        console.warn("[pahe-plus] could not create random button!");
        return;
    }

    document.querySelector(".nav-link[title=random]").onclick =
        async function () {
            this.innerHTML = `
                <div class="spinner">
                    <div class="rect1"></div>
                    <div class="rect2"></div>
                    <div class="rect3"></div>
                    <div class="rect4"></div>
                </div>
            `;

            const url = await getRandomAnime();

            if (!url) {
                console.warn("[pahe-plus] could not get random anime!");
                this.innerHTML = "random";

                return;
            }

            location.href = url;
        };
}

pahe["random-anime"] = random;
