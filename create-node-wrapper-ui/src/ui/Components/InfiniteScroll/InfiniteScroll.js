import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import bindClassnames from 'classnames/bind';

import Spinner from '../Spinner/Spinner';

import styles from './InfiniteScroll.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

/**
 * Component to wrap a list of items for infinite scroll
 * It works for both edges (bottom and top)
 *
 * @param {Object}   props
 * @param {Node}     props.children
 * @param {number}   [props.offset=200]
 * @param {Function} [props.onReachTop=undefined]
 * @param {Function} [props.onReachBottom=undefined]
 * @param {boolean}  props.isLoading                 - indicate when items are being fetched
 * @param {Node}     [props.spinner]
 */
export default function InfiniteScroll({
  children, offset,
  onReachTop, onReachBottom,
  isLoading, spinner
}) {
  const [isLoadingTop, setIsLoadingTop] = useState(false);
  const [isLoadingBottom, setIsLoadingBottom] = useState(false);
  const containerRef = useRef(null);

  // remove the loader when fetching the files is done
  useEffect(() => {
    if (!isLoading) {
      setIsLoadingTop(false);
      setIsLoadingBottom(false);
    }
  }, [isLoading]);

  function handleScroll() {
    if (isLoadingBottom || isLoadingTop) return;

    const {
      firstChild,
      lastChild,
      scrollTop,
      offsetTop,
      offsetHeight
    } = containerRef.current;

    const topEdge = firstChild.offsetTop;
    const bottomEdge = lastChild.offsetTop + lastChild.offsetHeight;
    const scrolledUp = scrollTop + offsetTop;
    const scrolledDown = scrolledUp + offsetHeight;

    if (onReachBottom && (scrolledDown + offset >= bottomEdge)) {
      setIsLoadingBottom(true);
      onReachBottom();
    } else if (onReachTop && (scrolledUp - offset <= topEdge)) {
      setIsLoadingTop(true);
      onReachTop();
    }
  }

  return (
    <div
      // eslint-disable-next-line no-return-assign
      ref={node => containerRef.current = node}
      className={classnames('root')}
      onScroll={handleScroll}
    >
      {isLoading && isLoadingTop && <Loading spinner={spinner} />}
      {children}
      {isLoading && isLoadingBottom && <Loading spinner={spinner} />}
    </div>
  );
}

InfiniteScroll.propTypes = {
  children     : PropTypes.node.isRequired,
  isLoading    : PropTypes.bool.isRequired,
  offset       : PropTypes.number,
  onReachTop   : PropTypes.func,
  onReachBottom: PropTypes.func,
  spinner      : PropTypes.node
};

InfiniteScroll.defaultProps = {
  offset       : 200,
  spinner      : undefined,
  onReachTop   : undefined,
  onReachBottom: undefined
};

function Loading({ spinner }) {
  return (
    <div className={classnames('spinnerContainer')}>
      {spinner}
    </div>
  );
}

Loading.propTypes = {
  spinner: PropTypes.node
};

Loading.defaultProps = {
  spinner: <Spinner />
};
