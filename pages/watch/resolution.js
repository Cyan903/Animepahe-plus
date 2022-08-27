// resolution.js
//   highest-resolution
//
//  Automatically select the highest resolution. Will prefer sub over dub unless
//  prefer-dub is enabled.
//

function getHighestSub() {
    const options = document.querySelectorAll("#resolutionMenu button");
    let high = -1;
    let helm = null;

    if (!options) return;

    for (const source of options) {
        if (source.dataset.audio != "jpn") continue;
        if (parseInt(source.dataset.resolution) > high) {
            high = source.dataset.resolution;
            helm = source;
        }
    }

    return helm;
}

function highest() {
    const high = getHighestSub();

    if (!high) {
        console.warn("[pahe-plus] could not get highest sub!");
        return;
    }

    high.click();
}

pahe["highest-resolution"] = highest;
