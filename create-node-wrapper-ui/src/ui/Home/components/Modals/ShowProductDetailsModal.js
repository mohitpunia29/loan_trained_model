import React from 'react';
import PropTypes from 'prop-types';
import { map as _map } from 'lodash';
import bindClassnames from 'classnames/bind';

import {
  DialogTitle,
  Grid,
  Dialog,
  Paper,
  List,
  Tabs,
  Tab,
  ListItem,
  ListItemText,
  DialogContent,
  Typography
} from '@material-ui/core';

import Close from '../Icons/Close';

import styles from './ShowProductDetailsModal.model.css';
// Bind to classnames
const classnames = bindClassnames.bind(styles);

class ShowProductDetailsModal extends React.Component {
  state = {
    value: 0
  };
  closeIcon = () => {
    const { closeModal } = this.props;
    return <Close className={classnames('closeIcon')} onClick={closeModal} />;
  };

  handleTabChange = (event, value) => {
    this.setState({ value });
  };

  oneFeatureItem = item => (
    <ListItem
      key={item}
      dense
      disableGutters
      classes={{ dense: classnames('Modal__denseOverryde') }}
    >
      <ListItemText>{item}</ListItemText>
    </ListItem>
  );

  oneBenefit = item => (
    <ListItem
      key={item.text}
      dense
      disableGutters
      classes={{ dense: classnames('Modal__denseOverryde') }}
    >
      <ListItemText>
        <b>{item.highlight}</b>
        <p style={{ margin: 0 }}>{item.text}</p>
      </ListItemText>
    </ListItem>
  );

  render() {
    const { value } = this.state;
    const { open, data } = this.props;
    return (
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        className={classnames('confirmation-dialog')}
        aria-labelledby="confirmation-dialog-title"
        open={open}
        maxWidth="md"
      >
        <Paper>
          <DialogTitle
            id="confirmation-dialog-title"
            classes={{ root: classnames('confirmation-dialog__Title') }}
          >
            Entefy {data.name}
            {this.closeIcon()}
          </DialogTitle>
          <DialogContent>
            <Grid container className={classnames('topPart')}>
              <Grid item xs={3} className={classnames('leftColumn__topPart')}>
                <img src={data.icon} alt="icon" />
              </Grid>
              <Grid item xs={9} className={classnames('rightColumn__topPart')}>
                <div
                  className={classnames('rightColumn__topPart__innerWrapper')}
                >
                  <Typography
                    classes={{
                      h6: classnames('header')
                    }}
                    variant='h6'
                    component='h6'
                  >
                    {data.header}
                  </Typography>
                  <Typography className={classnames('body')} variant="body1">
                    <span
                      dangerouslySetInnerHTML={{ __html: data.description }}
                    />
                  </Typography>
                </div>
              </Grid>
            </Grid>
            <Grid container>
              {/* <AppBar position="static"> */}
              <Grid container>
                <Tabs
                  indicatorColor="primary"
                  textColor="primary"
                  value={value}
                  onChange={this.handleTabChange}
                >
                  <Tab
                    classes={{
                      label   : classnames('label__overryde'),
                      selected: classnames('label__selected'),
                      disabled: classnames('label__disabled')
                    }}
                    label="Key Benefits"
                  />
                  <Tab
                    classes={{
                      label   : classnames('label__overryde'),
                      selected: classnames('label__selected'),
                      disabled: classnames('label__disabled')
                    }}
                    label="Key Features"
                  />
                  <Tab
                    classes={{
                      label   : classnames('label__overryde'),
                      selected: classnames('label__selected'),
                      disabled: classnames('label__disabled')
                    }}
                    label="Implementation Requirements"
                    disabled
                  />
                </Tabs>
              </Grid>
              <Grid container>
                {/* </AppBar> */}
                {value === 0 && (
                  <TabContainer>
                    <List>
                      {_map(data.benefits, item => this.oneBenefit(item))}
                    </List>
                  </TabContainer>
                )}
                {value === 1 && (
                  <TabContainer>
                    <List>
                      {_map(data.features, item => this.oneFeatureItem(item))}
                    </List>
                  </TabContainer>
                )}
              </Grid>
            </Grid>
            {/* {_map()} */}
          </DialogContent>
        </Paper>
      </Dialog>
    );
  }
}

ShowProductDetailsModal.propTypes = {
  open      : PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  data      : PropTypes.object
};

ShowProductDetailsModal.defaultProps = {
  data: {}
};

export default ShowProductDetailsModal;

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};
