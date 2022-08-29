// browser.js
//   Manages storage and other related
//   browser functions
// 

// ensure sync.saved is stored throughout tabs
browser.storage.sync.onChanged.addListener(() => {
    if (document.hidden) {
        location.reload();
    }
});
