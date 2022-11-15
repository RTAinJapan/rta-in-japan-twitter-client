import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@mui/styles';
import * as actions from '../../../actions';
import { RootState } from '../../../reducers';
import TweetList from '../../molecules/TweetList';
import Typography from '@mui/material/Typography';
import Fab from '@mui/material/Fab';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Theme } from '@mui/material';

const useStyles = (theme: Theme) =>
  makeStyles({
    root: {
      display: 'flex',
      position: 'relative',
    },
    column: {
      width: 'calc(100vw / 3 - 50px)',
      marginLeft: 5,
      marginRight: 5,
    },
    tweetColumn: {
      height: 'calc(100vh - 170px)',
    },
    reloadButton: {
      position: 'fixed',
      bottom: theme.spacing(5),
      right: theme.spacing(2),
    },
  })();

type ComponentProps = ReturnType<typeof mapStateToProps>;
type ActionProps = typeof mapDispatchToProps;

type PropsType = ComponentProps & ActionProps;
const TweetListPC: React.SFC<PropsType> = (props: PropsType) => {
  const classes = useStyles(props.theme.theme);

  return (
    <div className={classes.root}>
      <div className={classes.column}>
        <Typography variant={'h6'}>運営ツイート</Typography>
        <div className={classes.tweetColumn}>
          <TweetList tweets={props.list.user} deleteTweet={props.deleteTweet} replyTweet={props.replyTweet} retweet={props.retweet} />
        </div>
      </div>
      <div className={classes.column}>
        <Typography variant={'h6'}>返信</Typography>
        <div className={classes.tweetColumn}>
          <TweetList tweets={props.list.mention} />
        </div>
      </div>
      <div className={classes.column}>
        <Typography variant={'h6'}>ハッシュタグ</Typography>
        <div className={classes.tweetColumn}>
          <TweetList tweets={props.list.hash} />
        </div>
      </div>
      <div style={{ height: '100%' }}>
        <Fab className={classes.reloadButton} style={{ position: 'absolute', bottom: 10, right: 35 }} color={'primary'} onClick={() => props.reloadTweet()}>
          <RefreshIcon />
        </Fab>
      </div>
    </div>
  );
};

// state
const mapStateToProps = (state: RootState) => {
  return {
    list: state.reducer.twitterTimeline,
    theme: state.reducer.theme,
  };
};

// action
const mapDispatchToProps = {
  deleteTweet: actions.deleteTweet,
  retweet: actions.addAttachUrl,
  replyTweet: actions.addReplyTweet,
  reloadTweet: actions.reloadTweetList,
};

export default connect(mapStateToProps, mapDispatchToProps)(TweetListPC);
