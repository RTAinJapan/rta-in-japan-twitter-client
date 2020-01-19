import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Tweets } from '../../../types/api';

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
  }),
);

export type ComponentProps = Tweets;

type ActionProps = {};

type PropsType = ComponentProps & ActionProps;
const Tweet: React.SFC<PropsType> = (props: PropsType) => {
  const classes = useStyles({});

  return (
    <Paper className={classes.root}>
      <Avatar src={props.user.profile_image_url_https} />
      <div style={{ marginLeft: 5 }}>
        <div>
          <Typography style={{ fontWeight: 'bold' }} variant={'subtitle1'} display={'inline'}>
            {props.user.name}
          </Typography>
          <span className={classes.screenName}>
            <Typography variant={'caption'} display={'inline'}>
              @{props.user.screen_name}
            </Typography>
          </span>
        </div>
        <Typography>{props.text}</Typography>
      </div>
    </Paper>
  );
};

export default Tweet;
