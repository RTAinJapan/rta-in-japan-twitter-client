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
import LinkIcon from '@material-ui/icons/Link';
import { Tweets } from '../../../types/api';
import moment from 'moment';
import * as actions from '../../../actions';
import { tweetTextUrlReplace, tweetToReplyUrl, tweetToUrl } from '../../../sagas/twitterUtil';
import { Divider } from '@material-ui/core';

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

  const handleLinkButton = (tweet: Tweets) => () => {
    const url = tweetToUrl(tweet);
    window.open(url);
  };

  const handleReplyLinkButton = (tweet: Tweets) => () => {
    const url = tweetToReplyUrl(tweet);
    window.open(url);
  };

  const createThumb = (tweet: Tweets['extended_entities']) => {
    // 全部画像ならサムネ表示
    const media = tweet ? tweet.media : null;

    if (media) {
      return (
        <div>
          {media.map((med) => (
            <a href={med.media_url_https} target="_blank">
              <img style={{ height: 80, objectFit: 'fill' }} src={`${med.media_url_https}:small`} />
            </a>
          ))}
        </div>
      );
    } else {
      return <div></div>;
    }
  };

  return (
    <Paper className={classes.root}>
      <Avatar src={props.user.profile_image_url_https} />
      <div style={{ marginLeft: 5, width: '100%' }}>
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
        <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{tweetTextUrlReplace(props)}</span>

        {/* 各種操作 */}
        <div style={{ display: !props.deleteTweet ? 'none' : 'block', textAlign: 'right' }}>
          <Tooltip title={'ツイートを他で開く'}>
            <span>
              <IconButton color={'default'} size={'small'} onClick={handleLinkButton(props)}>
                <LinkIcon />
              </IconButton>
            </span>
          </Tooltip>

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

        {/* サムネ */}
        {props.deleteTweet && props.extended_entities ? <Divider /> : ''}
        {props.deleteTweet && props.extended_entities ? <div>{createThumb(props.extended_entities)}</div> : ''}

        {/* 返信先 */}

        {props.deleteTweet && (props.in_reply_to_screen_name || props.quoted_status) ? <Divider /> : ''}

        {/* 返信先 */}
        {props.deleteTweet && props.in_reply_to_screen_name ? (
          <div>
            <Typography variant={'caption'}>返信</Typography>
            <Tooltip title={'返信先を開く'}>
              <span>
                <IconButton color={'default'} size={'small'} onClick={handleReplyLinkButton(props)}>
                  <LinkIcon />
                </IconButton>
              </span>
            </Tooltip>
          </div>
        ) : (
          ''
        )}

        {props.deleteTweet && props.quoted_status ? (
          <div>
            <Typography variant={'caption'}>引用</Typography>
            <Tooltip title={'引用先を開く'}>
              <span>
                <IconButton color={'default'} size={'small'} onClick={handleLinkButton(props.quoted_status)}>
                  <LinkIcon />
                </IconButton>
              </span>
            </Tooltip>
          </div>
        ) : (
          ''
        )}
      </div>
    </Paper>
  );
};

export default Tweet;
