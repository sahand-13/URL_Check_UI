import * as Yup from 'yup';
import { useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
// @mui
import { Stack, IconButton, InputAdornment, Alert, FormLabel, Typography, Divider } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// components
import Iconify from '../../components/Iconify';
import { FormProvider, RHFTextField } from '../../components/hook-form';
import RHFTextArea from '../../components/hook-form/RHFTextArea';
import axiosInstance from '../../utils/axios';

// ----------------------------------------------------------------------

export default function MainCheckURLForm() {
  const RegisterSchema = Yup.object().shape({
    primarySubject: Yup.string().required('First subject is required'),
    secondarySubject: Yup.string(),
  });

  const defaultValues = {
    primarySubject: '',
    secondarySubject: '',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const SendRequest = (query) => {
    axiosInstance.post(
      'https://google.serper.dev/search',
      JSON.stringify({
        q: query,
        gl: 'ir',
        hl: 'fa',
      }),
      {
        headers: {
          //"X-API-KEY": "17551478abe27e857018d13c0dc71ca29d144c9d",
          'X-API-KEY': 'ca4539b02b04485b90d1b00d02eef727e699709c',
          'Content-Type': 'application/json',
        },
      }
    );
  };

  const onSubmit = async (data) => {
    try {
      SendRequest(data.primarySubject);
    } catch (error) {
      console.error(error);
      reset();
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <Stack spacing={2}>
          <FormLabel sx={{ mx: 1 }}>
            <Typography variant="button">First subject</Typography>
            <RHFTextField name="primarySubject" placeholder="Your first subject ..." size="small" />
          </FormLabel>
          <FormLabel>
            <Typography variant="button"> Secondary subjects list</Typography>
            <RHFTextArea
              sx={{ mx: 'auto' }}
              minRows={3}
              name="secondarySubject"
              size="small"
              placeholder="Your second subject ..."
            />
            <Typography variant="caption">استفاده کنید Enter بزای ثبت هر کلمه از</Typography>
          </FormLabel>
        </Stack>
        <Divider orientation="horizontal" sx={{ my: 2 }} />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <LoadingButton fullWidth size="small" variant="outlined" onClick={() => reset()}>
            Clear
          </LoadingButton>
          <LoadingButton fullWidth size="small" type="submit" variant="contained" loading={isSubmitting}>
            Search
          </LoadingButton>
        </Stack>
      </Stack>
    </FormProvider>
  );
}
