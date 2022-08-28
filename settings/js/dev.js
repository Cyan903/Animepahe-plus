const clear = document.getElementById("clear");
const cookieMonster = document.getElementById("cookieMonster");
const syncStorage = document.getElementById("viewStorage");

function clearStorage() {
    if (confirm("Are you sure?")) {
        browser.storage.sync.clear();
        browser.tabs.reload({ bypassCache: true });
        location.reload();
    }
}

// prettier-ignore
function takeABite() {
    browser.tabs.executeScript({ code: `
        (() => {
            alert("Removing all data...");
            localStorage.clear();
            sessionStorage.clear();
            location.reload();
        })();
    `});
}

function viewStorage() {
    const dc = document.getElementById("debug-console");

    dc.style.visibility =
        dc.style.visibility == "visible" ? "hidden" : "visible";
    this.innerText =
        dc.style.visibility == "visible"
            ? "Hide sync storage"
            : "View sync storage";
}

clear.addEventListener("click", clearStorage);
cookieMonster.addEventListener("click", takeABite);
syncStorage.addEventListener("click", viewStorage);
