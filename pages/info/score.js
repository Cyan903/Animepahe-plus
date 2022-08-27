// score.js
//   anilist-score
//
//  Display average score/rating. Uses the
//  public anilist API.
//

function anilistID() {
    const id = document.querySelector(".external-links > a:nth-child(2)");

    if (!id) return false;
    if (!id.href.includes("anilist.co")) return false;

    return id.href.split("anilist.co/anime/")[1];
}

async function getAnilistScore(id) {
    const query = `
        {
            Media(id: ${id}) {
                averageScore
                popularity
            }
        }
    `;

    const req = await fetch(endpoints.info, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },

        body: JSON.stringify({ query }),
    })
        .then((res) => res.json())
        .catch((e) => {
            console.warn(`[pahe-plus] could not fetch ${endpoints.info}!`, e);
        });

    if (!req || req.errors) {
        return false;
    }

    return req?.data?.Media;
}

function userScores({ averageScore, popularity }) {
    const title = document.querySelector(".title-wrapper");

    title.insertAdjacentHTML(
        "beforeend",
        `
        <h2 id="anilist-userscores">${averageScore}% | ${popularity
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} users</h2>
    `
    );
}

async function score() {
    const aniID = anilistID();

    if (!aniID) {
        console.warn("[pahe-plus] could not grab anilist id!");
        return;
    }

    const scores = await getAnilistScore(aniID);

    if (
        !scores ||
        !Number.isInteger(scores.averageScore) ||
        !Number.isInteger(scores.popularity)
    ) {
        console.warn("[pahe-plus] error fetching scores!");

        return;
    }

    userScores(scores);
}

pahe["anilist-score"] = score;
