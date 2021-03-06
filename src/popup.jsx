import React from 'react';
import { render } from 'react-dom';
import ga from './ga';

ga();
const element = document.createElement('div');

const APP = (props) => {
  if (!props.URL) {
    return (<div>
      {localStorage.fed ? localStorage.fed : 'default'}
    </div>);
  }

  return (<div style={{ width: '400px' }}>
    <table>
      <tbody>
        <tr>
          <th>URL</th>
          <td>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://${props.URL}/index.html`}
            >
              { props.URL }
            </a>
          </td>
        </tr>
        <tr>
          <th>Commit</th>
          <td>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`http://git.oneapm.me/cloud/fed-ci/commit/${props.GIT_COMMIT}`}
            >
              { props.GIT_COMMIT.slice(0, 8) }
            </a>
          </td>
        </tr>
        <tr>
          <th>Branch</th>
          <td>{ props.GIT_BRANCH }</td>
        </tr>
        <tr>
          <th>Jenkins Build</th>
          <td>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={props.BUILD_URL}
            >
              { props.BUILD_ID }</a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>);
};

APP.propTypes = {
  URL: React.PropTypes.string,
  GIT_COMMIT: React.PropTypes.string,
  GIT_BRANCH: React.PropTypes.string,
  BUILD_URL: React.PropTypes.string,
  BUILD_ID: React.PropTypes.string
};

document.body.appendChild(element);

let description = null;

try {
  description = JSON.parse(localStorage.description);
} catch (e) {
  console.error(e);
}

render(<APP {...description} />, element);
