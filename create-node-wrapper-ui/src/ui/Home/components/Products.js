import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import _map from 'lodash/map';

import { circlefy as drawCircle } from './circlefy';
import ShowProductDetailsModal from './Modals/ShowProductDetailsModal';
import ChevronIcon from './Icons/ChevronIcon';

import { PRODUCTS } from '../constants/products';

import bindClassnames from 'classnames/bind';
import styles from './Products.module.css';
const classnames = bindClassnames.bind(styles);

class Products extends React.Component {
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
    // const { angle } = this.state;
    const container = this.productsWrapperRef.getBoundingClientRect();
    let radius = container.width / 2;

    drawCircle(this.productsWrapperRef, radius, radius, 210, radius, radius);
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
          {PRODUCTS.header} <ChevronIcon direction="right" />
        </Typography>
        <div
          onClick={this.circleInit}
          className={classnames('products__wrapper')}
          ref={this.wrapperReferrence}
        >
          {_map(PRODUCTS.products, item => (
            <div
              onClick={() =>
                this.setState({ modal: { open: true, data: item } })
              }
              className={classnames('products__item')}
              key={item.name}
            >
              <img src={item.icon} key={item.icon} alt="icon" />
              <Typography
                variant='h6'
              >
                {item.name}
              </Typography>
            </div>
          ))}
        </div>
        <div className={classnames('vert__bar')} />
        <ShowProductDetailsModal
          open={modal.open}
          data={modal.data}
          closeModal={this.closeModal}
        />
      </Grid>
    );
  }
}

export default Products;
