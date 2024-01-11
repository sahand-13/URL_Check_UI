import {
  Box,
  Button,
  Card,
  CardActions,
  CircularProgress,
  IconButton,
  Slider,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axios';
import { useSnackbar } from 'notistack';
import useURLCheck from '../../hooks/useURLCheck';
import { LoadingButton } from '@mui/lab';
import Iconify from '../../components/Iconify';

const DataSourceStep = () => {
  const [Datasource, setDataSource] = useState();
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { selectedDB, setSelectedDB, setActiveStep } = useURLCheck();
  const [comparePercentage, setComparePercentage] = useState(50);
  const [keysPercentage, setKeysPercentage] = useState(100);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get('/api/excel')
      .then((response) => {
        if (response.data) {
          setDataSource(response?.data?.data);
          setLoading(false);
        }
      })
      .catch((error) => {
        enqueueSnackbar('Something went wrong', { variant: 'error' });
        setSelectedDB([]);
        setLoading(false);
      });
  }, [refresh]);

  const deleteFile = (fileName) => {
    axiosInstance.delete(`/api/excel/${fileName}`).then(() => {
      setSelectedDB((pervious) => pervious.filter((item) => item !== fileName));
      setDataSource((pervious) => pervious.filter((item) => item !== fileName));
    });
  };

  const handleRequestGenerate = () => {
    if (selectedDB?.length > 0) {
      axiosInstance
        .get('/api/excel/CreateExcel', {
          params: {
            Similarity: comparePercentage,
            DBNames: JSON.stringify(selectedDB),
            KeysComparePercentage: keysPercentage,
          },
        })
        .then((response) => {
          enqueueSnackbar(response.data.data, { variant: 'success', autoHideDuration: null });
        });
    }
  };
  return (
    <Box sx={{ display: 'flex' }}>
      <Card sx={{ width: '50%', display: 'flex', justifyContent: 'center' }}>
        <IconButton
          sx={{ width: 50, height: 50 }}
          onClick={() => {
            setRefresh((pervious) => !pervious);
          }}
        >
          <Iconify icon="solar:refresh-bold-duotone" />
        </IconButton>
        <Stack sx={{ p: 3, width: '85%' }} spacing={3} justifyContent={'center'}>
          {loading && (
            <Box sx={{ textAlign: 'center', width: 1 }}>
              <CircularProgress />
            </Box>
          )}

          {!loading && Boolean(Datasource?.length) && (
            <ToggleButtonGroup
              value={selectedDB}
              onChange={(event, newValue) => {
                setSelectedDB(newValue);
              }}
              sx={{ display: 'block' }}
            >
              {Datasource.map((item) => {
                return (
                  <ToggleButton
                    value={item}
                    sx={{
                      width: '90%',
                      p: 1,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'cener',
                      zIndex: 1,
                      position: 'relative',
                    }}
                  >
                    <Iconify sx={{ mx: 2, width: 15, height: 15 }} icon={'vscode-icons:file-type-excel'} />
                    <Typography variant="caption">{item}</Typography>
                    <IconButton
                      sx={{ position: 'absolute', right: 5, width: 30, height: 30 }}
                      size="small"
                      onClick={() => deleteFile(item)}
                    >
                      <Iconify
                        sx={{ width: 20, height: 20, color: (theme) => theme.palette.error.main }}
                        icon="lets-icons:close-round-duotone"
                      />
                    </IconButton>
                  </ToggleButton>
                );
              })}
            </ToggleButtonGroup>
          )}
          {!loading && !Boolean(Datasource?.length) && (
            <Typography sx={{ textAlign: 'center' }} variant="h5">
              There is no data source please upload some
            </Typography>
          )}
        </Stack>
      </Card>

      <Card sx={{ width: '50%' }}>
        <Stack sx={{ pt: 3 }} spacing={1} justifyContent={'center'}>
          <Box sx={{ m: 2, width: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
            <Typography variant="caption">Similarity </Typography>
            <Slider
              sx={{ width: '75%' }}
              defaultValue={comparePercentage}
              onChange={(e) => setComparePercentage(e.target.value)}
              aria-label="Default"
              valueLabelFormat={(e) => `${e}% Similarity`}
              valueLabelDisplay="auto"
            />
            <Typography variant="caption"> {comparePercentage}%</Typography>
          </Box>
        </Stack>
        <Stack sx={{ p: 1 }} justifyContent={'center'}>
          <Box sx={{ m: 2, width: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
            <Typography variant="caption"> Keys Grouping </Typography>
            <Slider
              sx={{ width: '75%' }}
              defaultValue={keysPercentage}
              onChange={(e) => setKeysPercentage(e.target.value)}
              aria-label="Default"
              valueLabelFormat={(e) => `${e}% Similarity`}
              valueLabelDisplay="auto"
            />
            <Typography variant="caption"> {keysPercentage}%</Typography>
          </Box>
        </Stack>
        <Box sx={{ display: 'flex', justifyContent: 'center', m: 2 }}>
          <LoadingButton
            sx={{ width: '35%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            size="small"
            variant="text"
            onClick={() => {
              handleRequestGenerate();
            }}
            disabled={!Boolean(selectedDB?.length)}
          >
            <Typography>Generate Excel</Typography>
            <Iconify sx={{ mx: 1, width: 15, height: 15 }} icon="material-symbols:step-rounded" />
          </LoadingButton>
        </Box>
      </Card>
    </Box>
  );
};

export default DataSourceStep;
