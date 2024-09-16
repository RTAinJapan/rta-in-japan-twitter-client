import React from 'react';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import RepeatIcon from '@mui/icons-material/Repeat';
import ReplyIcon from '@mui/icons-material/Reply';
import LinkIcon from '@mui/icons-material/Link';
import { Statuses } from '../../../types/api';
import moment from 'moment';
import * as actions from '../../../actions';
import { tweetTextUrlReplace, tweetToUrl } from '../../../sagas/twitterUtil';
import { Divider } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { connect } from 'react-redux';
import { RootState } from '../../../reducers';

const useStyles = makeStyles({
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
});

export type ComponentProps = Statuses;

type ActionProps = {
  replyTweet?: typeof actions.addReplyTweet;
  retweet?: typeof actions.addAttachUrl;
  deleteTweet?: typeof actions.deleteTweet;
  showMedia: typeof actions.showMedia;
};

type PropsType = ComponentProps & ActionProps;
const Tweet: React.FC<PropsType> = (props: PropsType) => {
  const classes = useStyles();

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

  /** ツイートを外部で開く */
  const handleLinkButton = (tweet: Statuses) => () => {
    const url = tweetToUrl(tweet);
    window.open(url);
  };

  /** 返信ツイートを外部で開く */
  // const handleReplyLinkButton = (tweet: Statuses) => () => {
  //   const url = tweetToReplyUrl(tweet);
  //   window.open(url);
  // };

  /** サムネをクリックしたら最大化して表示 */
  // const handleShowMedia = (index: number) => () => {
  //   const media = props.media ? props.media : null;
  //   if (!media) return;
  //   props.showMedia({
  //     media: media,
  //     index,
  //   });
  // };

  // const createThumb = (media: Statuses['media'] | null) => {
  //   if (media) {
  //     return (
  //       <div>
  //         {media.map((med, index) => {
  //           const url = med.url ? med.url : med.preview_image_url;
  //           return (
  //             // なんかkeyがユニークにならない
  //             <div key={`${url}_${Math.random()}`} onClick={handleShowMedia(index)}>
  //               <img style={{ height: 80, objectFit: 'fill', maxWidth: '100%' }} src={`${url}:small`} />
  //             </div>
  //           );
  //         })}
  //       </div>
  //     );
  //   } else {
  //     return <div />;
  //   }
  // };

  return (
    <Paper className={classes.root}>
      {/* <Avatar src={props.user.profile_image_url} /> */}
      <div style={{ marginLeft: 5, width: '100%' }}>
        {/* ユーザー名、投稿時刻 */}
        <div>
          {/* <Typography style={{ fontWeight: 'bold', fontSize: 'small' }} variant={'subtitle1'}>
            {props.user.name}
          </Typography> */}
          <span className={classes.screenName}>
            <Typography style={{ fontSize: 'xx-small' }} variant={'caption'}>
              @{props.username}
            </Typography>
          </span>
          <span className={classes.date}>
            <Typography style={{ fontSize: 'xx-small' }} variant={'caption'}>
              {moment(new Date(props.created_at)).format('YYYY/MM/DD HH:mm:ss')}
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
              <IconButton color={'default'} size={'small'} onClick={handleReplyButton(props.id)} disabled={!props.deleteTweet}>
                <ReplyIcon />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title={'引用リツイート'}>
            <span>
              <IconButton color={'default'} size={'small'} onClick={handleRTButton(props.id)} disabled={!props.deleteTweet}>
                <RepeatIcon />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title={'ツイート削除'}>
            <span>
              <IconButton color={'default'} size={'small'} onClick={handleDeleteButton(props.id)} disabled={!props.deleteTweet}>
                <DeleteIcon />
              </IconButton>
            </span>
          </Tooltip>
        </div>

        {/* サムネ */}
        {/* {props.deleteTweet && props.media ? <Divider /> : ''}
        {props.deleteTweet && props.media ? <div>{createThumb(props.media)}</div> : ''} */}

        {/* 返信先or引用RT */}
        {/* {props.deleteTweet && props.in_reply_to_status ? <Divider /> : ''} */}

        {/* 返信先 */}
        {/* {props.deleteTweet && props.in_reply_to_status ? (
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
        )} */}

        {/* 返信先or引用RT */}
        {/* {props.deleteTweet && props.quoted_status ? <Divider /> : ''} */}

        {/* {props.deleteTweet && props.quoted_status ? (
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
        )} */}
      </div>
    </Paper>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    // preview: state.reducer.mediaPreview,
  };
};

const mapDispatchToProps = {
  showMedia: actions.showMedia,
};

export default connect(mapStateToProps, mapDispatchToProps)(Tweet);
