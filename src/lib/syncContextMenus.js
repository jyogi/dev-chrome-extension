const CHOOSE_FED = 'choose_fed_version';
const LOCATION = 'location_clean';
const LOCAL = '127.0.0.1:8000';
const TIAOSHI = 'tiaoshi';
const TIAOSHI1 = 'tiaoshi1';

/**
 * 同步数据和菜单
 */
const syncContextMenus = (versionsMap) => {
  chrome.contextMenus.removeAll(() => {
    const currentFed = localStorage.fed;
    if (currentFed === LOCAL) {
      chrome.browserAction.setBadgeText({
        text: 'dev',
      });
    } else {
      chrome.browserAction.setBadgeText({
        text: '',
      });
    }

    chrome.contextMenus.create({
      id: CHOOSE_FED,
      title: '选择前端版本',
      contexts: ['browser_action'],
    });

    chrome.contextMenus.create({
      id: TIAOSHI,
      title: '进入调试模式',
      contexts: ['browser_action'],
    });

    chrome.contextMenus.create({
      id: TIAOSHI1,
      title: '取消调试模式',
      contexts: ['browser_action'],
    });

    chrome.contextMenus.create({
      id: LOCATION,
      title: '版本清理',
      contexts: ['browser_action'],
    });

    chrome.contextMenus.create({
      type: 'radio',
      id: 'none',
      title: 'default',
      contexts: ['browser_action'],
      parentId: CHOOSE_FED,
      checked: !currentFed,
    });

    chrome.contextMenus.create({
      type: 'radio',
      id: 'dev',
      title: LOCAL,
      contexts: ['browser_action'],
      parentId: CHOOSE_FED,
      checked: currentFed === LOCAL,
      onclick(...args){
        console.log(...args);
      }
    });

    Object.keys(versionsMap).forEach((id) => {
      chrome.contextMenus.create({
        type: 'radio',
        id,
        title: versionsMap[id].URL,
        contexts: ['browser_action'],
        parentId: CHOOSE_FED,
        checked: currentFed === versionsMap[id].URL,
      });
      if (currentFed === versionsMap[id].URL) {
        chrome.browserAction.setBadgeText({
          text: versionsMap[id].BUILD_ID,
        });
      }
    });
  });
};

export default syncContextMenus;
