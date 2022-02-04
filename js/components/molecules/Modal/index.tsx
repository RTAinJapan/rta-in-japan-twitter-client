import React from 'react';
import MuiModal from '@mui/material/Modal';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  paper: {
    position: 'absolute',
    backgroundColor: 'initial',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const modalStyle = {
  top: `50%`,
  left: `50%`,
  transform: `translate(-50%, -50%)`,
};

type ComponentProps = {
  open: boolean;
  children: any;
};
type ActionProps = {
  modalClose?: () => void;
};

type PropsType = ComponentProps & ActionProps;

const Modal: React.SFC<PropsType> = (props) => {
  const classes = useStyles();
  const handleClose = () => {
    if (props.modalClose) props.modalClose();
  };

  return (
    <MuiModal open={props.open} onClose={handleClose}>
      <div style={modalStyle} className={classes.paper}>
        {props.children}
      </div>
    </MuiModal>
  );
};

export default Modal;
