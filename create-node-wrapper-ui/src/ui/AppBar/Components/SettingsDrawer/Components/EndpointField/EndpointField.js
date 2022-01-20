import React from 'react';
import PropTypes from 'prop-types';
import { Input, Button } from '@material-ui/core';

import bindClassnames from 'classnames/bind';
import styles from './EndpointField.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

class EndpointField extends React.Component {
  onClick = () => {
    const { onChange } = this.props;

    onChange(this.inputRef.value);
  }

  render() {
    const { section, value } = this.props;

    return (
      <div className={classnames('root')}>
        <Input
          label={section + ' url'}
          autoFocus
          defaultValue={value}
          classes={{
            root: classnames('input')
          }}
          required
          type="text"
          placeholder={'Enter a domain for ' + section}
          id={section}
          inputRef={node => this.inputRef = node}
        />
        <Button
          classes={{
            root: classnames('button')
          }}
          variant="contained"
          color="primary"
          onClick={this.onClick}
        >
          Update url
        </Button>
      </div>
    );
  }
}

EndpointField.propTypes = {
  onChange: PropTypes.func.isRequired,
  section : PropTypes.string.isRequired,
  value   : PropTypes.string.isRequired
};

export default EndpointField;
