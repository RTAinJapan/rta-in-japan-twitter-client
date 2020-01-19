import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'fixed',
      bottom: 0,
      width: '100%',
    },
  }),
);

type ComponentProps = {};
type ActionProps = {};

type PropsType = ComponentProps & ActionProps;
const Footer: React.SFC<PropsType> = (props: PropsType) => {
  const classes = useStyles({});

  const label = {
    copyright: '© 2019 RTA in Japan All rights reserved.',
  };

  return (
    <div className={classes.root}>
      <Typography align={'right'}>{label.copyright}</Typography>
    </div>
  );
};

export default Footer;
