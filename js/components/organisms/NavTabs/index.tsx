import React from 'react';
import { makeStyles } from '@mui/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Paper from '@mui/material/Paper';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    position: 'sticky',
    backgroundColor: 'white',
    zIndex: 1000,
  },
  hidden: {
    display: 'hidden',
  },
});

type ComponentProps = {
  children: React.ReactNode;
  style: {
    top?: number;
    bottom?: number;
  };
  tabs: {
    label: string;
    icon?: React.ReactElement;
  }[];
};

const NavTabs: React.FC<ComponentProps> = (props) => {
  const classes = useStyles();
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: any) => {
    setTabIndex(newValue);
  };

  const createTab = (tabs: ComponentProps['tabs']) => {
    return tabs.map((item, index) => {
      return <Tab key={index} icon={item.icon} label={item.label} />;
    });
  };

  const createContent = (children: any) => {
    return (
      <div>
        {children.map((child: React.ReactNode, index: number) => {
          if (index === tabIndex) {
            return <div key={`${index}`}>{child}</div>;
          } else {
            return (
              <div key={index} style={{ display: 'none' }}>
                {child}
              </div>
            );
          }
        })}
      </div>
    );
  };

  return (
    <>
      <Paper square className={classes.root} style={{ top: props.style.top, bottom: props.style.bottom }}>
        <Tabs value={tabIndex} onChange={handleChange} variant="fullWidth" indicatorColor="primary" textColor="primary">
          {createTab(props.tabs)}
        </Tabs>
      </Paper>
      {createContent(props.children)}
    </>
  );
};

export default NavTabs;
