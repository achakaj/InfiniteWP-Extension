// content.js

function extractSiteId(element) {
  const idAttribute = element.id;
  if (idAttribute && idAttribute.startsWith('popover_')) {
    return idAttribute.replace('popover_', '');
  }
  return null;
}

function getSiteInformation() {
  const siteList = document.querySelectorAll('.sidebar-site-list .site-name-wrapper');
  const siteInformation = [];

  siteList.forEach((siteElement) => {
    const siteName = siteElement.querySelector('.site-name').innerText;
    const siteId = extractSiteId(siteElement);

    if (siteId !== null) {
      siteInformation.push({ siteName, siteId });
    }
  });

  chrome.runtime.sendMessage({ action: 'saveSiteInformation', siteInformation });
}

getSiteInformation();
