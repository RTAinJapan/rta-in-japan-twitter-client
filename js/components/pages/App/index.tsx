import React from 'react';
import { connect } from 'react-redux';
import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import * as actions from '../../../actions';
import Snackbar from '../../molecules/SnackBar';
import Modal from '../../molecules/Modal';
import { RootState } from '../../../reducers';

import TweetForm from '../../organisms/TweetForm';
import Dialog from '../../organisms/Dialog';
import NavTabs from '../../organisms/NavTabs';
import ChatIcon from '@mui/icons-material/Chat';
import ListIcon from '@mui/icons-material/List';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import SettingIcon from '@mui/icons-material/Settings';
import OtherInfo from '../../organisms/OtherInfo';
import Footer from '../../organisms/Footer';
import Button from '@mui/material/Button';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { Paper } from '@mui/material';
import Setting from '../../organisms/Setting';
import TweetLists from '../../organisms/TweetLists';

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
const App: React.SFC<PropsType> = (props: PropsType) => {
  const classes = useStyles(props.theme.theme);

  const tabs = [
    {
      label: '投稿',
      icon: <ChatIcon />,
    },
    {
      label: 'ツイート',
      icon: <ListIcon />,
    },
    {
      label: 'リンク',
      icon: <BookmarkIcon />,
    },
    {
      label: '設定',
      icon: <SettingIcon />,
    },
  ];

  return (
    <ThemeProvider theme={props.theme.theme}>
      <Paper className={classes.root}>
        <div className={classes.content}>
          <div className={'SW-update-dialog'} style={{ textAlign: 'center', zIndex: 10000 }} />
          {props.discord.username ? (
            <NavTabs tabs={tabs} style={{ top: 0 }}>
              {/* 投稿 */}
              <div style={{ padding: 10 }}>
                <TweetForm />
              </div>
              {/* ツイート */}
              <TweetLists />
              {/* リンク */}
              <div style={{ padding: 10 }}>
                <OtherInfo />
              </div>
              <div style={{ padding: 10 }}>
                <Setting />
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
      </Paper>
    </ThemeProvider>
  );
};

// state
const mapStateToProps = (state: RootState) => {
  return {
    notify: state.reducer.notify,
    list: state.reducer.twitterTimeline,
    dialog: state.reducer.dialog,
    discord: state.reducer.discord,
    theme: state.reducer.theme,
  };
};

// action
const mapDispatchToProps = {
  closeNotify: actions.closeNotify,
  closeModal: actions.closeDialog,
  deleteTweet: actions.deleteTweet,
  loginDiscord: actions.loginDiscord,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
