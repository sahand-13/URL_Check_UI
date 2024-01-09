// form
import { useForm } from 'react-hook-form';
// @mui
import { Stack, Alert, FormLabel, Typography, Divider, Box, Tooltip, Card, LinearProgress } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// components
import { FormProvider } from '../../components/hook-form';
import axiosInstance from '../../utils/axios';
import { useSnackbar } from 'notistack';
import UploadField from '../Home/UploadField';
import useURLCheck from '../../hooks/useURLCheck';
import { useState } from 'react';

// ----------------------------------------------------------------------

export default function MainCheckURLForm({ SearchedRef }) {
  const { setActiveStep } = useURLCheck();
  const { enqueueSnackbar } = useSnackbar();
  const [progress, setProgress] = useState(0);
  const defaultValues = {
    files: [],
  };

  const methods = useForm({
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = methods;

  const onProgress = (progressEvent) => {
    // debugger;
    // const totalLength = progressEvent.lengthComputable
    //   ? progressEvent.total
    //   : progressEvent.target.getResponseHeader('content-length') ||
    //     progressEvent.target.getResponseHeader('x-decompressed-content-length');

    // if (totalLength !== null) {
    setProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
    // }
  };

  const onSubmit = async (data) => {
    try {
      if (data?.files.length) {
        const formData = new FormData();
        data?.files.forEach((file) => {
          formData.append('Files', file);
        });
        axiosInstance
          .post('/api/Excel', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: onProgress,
          })
          .then((response) => {
            if (response?.data?.succeeded) {
              setProgress(0);
              setActiveStep((pervious) => pervious + 1);
              enqueueSnackbar(response?.data?.message);
            } else {
              setProgress(0);
              enqueueSnackbar('somthing went wrong', { variant: 'error' });
            }
          })
          .catch(() => {
            setProgress(0);
            enqueueSnackbar('somthing went wrong', { variant: 'error' });
          });
      }
      if (!data.files.length) {
        setActiveStep((pervious) => pervious + 1);
      }
    } catch (error) {
      console.error(error);
      reset();
    }
  };

  return (
    <Card sx={{ m: 2, maxWidth: '50%', mx: 'auto' }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack sx={{ p: 3 }} spacing={3} justifyContent={'center'}>
          {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}
          {Boolean(progress) && <LinearProgress variant="determinate" value={progress} />}
          <Stack spacing={2}>
            <FormLabel sx={{ mx: 1, textAlign: 'center' }}>
              <Typography variant="overline" sx={{ width: 1 }}>
                Upload files or next
              </Typography>
            </FormLabel>
            <Stack spacing={5}>
              <FormLabel sx={{ mx: 1, textAlign: 'center' }}>
                <Divider orientation="horizontal" sx={{ maxWidth: 500, mx: 'auto' }} variant="fullWidth" />
                <Box sx={{ display: 'flex', width: 1, height: 30, justifyContent: 'center', alignItems: 'center' }}>
                  <Divider orientation="vertical" sx={{ mx: 1 }} variant="fullWidth" />
                  <Tooltip title="Search key column">
                    <Typography>Key</Typography>
                  </Tooltip>
                  <Divider orientation="vertical" sx={{ mx: 2 }} variant="fullWidth" />
                  <Tooltip title="Difficulty column Range between  0 - 100">
                    <Typography>Difficulty</Typography>
                  </Tooltip>
                  <Divider orientation="vertical" sx={{ mx: 2 }} variant="fullWidth" />
                  <Tooltip title="SearchRate column type should be number">
                    <Typography>SearchRate</Typography>
                  </Tooltip>
                  <Divider orientation="vertical" sx={{ mx: 2 }} variant="fullWidth" />
                  <Tooltip
                    title={
                      <>
                        Links column values should be like below <br />
                        link1 , link2 , link3 , .....{' '}
                      </>
                    }
                  >
                    <Typography>organic</Typography>
                  </Tooltip>

                  <Divider orientation="vertical" sx={{ mx: 1 }} variant="fullWidth" />
                </Box>
                <Divider orientation="horizontal" sx={{ maxWidth: 500, mx: 'auto' }} variant="fullWidth" />
              </FormLabel>
            </Stack>
            <Stack sx={{ justifyContent: 'center', textAlign: 'center' }}>
              <UploadField name={'files'} setFormValue={setValue} getValues={getValues} />
            </Stack>
          </Stack>
          <Divider orientation="horizontal" sx={{ my: 2 }} />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <LoadingButton fullWidth size="small" variant="outlined" onClick={() => reset()}>
              Clear
            </LoadingButton>
            <LoadingButton fullWidth size="small" type="submit" variant="contained" loading={isSubmitting}>
              Next
            </LoadingButton>
          </Stack>
        </Stack>
      </FormProvider>
    </Card>
  );
}
