import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
// @mui
import { Stack, Alert, FormLabel, Typography, Divider, Box } from '@mui/material';
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
  const { enqueueSnackbar } = useSnackbar();

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

  const SendRequest = (query) => {
    return {
      key: query,
      requests: axiosInstance
        .post('https://google.serper.dev/search', JSON.stringify(query), {
          headers: {
            'X-API-KEY': 'a27950df8eb58b139b3c9d9e8bb1ff956ff1be0e',
            'Content-Type': 'application/json',
          },
        })
        .catch((error) => enqueueSnackbar(error, { variant: 'warning' })),
    };
  };

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
                  return { Query: item?.Key, Difficulty: item?.Difficulty, SearchRate: item?.SearchRate };
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
    const filesData = await ExpandExcelFiles({ files: data?.files });

    const Requests = new Array();

    const chunkSize = 100;

    for (let i = 0; i < filesData.length; i += chunkSize) {
      const chunk = filesData.slice(i, i + chunkSize);
      Requests.push(
        SendRequest(
          chunk.reduce(
            (accumulator, currentValue) => accumulator.concat({ q: currentValue?.Query, gl: 'ir', hl: 'fa' }),
            []
          )
        )
      );
    }

    try {
      const response = await axios.all(Requests.map((item) => item.requests));
      const newResponse = response.reduce((accumulator, currentValue) => {
        return (accumulator = [...accumulator, ...currentValue.data]);
      }, []);
      if (newResponse?.length) {
        if (SearchedRef.current) {
          SearchedRef.current.setSubjects({
            SearchedResult: newResponse,
            allImportedDataFromExcel: filesData,
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
            <Divider orientation="horizontal" sx={{ mx: 6 }} variant="fullWidth" />
            <Box sx={{ display: 'flex', width: 1, height: 30, justifyContent: 'center', alignItems: 'center' }}>
              <Divider orientation="vertical" sx={{ mx: 1 }} variant="fullWidth" />
              Key
              <Divider orientation="vertical" sx={{ mx: 2 }} variant="fullWidth" />
              Difficulty
              <Divider orientation="vertical" sx={{ mx: 2 }} variant="fullWidth" />
              SearchRate
              <Divider orientation="vertical" sx={{ mx: 1 }} variant="fullWidth" />
            </Box>
            <Divider orientation="horizontal" sx={{ mx: 6 }} variant="fullWidth" />
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
