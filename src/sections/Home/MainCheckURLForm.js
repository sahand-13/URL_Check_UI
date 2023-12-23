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
import axios from 'axios';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

export default function MainCheckURLForm({ SearchedRef }) {
  const { enqueueSnackbar } = useSnackbar();
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
    return {
      key: query,
      requests: axiosInstance
        .post(
          'https://google.serper.dev/search',
          JSON.stringify({
            q: query,
            gl: 'ir',
            hl: 'fa',
          }),
          {
            headers: {
              //"X-API-KEY": "17551478abe27e857018d13c0dc71ca29d144c9d",
              'X-API-KEY': '75418c0fcd175f2a64a5b9de50de5275d2e83ed5',
              'Content-Type': 'application/json',
            },
          }
        )
        .catch((error) => enqueueSnackbar(error, { variant: 'warning' })),
    };
  };

  const onSubmit = async (data) => {
    try {
      const Requests = new Array();
      Requests.push(SendRequest(data.primarySubject));
      if (data.secondarySubject) {
        const secondarykeys = data.secondarySubject.split('\n');
        if (secondarykeys.length) {
          secondarykeys.forEach((key) => {
            if (key && key.replace('​', '') !== '') {
              Requests.push(SendRequest(key));
            }
          });
        }
      }
      debugger;

      const response = await axios.all(Requests.map((item) => item.requests));
      const newResponse = [...response.map((item) => item?.data)];
      if (newResponse?.length) {
        const mainRequest = newResponse.find((x) => x.searchParameters.q === data.primarySubject);
        const mainRequestIndex = newResponse.findIndex((item) => item?.searchParameters?.q === data.primarySubject);
        if (SearchedRef.current) {
          SearchedRef.current.setSubjects({
            mainSubject: mainRequest,
            secondarySubjects: newResponse.filter((_, index) => index !== mainRequestIndex),
          });
        }
      }
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
            <RHFTextField
              name="primarySubject"
              placeholder="Your first subject ..."
              size="small"
              inputProps={{ dir: 'auto' }}
            />
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
            <Typography variant="caption">هر کلمه کلیدی را در یک سطر جدید وارد کنید</Typography>
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
