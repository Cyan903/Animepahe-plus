// browser.js
//   Manages storage and other related
//   browser functions
//

let tabCheck = true;

window.onfocus = () => (tabCheck = true);
window.onblur = () => (tabCheck = false);

// ensure sync.saved is stored throughout tabs
chrome.storage.sync.onChanged.addListener(() => {
    if (document.hidden || !tabCheck) {
        location.reload();
    }
});
