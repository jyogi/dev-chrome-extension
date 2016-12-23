import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import Options from './component/Options';
import configStore from './store/configure';

configStore({
  email: 'test@cc.cc',
  password: '123456'
}).then(store => {
  const element = document.getElementById('optionsRoot');
  render(<Provider store={ store }>
    <Options />
  </Provider>, element);
});
