import React from 'react';
import { connect } from 'react-redux';
import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import * as actions from '../../../actions';
import Snackbar from '../../molecules/SnackBar';
import { RootState } from '../../../reducers';

import TweetForm from '../../organisms/TweetForm';
import Footer from '../../organisms/Footer';
import { Paper } from '@mui/material';

const useStyles = (theme: Theme) =>
  makeStyles({
    root: {
      justifyContent: 'center',
      display: 'flex',
      width: '100%',
      minHeight: '100%',
    },
    content: {
      maxWidth: 1000,
      width: '100%',
      display: 'initial',
      height: '100%',
    },
    login: {
      padding: 10,
    },
    button: {
      margin: theme.spacing(1),
      float: 'right',
      top: '-60px',
    },
    icon: {},
  })();

type ComponentProps = ReturnType<typeof mapStateToProps>;
type ActionProps = typeof mapDispatchToProps;

type PropsType = ComponentProps & ActionProps;
const App: React.FC<PropsType> = (props: PropsType) => {
  const classes = useStyles(props.theme.theme);

  return (
    <Paper className={classes.root}>
      <div className={classes.content}>
        <TweetForm />
      </div>
      <Footer />
      {/* 通知系 */}
      <Snackbar open={props.notify.show} message={props.notify.message} variant={props.notify.type} closable={props.notify.closable} onClose={props.closeNotify} />
    </Paper>
  );
};

// state
const mapStateToProps = (state: RootState) => {
  return {
    notify: state.reducer.notify,
    list: state.reducer.twitterTimeline,
    dialog: state.reducer.dialog,
    theme: state.reducer.theme,
  };
};

// action
const mapDispatchToProps = {
  closeNotify: actions.closeNotify,
  closeModal: actions.closeDialog,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
