import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useCountUp } from 'react-countup';

/**
 * A wrapper around CountUp, so that it does not restart from 0 everytime end changes
 */
export default function CountUp({ end, ...props }) {
  const { countUp, update } = useCountUp({
    end,
    ...props
  });

  useEffect(() => {
    update(end);
  }, [end]);

  return (
    <span>{countUp}</span>
  );
}

CountUp.propTypes = {
  end: PropTypes.number.isRequired
};
