import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';

import bindClassnames from 'classnames/bind';

// import TERMS from './Terms.json';
import USER_NOTICE from './UserNotice.json';
import styles from './TermsAndPrivacy.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

export default function TermsOfUse({ height }) {
  /* eslint-disable max-len */
  return (
    <div className={classnames('root')}>
      <Typography
        variant='h5'
        align='center'
      >
        User Notice
      </Typography>
      {
        USER_NOTICE.sections.map((section) => (
          <div
            key={section.heading}
            className={classnames('section')}
          >
            <Typography
              variant='h6'
              align='left'
            >
              {section.heading}
            </Typography>
            {section.paragraphs.map((paragraph) => (
              <Typography
                key={paragraph}
                variant='body1'
                align='justify'
                style={{ marginBottom: '5px' }}
              >
                <div dangerouslySetInnerHTML={{ __html: paragraph }} />
              </Typography>
            ))}
          </div>
        ))
      }
    </div>
  );
}

TermsOfUse.propTypes = {
  height: PropTypes.number
};

TermsOfUse.defaultProps = {
  height: 660
};
