import React from 'react';
import { makeStyles } from '@mui/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import { RootState } from '../../../reducers';
import * as actions from '../../../actions';
import { connect } from 'react-redux';

const useStyles = makeStyles({
  root: {},
  logout: {
    marginTop: 100,
  },
});

type ComponentProps = ReturnType<typeof mapStateToProps>;
type ActionProps = typeof mapDispatchToProps;

type PropsType = ComponentProps & ActionProps;

export const OtherInfo: React.FC<PropsType> = (props) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <List>
        {props.linkList.map((link, index) => {
          return (
            <div key={index}>
              <ListItem onClick={() => window.open(link.url)}>
                <ListItemIcon>
                  <img src={link.iconUrl} height={30} />
                </ListItemIcon>
                <ListItemText>{link.name}</ListItemText>
              </ListItem>
              <Divider />
            </div>
          );
        })}
        <ListItem>
          <div className={classes.logout}>
            <Button color={'secondary'} variant={'contained'} onClick={props.logout}>
              ログアウト
            </Button>
          </div>
        </ListItem>
      </List>
    </div>
  );
};

// state
const mapStateToProps = (state: RootState) => {
  return {
    linkList: state.reducer.config.link,
  };
};

// action
const mapDispatchToProps = {
  logout: actions.logoutDiscord,
};

export default connect(mapStateToProps, mapDispatchToProps)(OtherInfo);
