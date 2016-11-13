import { parse } from 'url';
import wilddog from 'wilddog';
import Raven from 'raven-js';

import { syncURL, sentryURL, filterURLs } from '../config';
import ga from './ga';
import Plugin from './modules/Plugin';
import syncContextMenus from './lib/syncContextMenus';

// 報錯
Raven.config(sentryURL, {
  release: chrome.app.getDetails().version,
  environment: chrome.app.getIsInstalled() ? 'Production' : 'Development',
}).install();

// 初始化各个组件

const plugin = new Plugin({
  syncURL,
  filterURLs
});
console.log(plugin);

// 发送一个 hit

ga();

// 连接到 Wilddog

const ref = wilddog.sync().ref('/versions');

let versionsMap = {};

// 更新数据

ref.on('value', (snapshot) => {
  ga({
    t: 'event',
    ec: 'wilddog',
    ea: 'value',
  });
  versionsMap = snapshot.val();
  syncContextMenus(versionsMap);
});

// 监听点击事件

// chrome.contextMenus.onClicked.addListener((info, tabs) => {
//   const target = versionsMap[info.menuItemId];
//   console.info(target);
//   ga({
//     t: 'event',
//     ec: 'contextMenu',
//     ea: 'click',
//     el: (target && target.URL) || info.menuItemId,
//   });
//   if (info.menuItemId === TIAOSHI) {
//     chrome.tabs.executeScript(null, { code: "document.body.setAttribute('debuging','true');" });
//     return;
//   }
//
//   if (info.menuItemId === TIAOSHI1) {
//     chrome.tabs.reload(tabs.id);
//   }
//   switch (info.menuItemId) {
//     case 'none':
//       delete localStorage.fed;
//       delete localStorage.description;
//       break;
//     case 'dev':
//       localStorage.fed = LOCAL;
//       delete localStorage.description;
//       break;
//     case LOCATION:
//       chrome.windows.create({ url: 'https://cloudinsight.github.io/dev-version-management/' });
//       break;
//     default:
//       if (target) {
//         localStorage.fed = target.URL;
//         localStorage.description = JSON.stringify(target);
//       } else {
//         console.info('%s has no target', info.menuItemId);
//         return;
//       }
//   }
//   syncContextMenus();
//   if (parse(tabs.url).hostname === 'cloud.oneapm.com') {
//     chrome.tabs.reload(tabs.id);
//   }
// });
