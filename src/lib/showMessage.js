import moment from 'moment';
import { locale } from '../../config';

moment.locale(locale);

const showMessage = newNode => chrome.notifications.create({
  type: 'basic',
  title: `新版本 #${newNode.BUILD_ID}`,
  message: newNode.GIT_BRANCH,
  contextMessage: moment(newNode.BUILD_TIME).fromNow(),
  iconUrl: 'notification.png',
});

export default showMessage;
