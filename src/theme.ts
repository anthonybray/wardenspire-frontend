// ########################################
// ############ MUI theme (brand dark) ##############
// ########################################

import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0f1012', // matches color-surface-3
      paper: '#272932', // matches color-surface-2
    },
    primary: {
      main: '#37ebf3', // Accent Primary
      contrastText: '#0b1d1e',
    },
    secondary: {
      main: '#9370db', // Option button
    },
    error: {
      main: '#cb1dcd', // Delete
    },
    divider: '#3e2d60',
    text: {
      primary: '#efefef',
      secondary: '#d1c5c0',
    },
  },
  typography: {
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          boxShadow: '0 6px 16px rgba(0,0,0,0.35)',
          '&:hover': {
            boxShadow: '0 8px 20px rgba(0,0,0,0.45)',
          },
        },
        containedSecondary: {
          backgroundColor: '#9370db',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#a77cf0',
          },
        },
        containedPrimary: {
          backgroundColor: '#37ebf3',
          color: '#0b1d1e',
          '&:hover': {
            backgroundColor: '#6febf2',
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
        fullWidth: true,
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#272932',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '&:hover fieldset': {
              borderColor: '#37ebf3',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#37ebf3',
              boxShadow: '0 0 0 3px rgba(55,235,243,0.3)',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#d1c5c0',
          },
          '& .MuiInputBase-input': {
            color: '#eeeeee',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          backgroundColor: '#272932',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#272932',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '24px 24px !important',
        },
      },
    },
  },
})

export default theme

