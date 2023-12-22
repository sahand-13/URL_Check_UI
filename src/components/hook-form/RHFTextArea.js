import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField, TextareaAutosize, styled } from '@mui/material';

// ----------------------------------------------------------------------
const Textarea = styled(TextareaAutosize)(
  ({ theme }) => `
  backgroundColor: ${theme.palette.grey[500_12]};
  &:hover {
    backgroundColor: ${theme.palette.grey[500_16]};
  }

  &.Mui-disabled {
    backgroundColor: ${theme.palette.action.disabledBackground};
  }
      width: 100%;
      min-width: 100%;
      max-width: 100%;
      font-family: 'IBM Plex Sans', sans-serif;
      font-size: 0.875rem;
      font-weight: 400;
      line-height: 1.5;
      padding: 8px 12px;
      border-radius: 8px;
      background: ${'#fff'};
      box-shadow: 0px 1px 1px ${theme.palette.background.paper};
      &:focus {
        backgroundColor: ${theme.palette.action.focus};
      }
      &::placeholder  {
        opacity: 1;
        color: ${theme.palette.text.disabled};
      }
      // firefox
      &:focus-visible {
        backgroundColor: ${theme.palette.action.focus};
      }
    `
);

// ----------------------------------------------------------------------

RHFTextArea.propTypes = {
  name: PropTypes.string,
};

export default function RHFTextArea({ name, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Textarea {...field} fullWidth error={!!error} helperText={error?.message} {...other} />
      )}
    />
  );
}
