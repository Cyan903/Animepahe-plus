const clear = document.getElementById("clear");

function clearStorage() {
    if (confirm("Are you sure?")) {
        browser.storage.sync.clear();
        browser.tabs.reload({ bypassCache: true });
        location.reload();
    }
}

clear.addEventListener("click", clearStorage);
