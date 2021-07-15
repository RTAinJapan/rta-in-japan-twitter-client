import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import RepeatIcon from '@material-ui/icons/Repeat';
import ReplyIcon from '@material-ui/icons/Reply';
import { Tweets } from '../../../types/api';
import moment from 'moment';
import * as actions from '../../../actions';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: 5,
      display: 'flex',
    },
    screenName: {
      marginLeft: 5,
      color: 'gray',
    },
    date: {
      marginLeft: 5,
      color: 'gray',
      fontSize: '10px',
    },
  }),
);

export type ComponentProps = Tweets;

type ActionProps = {
  replyTweet?: typeof actions.addReplyTweet;
  retweet?: typeof actions.addAttachUrl;
  deleteTweet?: typeof actions.deleteTweet;
};

type PropsType = ComponentProps & ActionProps;
const Tweet: React.SFC<PropsType> = (props: PropsType) => {
  const classes = useStyles({});

  const handleReplyButton = (id: string) => () => {
    if (props.replyTweet) {
      props.replyTweet(props);
    }
  };
  const handleRTButton = (id: string) => () => {
    if (props.retweet) {
      props.retweet(props);
    }
  };
  const handleDeleteButton = (id: string) => () => {
    if (props.deleteTweet) props.deleteTweet(id);
  };

  return (
    <Paper className={classes.root}>
      <Avatar src={props.user.profile_image_url_https} />
      <div style={{ marginLeft: 5 }}>
        {/* ユーザー名、投稿時刻 */}
        <div>
          <Typography style={{ fontWeight: 'bold', fontSize: 'small' }} variant={'subtitle1'}>
            {props.user.name}
          </Typography>
          <span className={classes.screenName}>
            <Typography style={{ fontSize: 'xx-small' }} variant={'caption'}>
              @{props.user.screen_name}
            </Typography>
          </span>
          <span className={classes.date}>
            <Typography style={{ fontSize: 'xx-small' }} variant={'caption'}>
              {moment(props.created_at).format('YYYY/MM/DD HH:mm:ss')}
            </Typography>
          </span>
        </div>
        {/* 本文 */}
        <Typography>{props.text}</Typography>
        {/* 各種操作 */}
        <div style={{ display: !props.deleteTweet ? 'none' : 'block', textAlign: 'right' }}>
          <Tooltip title={'返信'}>
            <span>
              <IconButton color={'default'} size={'small'} onClick={handleReplyButton(props.id_str)} disabled={!props.deleteTweet}>
                <ReplyIcon />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title={'引用リツイート'}>
            <span>
              <IconButton color={'default'} size={'small'} onClick={handleRTButton(props.id_str)} disabled={!props.deleteTweet}>
                <RepeatIcon />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title={'ツイート削除'}>
            <span>
              <IconButton color={'default'} size={'small'} onClick={handleDeleteButton(props.id_str)} disabled={!props.deleteTweet}>
                <DeleteIcon />
              </IconButton>
            </span>
          </Tooltip>
        </div>
      </div>
    </Paper>
  );
};

export default Tweet;
