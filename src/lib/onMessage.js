const onMessage = (request, sender, sendResponse) => {
  console.log(sender.tab ? `from a content script:${sender.tab.url}` : 'from the extension');
  if (request === 'get_info') {
    sendResponse({
      fed: localStorage.fed
    });
  }
};

export default onMessage;
