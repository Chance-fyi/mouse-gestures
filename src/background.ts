chrome.runtime.onMessage.addListener((message) => {
  if (actions[message.action]) {
    actions[message.action]();
  }
});

const actions = {
  reloadAllTabs: () => {
    chrome.tabs.query({}, (tabs) => {
      for (let tab of tabs) {
        chrome.tabs.reload(tab.id).then();
      }
    });
  },
  openNewTab: () => {
    chrome.tabs.create({url: 'chrome://newtab'}).then();
  },
  closeCurrentTab: () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.remove(tabs[0].id).then();
    });
  },
  closeOtherTabs: () => {
    chrome.tabs.query({currentWindow: true}, (tabs) => {
      chrome.tabs.query({active: true, currentWindow: true}, (activeTabs) => {
        const activeTabId = activeTabs[0].id;
        const tabIdsToRemove = tabs.filter(tab => tab.id !== activeTabId).map(tab => tab.id);
        chrome.tabs.remove(tabIdsToRemove).then();
      });
    });
  },
  closeAllTabs: () => {
    chrome.tabs.query({currentWindow: true}, (tabs) => {
      chrome.tabs.remove(tabs.map(tab => tab.id)).then();
    });
  },
  closeWindow: () => {
    chrome.windows.getCurrent((window) => {
      chrome.windows.remove(window.id).then();
    });
  },
  reopenLastClosedTab: () => {
    chrome.sessions.getRecentlyClosed({maxResults: 1}, (sessions) => {
      if (sessions.length && sessions[0].tab) {
        chrome.sessions.restore(sessions[0].tab.sessionId).then();
      }
    });
  },
  switchLeftTab: () => {
    switchTab(-1);
  },
  switchRightTab: () => {
    switchTab(1);
  },
  minimizeWindow: () => {
    chrome.windows.getCurrent((window) => {
      chrome.windows.update(window.id, {state: 'minimized'}).then();
    });
  }
}

const switchTab = (direction: number) => {
  chrome.tabs.query({currentWindow: true}, (tabs) => {
    chrome.tabs.query({active: true, currentWindow: true}, (activeTabs) => {
      if (activeTabs.length === 0) return;
      let activeTab = activeTabs[0];
      let newIndex = (activeTab.index + direction + tabs.length) % tabs.length;
      chrome.tabs.update(tabs[newIndex].id, {active: true}).then();
    });
  });
}