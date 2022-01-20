import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import bindClassnames from 'classnames/bind';

import {
  CircularProgress,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import styles from './Accordion.module.css';

/**
 * This function renders the expandable panels
 *
 * Note:
 * We have two constraints for this component:
 **** be able to open each panel on its own
 **** open/close all of them at once
 * We used to keep the state of each accordions in the parent, but opening/closing one was causing
 * all of the parent's children to re-render
 * In order to mitigate this issue, we are using two levels of state to control the state of the panel (open or close)
 *
 * 1. From the parent
 * The parent can pass a value for the expansion, when the value is changed, it will take precedence
 * and become the current state. This allows the parent to define a default value,
 * or change the state for all the panels
 *
 * 2. From the panel
 * When the state is changed only for panel, the state of the panel is updated, but the parent is not made aware of it
 * This way, only the content of the panel needs to be re-rendered
 */
export default function Accordion({
  title, loadedCondition, noLoadingIcon, thin, black,
  children, expanded: propExpanded,
  onChange: onChangeListener
}) {
  const [expanded, setExpanded] = useState(propExpanded);

  const onChange = (event, value) => {
    setExpanded(value);
    onChangeListener(value);
  };

  // that's where all the logic lies
  // if the expanded prop from the parent has change, it takes precedence and we update the internal state
  // the second condition is a small optimization, so that we don't rerender the component if the panel
  // already had the same value for expanded internally
  useEffect(() => {
    if (expanded !== propExpanded) {
      setExpanded(propExpanded);
    }
  }, [propExpanded]);

  let Head = null;
  if (title) {
    if (React.isValidElement(title)) {
      Head = <div className={styles.head}>{title}</div>;
    } else {
      Head = <Typography classes={{ root: styles.title }}>{title}</Typography>;
    }
  }

  return (
    <ExpansionPanel
      classes={{ root: `${styles.root} ${thin ? styles.thin : ''}` }}
      disabled={!loadedCondition}
      expanded={expanded}
      onChange={onChange}
    >
      <ExpansionPanelSummary
        classes={{ root: `${styles.titleContainer} ${black ? styles.blackTitleContainer : ''}` }}
        expandIcon={loadedCondition ? <ExpandMoreIcon style={{ color: black ? 'white' : 'black' }} /> : !noLoadingIcon ? <CircularProgress size={20} /> : null}
      >
        {Head}
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        {expanded ? children : ' '}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}

Accordion.propTypes = {
  title          : PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  loadedCondition: PropTypes.bool,
  noLoadingIcon  : PropTypes.bool,
  thin           : PropTypes.bool,
  black          : PropTypes.bool,
  children       : PropTypes.node,
  expanded       : PropTypes.bool,
  onChange       : PropTypes.func
};

Accordion.defaultProps = {
  title          : null,
  loadedCondition: true,
  noLoadingIcon  : false,
  thin           : false,
  black          : false,
  children       : null,
  expanded       : false,
  onChange       : () => {}
};
