console.log("Testing storage access..."); chrome.storage.local.set({test: "value"}).then(() => console.log("Storage write OK")).catch(e => console.error("Storage write failed:", e));
