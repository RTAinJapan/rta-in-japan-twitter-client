import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
  // MaterialUIのCSSを上書きする
  overrides: {
    MuiGrid: {
      item: {
        padding: 12,
        width: '100%',
      },
    },
    MuiTab: {
      wrapper: {
        whiteSpace: 'nowrap',
      },
    },
  },
  // MaterialUIのCSSのオンオフ切り替える
  props: {},
});
