import { extendTheme } from '@mui/joy/styles';

const palette = {
  primary: {
    50: '#fff8e1',
    100: '#ffecb3',
    200: '#ffe082',
    300: '#ffd54f',
    400: '#ffca28',
    500: '#ffc107',
    600: '#ffb300',
    700: '#ffa000',
    800: '#ff8f00',
    900: '#ff6f00',
  },
}

const theme = extendTheme({
  colorSchemes: {
    light: { palette },
    dark: { palette },
  },
  components: {
    JoyButton: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          color: '#663e3c',
          letterSpacing: 'normal',
          fontWeight: theme.vars.fontWeight.md,
          fontFamily: theme.vars.fontFamily.fallback,
          outlineWidth: 0,
          borderRadius: '0.375rem',
          transition:
            'color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out',
          ...(ownerState.size === 'md' && {
            paddingInline: '0.75rem',
            minHeight: 38,
          }),
        }),
      },
    }
  },
});

export default theme;
