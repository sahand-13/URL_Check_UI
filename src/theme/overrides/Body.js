// ----------------------------------------------------------------------

export default function Body(theme) {
  return {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            width: '5px',
            height: '5px',
          },
          '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
            webkitBoxShadow: 'inset 0 0 6px #7635dc',
            borderRadius: '20px',
            backgroundColor: '#F5F5F5',
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            background: '#7635dc',
            borderRadius: '20px',
          },
        },
      },
    },
  };
}
