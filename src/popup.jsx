/**
 * popup 是点击图标弹出来的页面
 */
import React from 'react';
import { render } from 'react-dom';
import ga from './ga';
import Version from './component/Version';

ga();
const element = document.createElement('div');
document.body.appendChild(element);

let description = null;

try {
  description = JSON.parse(localStorage.description);
} catch (e) {
  console.error(e);
}

render(<Version {...description} />, element);
