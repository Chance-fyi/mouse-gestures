export class Operation {
  scrollUp() {
    window.scrollBy(0, -window.innerHeight);
  }

  scrollDown() {
    window.scrollBy(0, window.innerHeight);
  }

  scrollLeft() {
    window.scrollBy(-window.innerWidth, 0);
  }

  scrollRight() {
    window.scrollBy(window.innerWidth, 0);
  }

  scrollToTop() {
    window.scrollTo({top: 0, behavior: 'smooth'});
  }

  scrollToBottom() {
    window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'});
  }

  backward() {
    history.back();
  }

  forward() {
    history.forward();
  }

  refresh() {
    window.location.reload();
  }

  reloadAllTabs() {
    chrome.runtime.sendMessage({action: 'reloadAllTabs'}).then();
  }

  openNewTab() {
    chrome.runtime.sendMessage({action: 'openNewTab'}).then();
  }

  openIncognitoWindow() {
    chrome.runtime.sendMessage({action: 'openIncognitoWindow'}).then();
  }

  closeCurrentTab() {
    chrome.runtime.sendMessage({action: 'closeCurrentTab'}).then();
  }

  closeOtherTabs() {
    chrome.runtime.sendMessage({action: 'closeOtherTabs'}).then();
  }

  closeAllTabs() {
    chrome.runtime.sendMessage({action: 'closeAllTabs'}).then();
  }

  closeWindow() {
    chrome.runtime.sendMessage({action: 'closeWindow'}).then();
  }

  reopenLastClosedTab() {
    chrome.runtime.sendMessage({action: 'reopenLastClosedTab'}).then();
  }

  switchLeftTab() {
    chrome.runtime.sendMessage({action: 'switchLeftTab'}).then();
  }

  switchRightTab() {
    chrome.runtime.sendMessage({action: 'switchRightTab'}).then();
  }

  fullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then();
    } else {
      document.exitFullscreen().then();
    }
  }

  minimizeWindow() {
    chrome.runtime.sendMessage({action: 'minimizeWindow'}).then();
  }
}