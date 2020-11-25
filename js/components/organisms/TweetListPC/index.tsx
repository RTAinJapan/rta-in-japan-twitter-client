import React from 'react';
import { connect } from 'react-redux';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import * as actions from '../../../actions';
import { RootState } from '../../../reducers';
import TweetList from '../../molecules/TweetList';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import RefreshIcon from '@material-ui/icons/Refresh';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    column: {
      width: 'calc(100vw / 3 - 50px)',
      marginLeft: 5,
      marginRight: 5,
    },
    tweetColumn: {
      height: 'calc(100vh - 150px)',
    },
    reloadButton: {
      position: 'fixed',
      bottom: theme.spacing(5),
      right: theme.spacing(2),
    },
  }),
);

type ComponentProps = ReturnType<typeof mapStateToProps>;
type ActionProps = typeof mapDispatchToProps;

type PropsType = ComponentProps & ActionProps;
const TweetListPC: React.SFC<PropsType> = (props: PropsType) => {
  const classes = useStyles({});

  return (
    <div className={classes.root}>
      <div className={classes.column}>
        <Typography variant={'h6'}>運営ツイート</Typography>
        <div className={classes.tweetColumn}>
          <TweetList tweets={props.list.user} deleteTweet={props.deleteTweet} />
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
      <Fab className={classes.reloadButton} color={'primary'} onClick={() => props.reloadTweet()}>
        <RefreshIcon />
      </Fab>
    </div>
  );
};

// state
const mapStateToProps = (state: RootState) => {
  return {
    list: state.reducer.twitterTimeline,
  };
};

// action
const mapDispatchToProps = {
  deleteTweet: actions.deleteTweet,
  reloadTweet: actions.reloadTweetList,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TweetListPC);
