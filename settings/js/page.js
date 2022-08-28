const page = document.querySelectorAll(".page");
const buttons = document.querySelectorAll(".page-button");

buttons.forEach((elm) => {
    elm.addEventListener("click", function () {
        for (const p of page) p.style.display = "none";
        for (const b of buttons) b.classList.remove("page-active");

        this.classList.add("page-active");
        document.querySelector(`.${this.id}`).style.display = "block";
    });
});
