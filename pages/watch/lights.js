// lights.js
//   toggle-lights
//
//  Button to dim all elements surrounding
//  the video player.
//

const lightsCSS = `
    #lights-overlay {
        z-index: 10;
        background-color: rgba(0, 0, 0, 0.8);
        width: 100vw;
        height: 100vh;

        position: fixed;
        top: 0;
    }

    .player {
        z-index: 15 !important;
    }

    .prequel,
    .sequel {
        opacity: 0.3;
    }

    #toggle-lights {
        z-index: 20 !important;
    }
`;

function toggleLights() {
    const overlay = document.getElementById("lights-overlay");

    // prettier-ignore
    if (!overlay) {
        document.querySelector(".theatre").insertAdjacentHTML("afterbegin", `
            <div id="lights-overlay">
                <style>${lightsCSS}</style>
            </div>
        `);

        this.style.backgroundColor = "yellow";
        return;
    }

    this.style.backgroundColor = "#6d6e2b";
    overlay.remove();
}

function insertLight() {
    const info = document.querySelector(".theatre-info");
    if (!info) return;

    // prettier-ignore
    info.insertAdjacentHTML("beforeend", `
        <button 
            class="player-button" id="toggle-lights"
            style="mask: url(${browser.runtime.getURL("img/light-bulb.svg")}) no-repeat center; background-color: #6d6e2b;"
        >x</button>
    `);

    document.getElementById("toggle-lights").onclick = toggleLights;

    return true;
}

function lights() {
    if (!insertLight()) {
        console.warn("[pahe-plus] could not insert light button!");
        return;
    }
}

pahe["toggle-lights"] = lights;
