import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

export default function ToggleButton(theme) {
  const style = (color) => ({
    props: { color },
    style: {
      '&:hover': {
        borderColor: alpha(theme.palette[color].main, 0.48),
        backgroundColor: alpha(theme.palette[color].main, theme.palette.action.hoverOpacity),
      },
      '&.Mui-selected': {
        borderColor: alpha(theme.palette[color].main, 0.48),
      },
    },
  });

  return {
    MuiToggleButton: {
      variants: [
        {
          props: { color: 'standard' },
          style: {
            '&.Mui-selected': {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.background.paper,
            },
          },
        },
        style('primary'),
        style('secondary'),
        style('info'),
        style('success'),
        style('warning'),
        style('error'),
      ],
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          borderRadius: theme.shape.borderRadius,
          backgroundColor: theme.palette.background.paper,
          '& .MuiToggleButton-root': {
            margin: 4,
            borderColor: 'transparent !important',
            borderRadius: `${theme.shape.borderRadius}px !important`,
          },
        },
      },
    },
  };
}
