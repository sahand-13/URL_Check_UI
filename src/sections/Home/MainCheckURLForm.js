import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
// @mui
import { Stack, Alert, FormLabel, Typography, Divider, Box, Tooltip } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import XLSX from 'sheetjs-style';

// components
import { FormProvider } from '../../components/hook-form';
import axiosInstance from '../../utils/axios';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import UploadField from './UploadField';

// ----------------------------------------------------------------------

export default function MainCheckURLForm({ SearchedRef }) {
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

  const ExpandExcelFiles = async ({ files }) => {
    const SheetsData = new Array();
    for (const item in files) {
      const base64 = await files[item].arrayBuffer();
      const workbook = XLSX.read(base64, { type: 'array' });
      if (workbook?.SheetNames?.length) {
        workbook?.SheetNames.forEach((sheet) => {
          const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
          if (data?.length) {
            const filterData = data.filter((item) => item?.Key);
            if (filterData?.length) {
              SheetsData.push(
                ...filterData.map((item) => {
                  return {
                    Query: item?.Key,
                    Difficulty: item?.Difficulty,
                    SearchRate: item?.SearchRate,
                    organic: item?.organic?.length ? item?.organic.split(',') : [],
                  };
                })
              );
            }
          }
        });
      }
    }
    return SheetsData;
  };
  const onSubmit = async (data) => {
    try {
      const newResponse = await ExpandExcelFiles({ files: data?.files });
      if (newResponse?.length) {
        if (SearchedRef.current) {
          SearchedRef.current.setSubjects({
            SearchedResult: newResponse,
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
            <Typography variant="button" sx={{ width: 1 }}>
              Drop all excel files here Excel should like below
            </Typography>
            <Divider orientation="horizontal" sx={{}} variant="fullWidth" />
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
            <Divider orientation="horizontal" sx={{}} variant="fullWidth" />
          </FormLabel>
          <UploadField name={'files'} setFormValue={setValue} getValues={getValues} />
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
