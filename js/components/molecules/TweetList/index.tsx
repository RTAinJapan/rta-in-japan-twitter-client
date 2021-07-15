import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tweet from '../Tweet';
import ClearIcon from '@material-ui/icons/Clear';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import Paper from '@material-ui/core/Paper';
import { Tweets } from '../../../types/api';

const useStyles = makeStyles({
  root: {
    height: '100%',
    minHeight: 300,
    padding: 5,
  },
  button: {
    minWidth: '40px',
  },
  list: {
    height: 'calc(100vh - 150px)',
    overflowY: 'scroll',
  },
  tweet: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 2,
  },
  tweetContent: {
    margin: 5,
    width: '100%',
  },
});

export type ComponentProps = {
  tweets: Tweets[];
};
export type ActionProps = {
  deleteTweet?: any;
  replyTweet?: any;
  retweet?: any;
};

type PropsType = ComponentProps & ActionProps;

const TweetList: React.SFC<PropsType> = (props) => {
  const classes = useStyles();

  const label = {
    delete: 'ツイート削除',
    noTweet: 'ツイートがありません',
  };

  return (
    <Paper className={classes.root}>
      {props.tweets.length === 0 && <div className={classes.tweetContent}>{label.noTweet}</div>}
      <div className={classes.list}>
        {props.tweets.map((item, index) => (
          <div className={classes.tweet} key={`${item.id_str}_${index}`}>
            <div className={classes.tweetContent}>
              <Tweet {...item} deleteTweet={props.deleteTweet} replyTweet={props.replyTweet} retweet={props.retweet} />
            </div>
          </div>
        ))}
      </div>
    </Paper>
  );
};

export default TweetList;
