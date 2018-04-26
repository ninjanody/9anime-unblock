const version = "0.0.1";

chrome.browserAction.disable();

var patch = null;

function updatePatch() {
    console.log('updating');
    fetch('https://cdn.rawgit.com/hq-af/9anime-unblock/master/patch.json?t='+(new Date().getTime()))
    .then(data => data.json())
    .then(json => patch = json);
}

updatePatch();

setTimeout(updatePatch, 300000);

chrome.webRequest.onBeforeRequest.addListener(function(details) {
    if (/^.+:\/\/.+.9anime.is\/assets\/min\/frontend\/all.js.*$/.test(details.url) ) {
        console.log(patch);
        chrome.browserAction.enable(details.tabId);
        if (patch === null) {
            chrome.tabs.executeScript({
                code: 'alert("9anime Unblock : Error, please reload")'
            })
            return { cancel: true }
        }
        else if (patch.version !== version) {
            chrome.tabs.executeScript({
                code: 'alert("9anime Unblock : New version available")'
            })
        } else
            return { redirectUrl: patch.payload }
    }
}, {urls: ['*://*.9anime.is/*']}, ["blocking"]);