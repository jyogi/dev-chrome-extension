const onBeforeSendHeaders = (detail) => {
  const fed = localStorage.fed;
  if (fed && fed.length) {
    detail.requestHeaders.push({
      name: 'fed',
      value: fed,
    });
  }
  return {
    requestHeaders: detail.requestHeaders,
  };
};

export default onBeforeSendHeaders;
