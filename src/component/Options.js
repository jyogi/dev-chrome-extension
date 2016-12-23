import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import 'bootstrap/dist/css/bootstrap.css';
import * as  Actions from '../actions';

class Options extends React.Component {
  render() {
    const {
      versions,
      settings
    } = this.props;

    return (
      <div>
        <Select
          labelKey={'URL'}
          valueKey={'URL'}
          value={ settings.currentVersion }
          options={ versions }
          onChange={ ({ URL }) => {
            this.props.setSetting({
              'currentVersion': URL
            })
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  versions: state.version,
  settings: state.settings
})

export default connect(state => state, Actions)(Options);
