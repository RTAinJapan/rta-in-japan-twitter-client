import { colors } from '@mui/material';
import { createTheme } from '@mui/material/styles';

const lighttheme = createTheme({
  // MaterialUIのCSSを上書きする
  components: {
    MuiGrid: {
      styleOverrides: {
        item: {
          padding: 12,
          width: '100%',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        wrapped: {
          whiteSpace: 'nowrap',
        },
      },
    },
  },
});

const darktheme = createTheme({
  // MaterialUIのCSSを上書きする
  components: {
    MuiGrid: {
      styleOverrides: {
        item: {
          padding: 12,
          width: '100%',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        wrapped: {
          whiteSpace: 'nowrap',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#15202B',
          backgroundImage: 'inherit',
        },
      },
    },
    // MuiButtonBase: {
    //   styleOverrides: {
    //     root: {
    //       backgroundColor: '#15202B',
    //     },
    //   },
    // },
  },
  palette: {
    primary: {
      main: colors.blue[800],
    },
    background: {
      default: '#15202B',
    },
    mode: 'dark',
  },
});

const customTheme = (mode: string | null) => {
  if (mode === 'dark') return darktheme;

  return lighttheme;
};

export default customTheme;
