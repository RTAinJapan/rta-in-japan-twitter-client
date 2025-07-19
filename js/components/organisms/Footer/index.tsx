import React from 'react';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  root: {
    position: 'fixed',
    bottom: 0,
    width: '100%',
  },
});

type ComponentProps = {};
type ActionProps = {};

type PropsType = ComponentProps & ActionProps;
const Footer: React.FC<PropsType> = (props: PropsType) => {
  const classes = useStyles();

  const label = {
    copyright: '© 2025 RTA in Japan All rights reserved.',
  };

  return (
    <div className={classes.root}>
      <Typography align={'right'}>{label.copyright}</Typography>
    </div>
  );
};

export default Footer;
