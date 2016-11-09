import { parse } from 'url';
import wilddog from 'wilddog';
import moment from 'moment';
import ga from './ga';
import Raven from 'raven-js';
import { syncURL, sentryURL, locale } from '../config';

// 常量部分

const details = chrome.app.getDetails();
const filter = {
  urls: [
    "*://cloud.oneapm.com/*",
    "*://*.cloudinsight.cc/*"
  ]
};
const spec = ['requestHeaders', "blocking"];
const CHOOSE_FED = 'choose_fed_version';
const LOCATION = 'location_clean';
const LOCAL = '127.0.0.1:8000';
const TIAOSHI = 'tiaoshi';
const TIAOSHI1 = 'tiaoshi1';

// 初始化各个组件

wilddog.initializeApp({
  syncURL
});

Raven.config(sentryURL, {
  release: details.version,
  environment: chrome.app.getIsInstalled() ? 'Production' : 'Development'
}).install();

moment.locale(locale);

// 发送一个 hit

ga();

// 连接到 Wilddog

const ref = wilddog.sync().ref('/versions');

let versionsMap = {};

/**
 * 同步数据和菜单
 */
const syncContextMenus = () => {
  ga({
    t: 'event',
    ec: 'contextMenu',
    ea: 'sync'
  });

  chrome.contextMenus.removeAll(()=> {
    const currentFed = localStorage['fed'];
    if (currentFed === LOCAL) {
      chrome.browserAction.setBadgeText({
        text: 'dev'
      })
    } else {
      chrome.browserAction.setBadgeText({
        text: ''
      })
    }

    chrome.contextMenus.create({
      id: CHOOSE_FED,
      title: '选择前端版本',
      contexts: ['browser_action']
    });

    chrome.contextMenus.create({
      id: TIAOSHI,
      title:'进入调试模式',
      contexts: ['browser_action']
    });

    chrome.contextMenus.create({
      id: TIAOSHI1,
      title:'取消调试模式',
      contexts: ['browser_action']
    });

    chrome.contextMenus.create({
      id: LOCATION,
      title: '版本清理',
      contexts: ['browser_action']
    });

    chrome.contextMenus.create({
      type: 'radio',
      id: 'none',
      title: 'default',
      contexts: ['browser_action'],
      parentId: CHOOSE_FED,
      checked: !currentFed
    });

    chrome.contextMenus.create({
      type: 'radio',
      id: 'dev',
      title: LOCAL,
      contexts: ['browser_action'],
      parentId: CHOOSE_FED,
      checked: currentFed === LOCAL
    });

    Object.keys(versionsMap).forEach(id => {
      chrome.contextMenus.create({
        type: 'radio',
        id,
        title: versionsMap[id].URL,
        contexts: ['browser_action'],
        parentId: CHOOSE_FED,
        checked: currentFed === versionsMap[id].URL
      });
      if (currentFed === versionsMap[id].URL) {
        chrome.browserAction.setBadgeText({
          text: versionsMap[id].BUILD_ID
        })
      }
    });
  })
};

// 更新数据

ref.on('value', (snapshot) => {
  ga({
    t: 'event',
    ec: 'wilddog',
    ea: 'value'
  });
  versionsMap = snapshot.val();
  syncContextMenus();
});

// 检测到新的版本发布

ref.on('child_added', (snapshot) => {
  const newNode = snapshot.val();
  // 如果是 1 小时之内的新版本就显示一个提示
  if (Date.now() - newNode.BUILD_TIME < 3600000) {

    const title = `新版本 #${newNode.BUILD_ID}`;

    ga({
      t: 'event',
      ec: 'notifications',
      ea: 'create',
      el: title
    });

    chrome.notifications.create({
      type: 'basic',
      title,
      message: newNode.GIT_BRANCH,
      contextMessage: moment(newNode.BUILD_TIME).fromNow(),
      iconUrl: 'notification.png'
    })
  }
});

// 拦截满足 filter 条件的的 Web 请求

chrome.webRequest.onBeforeSendHeaders.addListener(detail => {
  const fed = localStorage['fed'];
  if (fed && fed.length) {
    ga({
      t: 'event',
      ec: 'setRequestHeader',
      ea: 'fed',
      el: fed
    });

    detail.requestHeaders.push({
      name: 'fed',
      value: fed
    });
  }
  return {
    requestHeaders: detail.requestHeaders
  }
}, filter, spec);

// 监听点击事件

chrome.contextMenus.onClicked.addListener((info, tabs) => {
  const target = versionsMap[info.menuItemId];
  console.info(target);
  ga({
    t: 'event',
    ec: 'contextMenu',
    ea: 'click',
    el: (target && target.URL ) || info.menuItemId
  });
  if (info.menuItemId == TIAOSHI) {
    chrome.tabs.executeScript(null, {code:"document.body.setAttribute('debuging','true');"});
    return false;
  }

  if (info.menuItemId == TIAOSHI1) {
    chrome.tabs.reload(tabs.id);
  }
  switch (info.menuItemId) {
    case 'none':
      delete localStorage.fed;
      delete localStorage.description;
      break;
    case 'dev':
      localStorage.fed = LOCAL;
      delete localStorage.description;
      break;
    case LOCATION:
      chrome.windows.create({url:'https://cloudinsight.github.io/dev-version-management/'});
      break;
    default:
      if (target) {
        localStorage.fed = target.URL;
        localStorage.description = JSON.stringify(target);
      } else {
        console.info('%s has no target', info.menuItemId);
        return;
      }
  }
  syncContextMenus();
  if (parse(tabs.url).hostname === 'cloud.oneapm.com') {
    chrome.tabs.reload(tabs.id);
  }
});

// 接受 contentScript 的查询

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
  if (request === "get_info") {
    sendResponse({
      fed: localStorage['fed'],
      versionsMap
    })
  }
});

