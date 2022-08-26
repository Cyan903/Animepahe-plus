// blur.js
//   blur-cover
//
//  Blurs the episode snapshots to prevent spoilers such as
//  seeing a character after they "died"
//

function blur() {
    const css = `
        <style>
            .episode-snapshot img {
                filter: blur(10px);
            }
        </style>
    `;

    document.head.insertAdjacentHTML("beforeend", css);
}

pahe["blur-cover"] = blur;
