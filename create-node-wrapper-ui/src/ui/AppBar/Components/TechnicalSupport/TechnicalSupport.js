import React, { useState } from 'react';
// import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';

import bindClassnames from 'classnames/bind';
import TechnicalSupportModal from './Components/TechnicalSupportModal';

import styles from './TechnicalSupport.module.css';

const classnames = bindClassnames.bind(styles);

export default function TechnicalSupport() {
  const [technicalSupportModalToggle, setTechnicalSupportModalToggle] = useState(false);

  return (
    <div className={classnames('root')}>
      <Button
        onClick={() => setTechnicalSupportModalToggle(true)}
        tour-ref='technicalSupport'
        className={classnames('supportBtn')}
      >
        Support
      </Button>
      <TechnicalSupportModal
        open={technicalSupportModalToggle}
        closeModal={() => setTechnicalSupportModalToggle(false)}
      />
    </div>
  );
}
