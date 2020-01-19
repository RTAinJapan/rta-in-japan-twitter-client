import React from 'react';
import classNames from 'classnames';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const innerStyle = makeStyles((theme: Theme) =>
  createStyles({
    snackbarMessage: {
      width: 'calc(100% - 40px)',
    },
    snackbarAction: {
      paddingLeft: 3,
    },
    success: {
      backgroundColor: green[600],
    },
    error: {
      backgroundColor: theme.palette.error.dark,
    },
    info: {
      backgroundColor: theme.palette.primary.dark,
    },
    warning: {
      backgroundColor: amber[700],
    },
    icon: {
      fontSize: 20,
    },
    iconVariant: {
      opacity: 0.9,
      marginRight: theme.spacing(1),
    },
    message: {
      display: 'flex',
      alignItems: 'center',
    },
    close: {},
  }),
);

export type CustomeProps = {
  open: boolean;
  message: string;
  variant: 'success' | 'warning' | 'error' | 'info';
  closable: boolean;
  onClose: (event: React.SyntheticEvent<any>, reason: string) => void;
};

const CustomizedSnackbars: React.SFC<CustomeProps> = (props: CustomeProps) => {
  const classes = innerStyle({});
  const Icon = variantIcon[props.variant];

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={props.open}
      autoHideDuration={props.closable ? 6000 : null}
      onClose={props.closable ? props.onClose : undefined}
    >
      <SnackbarContent
        className={classNames(classes[props.variant])}
        aria-describedby="client-snackbar"
        message={
          <span className={classes.message}>
            <Icon className={classNames(classes.icon, classes.iconVariant)} />
            {props.message}
          </span>
        }
        classes={{
          message: classes.snackbarMessage,
          action: classes.snackbarAction,
        }}
        action={
          props.closable
            ? [
                <IconButton key="close" color="inherit" className={classes.close} onClick={props.onClose as any}>
                  <CloseIcon className={classes.icon} />
                </IconButton>,
              ]
            : []
        }
      />
    </Snackbar>
  );
};

export default CustomizedSnackbars;
