import PropTypes from 'prop-types';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Toolbar, Tooltip, IconButton, Typography, InputAdornment, Box, Slider } from '@mui/material';
// components
import Iconify from '../../components/Iconify';
import InputStyle from '../../components/InputStyle';
import * as FileSaver from 'file-saver';
import XLSX from 'sheetjs-style';
import _ from 'lodash';
import { useState } from 'react';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

// ----------------------------------------------------------------------

ListToolbar.propTypes = {
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};

export default function ListToolbar({
  comparedList,
  filterName,
  onFilterName,
  setIsGroupBy,
  isGroupBy,
  comparePercentage,
  setComparePercentage,
}) {
  const theme = useTheme();
  const [value, setValue] = useState(50);
  const isLight = theme.palette.mode === 'light';

  const exportToExcel = async () => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtention = '.xlsx';
    // Create a new workbook and a worksheet
    var workbook = XLSX.utils.book_new();
    var worksheet = XLSX.utils.aoa_to_sheet([['Group', 'Child', 'Group Search Rate', 'Group Difficulty']]);
    // Styles
    const headerStyle = { font: { bold: true, color: 'F83008' } };
    const masterStyle = { font: { bold: true, color: 'F83008' } };
    const detailStyle = { font: { bold: true, color: 'F83008' } };

    // Function to add a row with style
    function addRow(data, style, type) {
      const row = XLSX.utils.aoa_to_sheet([data]);
      XLSX.utils.sheet_add_aoa(worksheet, [data], { origin: -1 });
      const rowNumber = worksheet['!ref'].split(':')[1].slice(1);
      if (type === 'child') {
        if (!worksheet['!rows']) worksheet['!rows'] = [];
        if (!worksheet['!rows'][rowNumber - 1]) worksheet['!rows'][rowNumber - 1] = { hpx: 20 };
        worksheet['!rows'][rowNumber - 1].level = 1 + (worksheet['!rows'][rowNumber - 1].level || 0);
      }

      data.forEach((_, colNumber) => {
        const cellRef = XLSX.utils.encode_cell({ r: rowNumber - 1, c: colNumber });
        if (!worksheet[cellRef]) worksheet[cellRef] = {};
        worksheet[cellRef] = { ...worksheet[cellRef], s: style, w: 300 };
        // Object.assign(worksheet[cellRef], style);
      });
    }

    // Adding master-detail data
    comparedList.forEach((masterRecord, index) => {
      // Add a master record with style
      const DifficultySum = _.max([
        ...masterRecord?.SimilarityChildrens.map((item) => item?.Difficulty),
        masterRecord?.Difficulty,
      ]);
      const SearchRateSum =
        masterRecord?.SimilarityChildrens?.length > 0
          ? masterRecord?.SimilarityChildrens.reduce(
              (acc, current) => acc + current?.SearchRate,
              masterRecord?.SearchRate
            )
          : masterRecord?.SearchRate;
      addRow(
        [masterRecord?.SearchKey, masterRecord?.SimilarityChildrens?.length || '', SearchRateSum, DifficultySum],
        masterStyle,
        'master'
      );

      // Add detail records with style
      if (masterRecord.SimilarityChildrens?.length > 0) {
        masterRecord.SimilarityChildrens.forEach((detailRecord) => {
          addRow(
            ['', detailRecord?.SearchKey, detailRecord?.SearchRate, detailRecord?.Difficulty],
            detailStyle,
            'child'
          );
        });
      }

      // function gruppieren(ws, start_row, end_row) {
      //   debugger;
      //   /* create !rows array if it does not exist */
      //   if (!ws['!rows']) ws['!rows'] = [];
      //   /* loop over every row index */
      //   for (var i = start_row; i <= end_row; ++i) {
      //     /* create row metadata object if it does not exist */
      //     if (!ws['!rows'][i]) ws['!rows'][i] = { hpx: 20 };
      //     /* increment level */
      //     ws['!rows'][i].level = 1 + (ws['!rows'][i].level || 0);
      //   }
      // }
      // gruppieren(ws, index, masterRecord?.length);
      // Add an empty row for readability, if not the last record
    });

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'MasterDetail');

    // Write the workbook and initiate download
    // XLSX.writeFile(workbook, filename);
    // const ws = XLSX.utils.json_to_sheet(
    //   comparedList.map((item) => {
    //     const x = XLSX.utils.json_to_sheet(
    //       item?.SimilarityChildrens.map((x) => {
    //         return {
    //           Group: x?.SearchKey,
    //           'Search Rate': x?.SearchRate,
    //           Difficulty: x?.Difficulty,
    //         };
    //       })
    //     );

    //     debugger;
    //     return {
    //       Group: item?.SearchKey,
    //       'Search Rate': item?.SimilarityChildrens.reduce(
    //         (acc, current) => acc + current?.SearchRate,
    //         item?.SearchRate
    //       ),

    //       Difficulty: item?.SimilarityChildrens.reduce((acc, current) => acc + current?.Difficulty, item?.Difficulty),
    //     };
    //   }),
    //   { header: ['Group', 'Search Rate', 'Difficulty', 'Childs']}
    // );
    // const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, 'data' + fileExtention);
  };

  return (
    <RootStyle>
      <InputStyle
        stretchStart={240}
        size="small"
        value={filterName}
        onChange={(event) => onFilterName(event.target.value)}
        placeholder="Search subject..."
        inputProps={{ dir: 'auto' }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          ),
        }}
      />
      <Box sx={{ width: '20%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Slider
          defaultValue={comparePercentage}
          onChange={(e) => setValue(e.target.value)}
          aria-label="Default"
          valueLabelFormat={(e) => `${e}% Similarity`}
          valueLabelDisplay="auto"
          onChangeCommitted={(e) => {
            setComparePercentage(value);
          }}
        />
        <Tooltip placement="top" title="Export to excel">
          <IconButton onClick={() => exportToExcel()}>
            <Iconify icon={'vscode-icons:file-type-excel'} />
          </IconButton>
        </Tooltip>
      </Box>
    </RootStyle>
  );
}
