// episode.js
//   show-upcoming
//
//  Show upcoming episodes for airing shows. Uses the
//  public anilist API.
//

function anilistID() {
    const id = document.querySelector(".external-links > a:nth-child(2)");

    if (!id) return false;
    if (!id.href.includes("anilist.co")) return false;

    return id.href.split("anilist.co/anime/")[1];
}

function sdhms(sec) {
    const seconds = parseInt(sec);

    return (
        `${Math.floor(seconds / (3600 * 24))}d ` +
        `${Math.floor((seconds % (3600 * 24)) / 3600)}h ` +
        `${Math.floor((seconds % 3600) / 60)}m`
    );
}

async function getAiringStatus(id) {
    const query = `
        {
            AiringSchedule(mediaId: ${id}, notYetAired: true) {
                airingAt,
                timeUntilAiring,
                episode
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

    return req?.data?.AiringSchedule;
}

function display(stat) {
    const info = document.querySelector(".anime-info");
    const exactDate = new Date(0);

    exactDate.setUTCSeconds(stat.airingAt);

    // prettier-ignore
    info.insertAdjacentHTML("afterbegin", `
        <p title="${exactDate}">
            <strong>Next Episode: </strong>
            ${exactDate.toISOString().split("T")[0]} | ${sdhms(stat.timeUntilAiring)}
        </p>
    `);
}

async function episode() {
    const aniID = anilistID();

    if (!aniID) {
        console.warn("[pahe-plus] could not grab anilist id!");
        return;
    }

    const status = await getAiringStatus(aniID);

    if (
        !status ||
        !Number.isInteger(status.airingAt) ||
        !Number.isInteger(status.timeUntilAiring) ||
        !Number.isInteger(status.episode)
    ) {
        console.warn(
            "[pahe-plus] error fetching airing status, anime is likely finished airing."
        );

        return;
    }

    display(status);
}

pahe["show-upcoming"] = episode;
