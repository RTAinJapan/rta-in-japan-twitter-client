import React from 'react';
import { connect } from 'react-redux';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import * as actions from '../../../actions';
import Modal from '../../molecules/Modal';
import { RootState } from '../../../reducers';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Divider, IconButton, Tooltip } from '@material-ui/core';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import DeleteIcon from '@material-ui/icons/Cancel';
import Dropzone from 'react-dropzone';
import { countStr } from '../../../sagas/twitterUtil';
import Tweet from '../../molecules/Tweet';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    textField: {
      width: '100%',
    },
    dropzone: {
      height: 100,
      justifyContent: 'center',
      display: 'flex',
      alignItems: 'center',
    },
    upload: {
      backgroundColor: 'lightgray',
      minHeight: 200,
      minWidth: 400,
    },
    mediaThumb: {
      height: 150,
      width: 'inherit',
      objectFit: 'cover',
      cursor: 'pointer',
    },
    media: {
      height: '100%',
      maxHeight: '90vh',
      width: '100%',
      objectFit: 'contain',
    },
    control: {
      marginTop: 10,
      float: 'right',
    },
    divider: {
      marginTop: 10,
      marginBottom: 10,
    },
    controlButton: {
      margin: 5,
    },
  }),
);

type ComponentProps = ReturnType<typeof mapStateToProps>;
type ActionProps = typeof mapDispatchToProps;

type PropsType = ComponentProps & ActionProps;
const TweetForm: React.SFC<PropsType> = (props: PropsType) => {
  const classes = useStyles({});

  // ツイート内容
  const [tweet, setTweet] = React.useState<string>('');
  const [tweetCount, setTweetCount] = React.useState<number>(0);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTweet(event.target.value);
    setTweetCount(countStr(event.target.value));
  };

  // テンプレートの表示・非表示
  const [showTemplate, setShowTemplate] = React.useState<boolean>(false);
  const toggleTemplate = () => setShowTemplate(!showTemplate);

  // テンプレートのゲームで選択しているもの
  const [templateGameIndex, setTemplateGameIndex] = React.useState<number>(NaN);

  // テンプレートのテキスト
  const [templateList, setTemplate] = React.useState<string[]>([]);

  // プレビュー
  const [showPreview, setShowPreview] = React.useState<boolean>(false);
  // プレビューで選択したメディア
  const [previewMediaIndex, setPreviewMediaIndex] = React.useState<number>(0);
  const handleShowPreview = (index: number) => () => {
    setPreviewMediaIndex(index);
    setShowPreview(true);
  };
  const handleClosePreview = () => {
    setPreviewMediaIndex(0);
    setShowPreview(false);
  };

  // テンプレート文の生成
  React.useEffect(() => {
    const newTemplateList: string[] = [];
    const selectedGame = props.gameList[templateGameIndex];
    /** ゲーム名 */
    const gamename = selectedGame ? selectedGame.gamename : '';
    /** カテゴリ */
    const category = selectedGame ? selectedGame.category : '';
    /** 走者 */
    const runners = selectedGame ? selectedGame.runner : [];
    const runnerText = runners
      .map((runner) => {
        let text = `${runner.username}さん`;
        if (runner.twitterid) text += `(@${runner.twitterid})`;
        return text;
      })
      .reduce((prev, next, index) => {
        if (index === 0) return prev + next;
        return prev + '、' + next;
      }, '');
    /** 解説 */
    const commentaries = selectedGame ? selectedGame.commentary : [];
    const commentariesText = commentaries
      .map((commentary) => {
        let text = `${commentary.username}さん`;
        if (commentary.twitterid) text += `(@${commentary.twitterid})`;
        return text;
      })
      .reduce((prev, next, index) => {
        if (index === 0) return prev + next;
        return prev + '、' + next;
      }, '');

    //
    if (commentariesText) {
      for (const template of props.template.withCommentary) {
        let newTemplate = template.replace('{game}', gamename);
        newTemplate = newTemplate.replace('{runners}', runnerText);
        newTemplate = newTemplate.replace('{category}', category);
        newTemplate = newTemplate.replace('{commentaries}', commentariesText);
        newTemplate += '\n\n';
        newTemplate += props.template.footer;

        newTemplateList.push(newTemplate);
      }
    } else {
      for (const template of props.template.withOutCommentary) {
        let newTemplate = template.replace('{game}', gamename);
        newTemplate = newTemplate.replace('{runners}', runnerText);
        newTemplate = newTemplate.replace('{category}', category);
        newTemplate = newTemplate.replace('{commentaries}', commentariesText);
        newTemplate += '\n\n';
        newTemplate += props.template.footer;

        newTemplateList.push(newTemplate);
      }
    }

    for (const template of props.template.common) {
      let newTemplate = template.replace('{game}', gamename);
      newTemplate = newTemplate.replace('{runners}', runnerText);
      newTemplate = newTemplate.replace('{category}', category);
      newTemplate = newTemplate.replace('{commentaries}', commentariesText);
      newTemplate += '\n\n';
      newTemplate += props.template.footer;

      newTemplateList.push(newTemplate);
    }

    setTemplate(newTemplateList);
  }, [templateGameIndex]);

  // ツイートテキストの強制更新
  React.useEffect(() => {
    setTweet(props.tweetText);
    setTweetCount(countStr(props.tweetText));
  }, [props.tweetText]);

  /** ツイート送信 */
  const handleClickSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    props.submitTweet(tweet);
  };

  /** テンプレートのゲーム選択 */
  const handleChangeGame = (event: React.ChangeEvent<{ name?: string; value: number }>, child: React.ReactNode): void => {
    setTemplateGameIndex(event.target.value);
  };

  /** テンプレート文の適用 */
  const handleTemplateApply = (value: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
    setShowTemplate(false);
    setTweet(value);
    setTweetCount(countStr(value));
  };

  const handleDrop = (accepted: File[], rejected: File[]) => {
    props.uploadMedia(accepted);
  };

  const handleTextOnPaste: React.ClipboardEventHandler<HTMLDivElement> = (e) => {
    const items = e.clipboardData.items;
    const blob = items[0].getAsFile();
    if (!blob) return;

    if (['image/gif', 'image/jpeg', 'image/png', 'image/jpg', 'video/mp4'].includes(blob.type)) {
      console.log(blob);
      props.uploadMedia([blob]);
    }
  };

  return (
    <div className={classes.root}>
      {/* テキストボックス */}
      <div>
        <Dropzone accept="image/gif,image/jpeg,image/png,image/jpg,video/mp4" onDrop={handleDrop} noClick={true}>
          {({ getRootProps, getInputProps }) => (
            <section>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <TextField
                  label="ツイート内容"
                  multiline={true}
                  rows="4"
                  rowsMax="8"
                  value={tweet}
                  onChange={handleChange}
                  onPaste={handleTextOnPaste}
                  className={classes.textField}
                  margin="normal"
                  helperText={`${tweetCount}`}
                  variant="outlined"
                  error={tweetCount > 140}
                />
              </div>
            </section>
          )}
        </Dropzone>
      </div>
      {/* 返信 */}
      {props.replyTweet ? (
        <div style={{ backgroundColor: 'lightgray', padding: 10 }}>
          <div>返信</div>
          <div style={{ display: 'flex' }}>
            <Tooltip title="返信を解除">
              <IconButton onClick={() => props.deleteReplyTweet()}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
            <Tweet id_str={props.replyTweet.id_str} full_text={props.replyTweet.full_text} created_at={props.replyTweet.created_at} user={props.replyTweet.user} />
          </div>
        </div>
      ) : (
        ''
      )}
      {/* 引用RT */}
      {props.retweet ? (
        <div style={{ backgroundColor: 'lightgray', padding: 10 }}>
          <div>引用RT</div>
          <div style={{ display: 'flex' }}>
            <Tooltip title="引用RTを解除">
              <IconButton onClick={() => props.deleteRetweet()}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
            <Tweet id_str={props.retweet.id_str} full_text={props.retweet.full_text} created_at={props.retweet.created_at} user={props.retweet.user} />
          </div>
        </div>
      ) : (
        ''
      )}
      {/* アップロード */}
      <div>
        <Dropzone accept="image/gif,image/jpeg,image/png,image/jpg,video/mp4" onDrop={handleDrop}>
          {({ getRootProps, getInputProps }) => (
            <section>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <Tooltip title="ファイル添付">
                  <IconButton>
                    <AttachFileIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </div>
            </section>
          )}
        </Dropzone>
        <Divider className={classes.divider} />
        {/* プレビュー */}
        <div style={{ display: 'flex' }}>
          {props.mediaList.map((item, index, array) => (
            <div key={`${array.length}_${index}`} style={{ width: '100%', margin: 2 }}>
              <div onClick={handleShowPreview(index)} style={{ width: '100%' }}>
                {item.file.type.includes('video') ? (
                  <video className={classes.mediaThumb} muted src={item.file.preview}></video>
                ) : (
                  <img className={classes.mediaThumb} src={item.file.preview} />
                )}
              </div>
              <Button
                style={{ display: 'block' }}
                variant={'contained'}
                size={'small'}
                disabled={props.disabled}
                onClick={() => {
                  props.deleteMedia(index);
                }}
              >
                削除
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* 投稿 */}
      <div className={classes.control}>
        <Button className={classes.controlButton} variant={'contained'} color={'default'} onClick={toggleTemplate}>
          テンプレート
        </Button>

        <Button
          className={classes.controlButton}
          variant={'contained'}
          color={'primary'}
          onClick={handleClickSubmit}
          disabled={props.disabled || tweetCount > 140 || tweetCount === 0}
        >
          送信
        </Button>
      </div>

      {/* テンプレート */}
      <Modal open={showTemplate} modalClose={toggleTemplate}>
        <div style={{ height: '80vh', width: '80vw', backgroundColor: 'white', padding: 5 }}>
          {/* ゲーム選択 */}
          <div style={{ padding: 5 }}>
            <FormControl style={{ width: '100%' }}>
              <InputLabel>ゲーム選択</InputLabel>
              <Select value={templateGameIndex} onChange={handleChangeGame}>
                {props.gameList.map((game, index) => (
                  <MenuItem key={index.toString()} value={index}>
                    {game.gamename}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {/* テンプレートテキスト */}
          <div style={{ padding: 5, height: 'calc(80vh - 85px)', overflowY: 'scroll' }}>
            {templateList.map((template, index) => (
              <div key={index.toString()} style={{ marginBottom: 20 }}>
                <TextField
                  style={{ width: '100%', backgroundColor: '#ddd' }}
                  variant="outlined"
                  multiline={true}
                  InputProps={{
                    readOnly: true,
                  }}
                  value={template}
                />
                <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                  <Button variant={'contained'} size={'small'} color={'primary'} onClick={handleTemplateApply(template)} disabled={Number.isNaN(templateGameIndex)}>
                    反映
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* プレビュー拡大表示 */}
      <Modal open={showPreview} modalClose={handleClosePreview}>
        <div style={{ maxHeight: '90vh', width: '90vw' }} onClick={handleClosePreview}>
          {props.mediaList[previewMediaIndex] &&
            (props.mediaList[previewMediaIndex].file.type.includes('video') ? (
              <video className={classes.media} muted controls src={props.mediaList[previewMediaIndex].file.preview}></video>
            ) : (
              <img className={classes.media} src={props.mediaList[previewMediaIndex].file.preview} />
            ))}
        </div>
      </Modal>
    </div>
  );
};

// state
const mapStateToProps = (state: RootState) => {
  return {
    tweetText: state.reducer.post.text,
    replyTweet: state.reducer.post.in_reply_to_status_id,
    retweet: state.reducer.post.attachment_url,
    mediaList: state.reducer.post.media,
    gameList: state.reducer.game,
    template: state.reducer.config.tweetTemplate,
    disabled: ['posting', 'uploading'].includes(state.reducer.status),
  };
};

// action
const mapDispatchToProps = {
  closeNotify: actions.closeNotify,
  closeModal: actions.closeDialog,
  submitTweet: actions.submitTweet,
  uploadMedia: actions.uploadMedia,
  deleteMedia: actions.deleteMedia,
  deleteReplyTweet: actions.deleteReplyTweet,
  deleteRetweet: actions.deleteAttachUrl,
};

export default connect(mapStateToProps, mapDispatchToProps)(TweetForm);
