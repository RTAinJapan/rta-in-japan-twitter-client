import React from 'react';
import { connect } from 'react-redux';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import * as actions from '../../../actions';
import { RootState } from '../../../reducers';
import TweetList from '../../molecules/TweetList';
import RefreshIcon from '@material-ui/icons/Refresh';
import NavTabs from '../NavTabs';
import Fab from '@material-ui/core/Fab';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginBottom: 40,
    },
    reloadButton: {
      position: 'fixed',
      bottom: theme.spacing(5),
      right: theme.spacing(2),
    },
  }),
);

type ComponentProps = ReturnType<typeof mapStateToProps>;
type ActionProps = typeof mapDispatchToProps;

type PropsType = ComponentProps & ActionProps;
const TweetListPC: React.SFC<PropsType> = (props: PropsType) => {
  const classes = useStyles({});

  const tabs = [
    {
      label: '運営ツイート',
    },
    {
      label: '返信',
    },
    {
      label: 'ハッシュタグ',
    },
  ];

  return (
    <div className={classes.root}>
      <NavTabs tabs={tabs} style={{ top: 73 }}>
        <div style={{ height: '100%', overflowY: 'scroll' }}>
          <TweetList tweets={props.list.user} deleteTweet={props.deleteTweet} />
        </div>
        <div style={{ height: '100%', overflowY: 'scroll' }}>
          <TweetList tweets={props.list.mention} />
        </div>
        <div style={{ height: '100%', overflowY: 'scroll' }}>
          <TweetList tweets={props.list.hash} />
        </div>
      </NavTabs>
      <Fab className={classes.reloadButton} color={'primary'} onClick={() => props.reloadTweet()}>
        <RefreshIcon />
      </Fab>
    </div>
  );
};

// state
const mapStateToProps = (state: RootState) => {
  return {
    list: state.reducer.twitterTimeline,
  };
};

// action
const mapDispatchToProps = {
  deleteTweet: actions.deleteTweet,
  reloadTweet: actions.reloadTweetList,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TweetListPC);
