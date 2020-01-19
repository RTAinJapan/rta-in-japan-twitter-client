import React from 'react';
import { connect } from 'react-redux';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import * as actions from '../../../actions';
import Snackbar from '../../molecules/SnackBar';
import Modal from '../../molecules/Modal';
import { GlobalState, RootState } from '../../../reducers';

import TweetForm from '../../organisms/TweetForm';
import Dialog from '../../organisms/Dialog';
import NavTabs from '../../organisms/NavTabs';
import ChatIcon from '@material-ui/icons/Chat';
import ListIcon from '@material-ui/icons/List';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import OtherInfo from '../../organisms/OtherInfo';
import Footer from '../../organisms/Footer';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import TweetListPC from '../../organisms/TweetListPC';
import TweetListMobile from '../../organisms/TweetListMobile';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      justifyContent: 'center',
      display: 'flex',
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
  }),
);

type ComponentProps = {
  notify: GlobalState['notify'];
  list: GlobalState['twitterTimeline'];
  dialog: GlobalState['dialog'];
  discord: GlobalState['discord'];
};
type ActionProps = typeof mapDispatchToProps;

type PropsType = ComponentProps & ActionProps;
const App: React.SFC<PropsType> = (props: PropsType) => {
  const classes = useStyles({});

  const tabs = [
    {
      label: '投稿',
      icon: <ChatIcon />,
    },
    {
      label: 'ツイート一覧',
      icon: <ListIcon />,
    },
    {
      label: 'リンク',
      icon: <BookmarkIcon />,
    },
  ];

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        {props.discord.username ? (
          <NavTabs tabs={tabs} style={{ top: 0 }}>
            {/* 投稿 */}
            <div style={{ padding: 10 }}>
              <TweetForm />
            </div>
            {/* ツイート */}
            <>
              <Hidden smUp>
                <TweetListMobile />
              </Hidden>
              <Hidden xsDown>
                <TweetListPC />
              </Hidden>
            </>
            {/* リンク */}
            <div style={{ padding: 10 }}>
              <OtherInfo />
            </div>
          </NavTabs>
        ) : (
          <div className={classes.login}>
            <Modal open={true}>
              <Button color={'primary'} variant={'contained'} onClick={props.loginDiscord}>
                Discordでログイン
              </Button>
            </Modal>
          </div>
        )}
      </div>
      <Footer />
      {/* 通知系 */}
      <Dialog />
      <Modal open={props.dialog.show} modalClose={props.closeModal}>
        {props.dialog.message}
      </Modal>
      <Snackbar open={props.notify.show} message={props.notify.message} variant={props.notify.type} closable={props.notify.closable} onClose={props.closeNotify} />
    </div>
  );
};

// state
const mapStateToProps = (state: RootState): ComponentProps => {
  return {
    notify: state.reducer.notify,
    list: state.reducer.twitterTimeline,
    dialog: state.reducer.dialog,
    discord: state.reducer.discord,
  };
};

// action
const mapDispatchToProps = {
  closeNotify: actions.closeNotify,
  closeModal: actions.closeDialog,
  deleteTweet: actions.deleteTweet,
  loginDiscord: actions.loginDiscord,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
