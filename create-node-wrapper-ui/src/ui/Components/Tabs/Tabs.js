import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  isEmpty as _isEmpty
} from 'lodash';

import {
  Tabs as MTabs,
  Tab
} from '@material-ui/core';

import styles from './Tabs.module.css';

export default function Tabs({ tabs, render }) {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  if (!render) return null;
  if (_isEmpty(tabs)) return render({});

  const onChangeHandler = (event, value) => {
    setActiveTab(value);
  };

  return (
    <div className={styles.root}>
      <header>
        <MTabs
          value={activeTab}
          onChange={onChangeHandler}
          indicatorColor='primary'
          variant='scrollable'
          scrollButtons='off'
          classes={{
            root      : styles.tabs,
            scrollable: styles.scrollable,
            indicator : styles.activeTab
          }}
        >
          {tabs.map((tabName) => (
            <Tab
              key={tabName}
              label={tabName}
              value={tabName}
              classes={{ label: styles.tab}}
            />
          ))}
        </MTabs>
      </header>
      <main className={styles.renderContainer}>
        {render({ activeTab })}
      </main>
    </div>
  );
}

Tabs.propTypes = {
  tabs  : PropTypes.arrayOf(PropTypes.string).isRequired,
  render: PropTypes.func
};

Tabs.defaultProps = {
  render: undefined
};
