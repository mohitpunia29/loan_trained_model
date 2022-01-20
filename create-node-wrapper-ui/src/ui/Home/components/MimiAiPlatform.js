import React from 'react';
import { map as _map } from 'lodash';
import bindClassnames from 'classnames/bind';

import { Grid, Typography } from '@material-ui/core';

import { MIMI_AI_PLATFORM } from '../constants/mimiAiPlatform';
import { circlefy as drawCircle } from './circlefy';

import ShowMimiAiPlatformModal from './Modals/ShowMimiAiPlatformModal';
import ChevronIcon from '../../Components/Icons/ChevronIcon';

import styles from './Products.module.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

class MimiAiPlatform extends React.Component {
  state = {
    modal: {
      open: false,
      data: {}
    }
  };

  closeModal = () => this.setState({ modal: { open: false, data: {} } });
  openModal = data => this.setState({ modal: { open: true, data: data } });
  // div wrapper reference
  wrapperReferrence = node => (this.productsWrapperRef = node);

  componentDidMount() {
    this.circleInit();
    window.addEventListener('resize', this.circleInit);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.circleInit);
  }

  circleInit = () => {
    const container = this.productsWrapperRef.getBoundingClientRect();
    let radius = container.width / 2;

    drawCircle(this.productsWrapperRef, radius, radius, 90, radius, radius);
  };

  render() {
    const { modal } = this.state;
    return (
      <Grid item xs={6} className={classnames('root')}>
        <Typography
          classes={{
            root: classnames('header')
          }}
          variant='h5'
          component='h1'
        >
          {MIMI_AI_PLATFORM.header} <ChevronIcon direction="right" />
        </Typography>
        <div
          onClick={this.circleInit}
          className={classnames('mimiAIplatform__wrapper')}
          ref={this.wrapperReferrence}
        >
          {_map(MIMI_AI_PLATFORM.products, item => (
            <div
              onClick={() =>
                this.setState({ modal: { open: true, data: item } })
              }
              className={classnames('mimiAIplatform__item')}
              key={item.name}
            >
              <img src={item.icon} key={item.icon} alt={item.name} />
              <Typography
                variant='h6'
              >
                {item.name}
              </Typography>
            </div>
          ))}
        </div>
        <ShowMimiAiPlatformModal
          open={modal.open}
          data={modal.data}
          closeModal={this.closeModal}
        />
      </Grid>
    );
  }
}

export default MimiAiPlatform;
