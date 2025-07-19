import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import { RootState } from '../../../reducers';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent, Paper, Theme, Typography } from '@mui/material';
import { countStr } from '../../../sagas/twitterUtil';
import { makeStyles } from '@mui/styles';
import { Game } from '../../../types/api';

const useStyles = (theme: Theme) =>
  makeStyles({
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
      maxHeight: '15vh',
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
      display: 'flex',
    },
    divider: {
      marginTop: 10,
      marginBottom: 10,
    },
    controlButton: {
      margin: 5,
    },
    additional: {
      padding: 5,
      backgroundColor: theme.palette.background.paper,
      boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 5px rgb(0 0 0 / 12%) !important',
    },
  })();

type ComponentProps = ReturnType<typeof mapStateToProps>;
type ActionProps = typeof mapDispatchToProps;

type PropsType = ComponentProps & ActionProps;
const TweetForm: React.FC<PropsType> = (props: PropsType) => {
  const classes = useStyles(props.theme.theme);

  // ツイート内容
  const [tweet, setTweet] = React.useState<string>('');
  const [tweetCount, setTweetCount] = React.useState<number>(0);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTweet(event.target.value);
    setTweetCount(countStr(event.target.value));
  };

  // テンプレートのゲームで選択しているもの
  const [templateGameIndex, setTemplateGameIndex] = React.useState<string>('');

  // テンプレートのテキスト
  const [templateList, setTemplate] = React.useState<{ title: string; contents: string }[]>([]);

  // テンプレート文の生成
  React.useEffect(() => {
    const newTemplateList: { title: string; contents: string }[] = [];
    const selectedGame: Game = props.gameList[templateGameIndex];
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

    for (const template of props.template) {
      if (commentariesText && template.type === 'withOutCommentary') continue;
      if (!commentariesText && template.type === 'withCommentary') continue;

      let newTemplate = template.text.replace('{game}', gamename);
      newTemplate = newTemplate.replace('{runners}', runnerText);
      newTemplate = newTemplate.replace('{category}', category);
      newTemplate = newTemplate.replace('{commentaries}', commentariesText);

      // additional
      if (template.additional) {
        const additional = template.additional;
        let str = '';
        if (additional.includes('{run}')) {
          for (const run of runners) {
            const name = run.twitterid ? `${run.username} (@${run.twitterid})` : run.username;
            str += `\n${additional.replace('{run}', name)}`;
          }
        }
        newTemplate += str;
      }

      // footer
      newTemplate += '\n\n';
      newTemplate += props.tweetFooter;

      newTemplateList.push({ title: template.title, contents: newTemplate });
    }

    setTemplate(newTemplateList);
  }, [templateGameIndex]);

  // ツイートテキストの強制更新
  React.useEffect(() => {
    setTweet(props.tweetText);
    setTweetCount(countStr(props.tweetText));
  }, [props.tweetText]);

  /** テンプレートのゲーム選択 */
  const handleChangeGame = (event: SelectChangeEvent<{ name?: string; value: number }>, child: React.ReactNode): void => {
    const value = event.target.value as string;
    setTemplateGameIndex(value);
  };

  /** テンプレート文の適用 */
  const handleTemplateApply = (value: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
    setTweet(value);
    setTweetCount(countStr(value));
  };

  return (
    <div className={classes.root}>
      {/* テキストボックス */}
      <Paper style={{ width: '80vw', padding: 5, maxWidth: '1000px' }}>
        <TextField
          label="ツイート内容"
          multiline={true}
          minRows={4}
          maxRows={10}
          value={tweet}
          onChange={handleChange}
          className={classes.textField}
          margin="normal"
          helperText={`${tweetCount}`}
          variant="outlined"
          error={tweetCount > 140}
        />
      </Paper>

      {/* テンプレート */}
      <Paper style={{ height: '80vh', width: '80vw', padding: 5, maxWidth: '1000px' }}>
        {/* ゲーム選択 */}
        <div style={{ padding: 5 }}>
          <FormControl style={{ width: '100%' }}>
            <InputLabel>ゲーム選択</InputLabel>
            <Select value={templateGameIndex as any} onChange={handleChangeGame}>
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
              <Typography variant="body1">{template.title}</Typography>
              <TextField
                style={{ width: '100%' }}
                variant="outlined"
                multiline={true}
                InputProps={{
                  readOnly: true,
                }}
                value={template.contents}
                disabled={true}
              />
              <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                <Button
                  variant={'contained'}
                  size={'small'}
                  color={'primary'}
                  onClick={handleTemplateApply(template.contents)}
                  disabled={templateGameIndex === '' || Number.isNaN(templateGameIndex)}
                >
                  反映
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Paper>
    </div>
  );
};

// state
const mapStateToProps = (state: RootState) => {
  return {
    tweetText: state.reducer.post.text,
    gameList: state.reducer.game,
    template: state.reducer.config.tweetTemplate,
    tweetFooter: state.reducer.config.tweetFooter,
    disabled: ['posting', 'uploading'].includes(state.reducer.status),
    theme: state.reducer.theme,
  };
};

// action
const mapDispatchToProps = {
  closeNotify: actions.closeNotify,
  closeModal: actions.closeDialog,
};

export default connect(mapStateToProps, mapDispatchToProps)(TweetForm);
