import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@mui/styles';
import * as actions from '../../../actions';
import Modal from '../../molecules/Modal';
import { RootState } from '../../../reducers';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import classNames from 'classnames';
import { Theme, ThemeProvider } from '@mui/material';
import { compColor } from '../../../sagas/common';

const useStyles = (theme: Theme) =>
  makeStyles({
    root: {
      width: '80vw',
      padding: 10,
      borderRadius: 5,
      maxWidth: 600,
    },
    contents: {},
    info: {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
    },
    warning: {
      backgroundColor: 'orange',
      color: 'black',
    },
    error: {
      backgroundColor: '#ff4444',
      color: 'black',
    },
    control: {
      marginTop: 10,
      float: 'right',
      display: 'flex',
    },
    button: {
      margin: 5,
    },
  })();

const theme: Partial<Theme> = {
  components: {
    MuiFilledInput: {
      styleOverrides: {
        multiline: {
          padding: 10,
        },
      },
    },
  },
};

type ComponentProps = ReturnType<typeof mapStateToProps>;
type ActionProps = typeof mapDispatchToProps;

type PropsType = ComponentProps & ActionProps;
const App: React.FC<PropsType> = (props: PropsType) => {
  const classes = useStyles(props.theme);

  const label = {
    ok: 'OK',
    yes: 'はい',
    no: 'いいえ',
  };

  const rootClass = classNames({
    [classes.root]: true,
    [classes.info]: props.type === 'info',
    [classes.warning]: props.type === 'warning',
    [classes.error]: props.type === 'error',
  });

  /** ボタンの表示 */
  const controlArea = (isConfirm: boolean) => {
    if (isConfirm) {
      return (
        <>
          <div className={classes.button}>
            <Button
              variant={'contained'}
              onClick={props.clickNo}
              style={{ backgroundColor: compColor(props.theme.palette.background.paper), color: compColor(props.theme.palette.text.primary) }}
            >
              {label.no}
            </Button>
          </div>
          <div className={classes.button}>
            <Button variant={'contained'} color={'primary'} onClick={props.clickYes}>
              {label.yes}
            </Button>
          </div>
        </>
      );
    } else {
      return (
        <Button className={classes.button} variant={'contained'} color={'primary'} onClick={props.clickClose}>
          {label.ok}
        </Button>
      );
    }
  };

  const detailArea = (detail: string) => {
    const backgroundColor = props.theme.palette?.background.default ?? 'initial';
    if (detail) {
      return (
        <ThemeProvider theme={theme}>
          <TextField
            style={{ backgroundColor: backgroundColor }}
            // rows={8} 未指定なら自動
            minRows={3}
            variant={'filled'}
            multiline={true}
            defaultValue={detail}
            InputProps={{ readOnly: true }}
            fullWidth={true}
          />
        </ThemeProvider>
      );
    } else {
      return '';
    }
  };

  return (
    <Modal open={props.show}>
      <div className={rootClass}>
        {/* メッセージ */}
        <div className={classes.contents}>
          <div>{props.message}</div>
          <div>{detailArea(props.detail)}</div>
        </div>
        {/* ボタン */}
        <div className={classes.control}>{controlArea(props.confirm)}</div>
      </div>
    </Modal>
  );
};

// state
const mapStateToProps = (state: RootState) => {
  return {
    ...state.reducer.dialog,
    theme: state.reducer.theme.theme,
  };
};

// action
const mapDispatchToProps = {
  clickClose: actions.closeDialog,
  clickYes: actions.dialogYes,
  clickNo: actions.dialogNo,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
