import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axios';
import { Box, Button, Card, CircularProgress, IconButton, Stack, Typography } from '@mui/material';
import Iconify from '../../components/Iconify';

const ResultStep = () => {
  const [Datasource, setDataSource] = useState();
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get('/api/excel/exports')
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

  const handleDownload = (item) => {
    debugger;
    axiosInstance.get(`/api/excel/Download`, { params: { FileName: item }, responseType: 'blob' }).then((response) => {
      debugger;
      var filename = '';
      var disposition = response.headers['content-disposition'];
      if (disposition && disposition.indexOf('attachment') !== -1) {
        var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        var matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      }
      // saveAs(response.data);
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };
  const deleteFile = (fileName) => {
    debugger;
    axiosInstance.delete(`/api/excel/Exports`, { params: { FileName: fileName } }).then(() => {
      setDataSource((pervious) => pervious.filter((item) => item !== fileName));
    });
  };
  return (
    <Box sx={{ display: 'flex' }}>
      <Card sx={{ width: '50%', mx: 'auto' }}>
        <Stack sx={{ p: 3 }} spacing={1} justifyContent={'center'}>
          {loading && (
            <Box sx={{ textAlign: 'center', width: 1 }}>
              <CircularProgress />
            </Box>
          )}

          {!loading &&
            Boolean(Datasource?.length) &&
            Datasource.map((item) => {
              return (
                <Box sx={{ width: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div></div>
                  <Button onClick={() => handleDownload(item)}>{item}</Button>
                  <IconButton
                    sx={{ width: 50, height: 50 }}
                    onClick={() => {
                      deleteFile(item);
                    }}
                  >
                    <Iconify icon="lets-icons:close-ring-duotone" />
                  </IconButton>
                </Box>
              );
            })}
          {!loading && !Boolean(Datasource?.length) && (
            <Typography sx={{ textAlign: 'center' }} variant="h5">
              There is no excel please generate some
            </Typography>
          )}
        </Stack>
      </Card>
      <IconButton
        sx={{ width: 50, height: 50 }}
        onClick={() => {
          setRefresh((pervious) => !pervious);
        }}
      >
        <Iconify icon="solar:refresh-bold-duotone" />
      </IconButton>
    </Box>
  );
};

export default ResultStep;
