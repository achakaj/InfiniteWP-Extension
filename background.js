// background.js

chrome.browserAction.onClicked.addListener(function (tab) {

  chrome.tabs.query({ url: '*://www.coherence-communication.masiwe.fr/v3/*' }, function (tabs) {
    const matchingTabs = tabs.filter(tab => tab.url.toLowerCase().includes('https://www.coherence-communication.masiwe.fr/v3/'));

    if (matchingTabs.length > 0) {
      chrome.tabs.executeScript(matchingTabs[0].id, { file: 'content.js' });
    } else {
      console.error('not found.');
    }
  });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log('Message received:', request);

  if (request.action === 'saveSiteInformation') {
    chrome.storage.local.set({ siteInformation: request.siteInformation }, function () {

      chrome.tabs.query({ active: true, currentWindow: true }, function (activeTabs) {
        if (activeTabs && activeTabs.length > 0) {
          const activeTabUrl = new URL(activeTabs[0].url);
          const siteUrl = activeTabUrl.hostname.replace('www.', '');

          chrome.storage.local.get(['siteInformation'], function (result) {
            const siteInformation = result.siteInformation || [];
            const currentSite = siteInformation.find(site => site.siteName.toLowerCase() === siteUrl.toLowerCase());

            if (currentSite) {

              const apiUrl = `https://www.coherence-communication.masiwe.fr/v3/ajax.php?action=loadSite&siteID=${currentSite.siteId}`;

              chrome.tabs.create({ url: apiUrl }, function () {
                console.log('Done');
              });
            } else {
              console.error('Site ID not found.');
            }
          });
        } else {
          console.error('URL of the active tab not found.');
        }
      });
    });
  } else if (request.action === 'findSiteIdForCurrentTab') {
    //End
  }
});
