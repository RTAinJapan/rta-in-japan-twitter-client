import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import { RootState } from '../../../reducers';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Paper } from '@mui/material';
import { makeStyles } from '@mui/styles';
import customTheme from '../../../theme';

const useStyles = () =>
  makeStyles({
    root: {
      width: '100%',
    },
    controlButton: {
      margin: 5,
      padding: 2,
      border: 'solid 1px',
      borderRadius: '5px',
      width: 150,
      borderColor: 'black',
    },
  })();

type ComponentProps = ReturnType<typeof mapStateToProps>;
type ActionProps = typeof mapDispatchToProps;

type PropsType = ComponentProps & ActionProps;
const TweetForm: React.SFC<PropsType> = (props: PropsType) => {
  const classes = useStyles();
  const lightTheme = customTheme('light');
  const darkTheme = customTheme('dark');

  const [themeMode, setthemeMode] = React.useState(props.theme.mode);

  const handleChange = (event: any) => {
    setthemeMode(event.target.value);
    console.log(event.target.value);
    props.updateTheme(event.target.value);
  };

  return (
    <Paper className={classes.root}>
      {/* テーマ設定 */}
      <FormControl>
        <FormLabel id="demo-row-radio-buttons-group-label">テーマ</FormLabel>
        <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group" value={themeMode} onChange={handleChange}>
          <div className={classes.controlButton} style={{ backgroundColor: lightTheme.palette.background.default }}>
            <FormControlLabel value="light" control={<Radio />} label="light" style={{ width: '100%', color: lightTheme.palette.text.primary }} />
          </div>
          <div className={classes.controlButton} style={{ backgroundColor: darkTheme.palette.background.default }}>
            <FormControlLabel value="dark" control={<Radio />} label="dark" style={{ width: '100%', color: darkTheme.palette.text.primary }} />
          </div>
        </RadioGroup>
      </FormControl>
    </Paper>
  );
};

// state
const mapStateToProps = (state: RootState) => {
  return {
    theme: state.reducer.theme,
  };
};

// action
const mapDispatchToProps = {
  updateTheme: actions.updateTheme,
};

export default connect(mapStateToProps, mapDispatchToProps)(TweetForm);
