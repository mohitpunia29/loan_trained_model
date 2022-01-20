import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Dialog, Button } from '@material-ui/core';
import Edition from '../../Containers/Edition/Edition';

import styles from './Demo.module.css';

export default function Demo({ component: Component, size, ...props }) {
  const defaultProps = Component.defaultData;
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleCloseModal() {
    setIsModalOpen(false);
  }

  return (
    <div className={styles.root}>
      <Component
        {...defaultProps}
        {...props}
      />
      <footer>
        <Button
          color='primary'
          classes={{ root: styles.tryButton }}
          onClick={() => setIsModalOpen(true)}
        >
          {'Try it out >>'}
        </Button>
      </footer>
      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        maxWidth={size}
      >
        <Edition
          component={Component}
          size={size}
        />
      </Dialog>
    </div>
  );
}

Demo.propTypes = {
  component: PropTypes.func.isRequired,
  size     : PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl'])
};

Demo.defaultProps = {
  size: 'lg'
};
