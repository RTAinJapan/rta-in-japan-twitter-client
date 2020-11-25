import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Tweets } from '../../../types/api';
import moment from 'moment';

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

type ActionProps = {};

type PropsType = ComponentProps & ActionProps;
const Tweet: React.SFC<PropsType> = (props: PropsType) => {
  const classes = useStyles({});

  return (
    <Paper className={classes.root}>
      <Avatar src={props.user.profile_image_url_https} />
      <div style={{ marginLeft: 5 }}>
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
        <Typography>{props.text}</Typography>
      </div>
    </Paper>
  );
};

export default Tweet;
