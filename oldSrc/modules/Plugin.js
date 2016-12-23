import wilddog from 'wilddog';
import onChildAdded from '../lib/onChildAdded';
import onMessage from '../lib/onMessage';
import onBeforeSendHeaders from '../lib/onBeforeSendHeaders';

class Plugin {

  constructor({ syncURL, filterURLs }) {
    this.versions = {};
    wilddog.initializeApp({
      syncURL,
    });
    const ref = wilddog.sync().ref('/versions');
    ref.on('child_added', onChildAdded);

    // 接受 contentScript 的查询
    chrome.runtime.onMessage.addListener(onMessage);
    // 拦截满足 filter 条件的的 Web 请求
    chrome.webRequest.onBeforeSendHeaders.addListener(
      onBeforeSendHeaders,
      {
        urls: filterURLs
      },
      ['requestHeaders', 'blocking']
    );
  }

  onUpdate(versions) {
    this.versions = versions;
    this.render();
  }

  render() {
    this.version.forEach((version) => {
      console.log(version);
    });
  }

}

export default Plugin;
