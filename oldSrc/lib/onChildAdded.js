import moment from 'moment';
import { locale } from '../../src/config/index';

moment.locale(locale);

/**
 * 如果有新的节点显示一条消息
 *
 * @param snapshot
 */
const onChildAdded = (snapshot) => {
  const newNode = snapshot.val();
  // 如果是 1 小时之内的新版本就显示一个提示
  if (Date.now() - newNode.BUILD_TIME < 3600000) {
    chrome.notifications.create({
      type: 'basic',
      title: `新版本 #${newNode.BUILD_ID}`,
      message: newNode.GIT_BRANCH,
      contextMessage: moment(newNode.BUILD_TIME).fromNow(),
      iconUrl: 'notification.png',
    });
  }
};

export default onChildAdded;
