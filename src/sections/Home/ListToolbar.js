import PropTypes from 'prop-types';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Toolbar, Tooltip, IconButton, Typography, InputAdornment, Box, Slider } from '@mui/material';
// components
import Iconify from '../../components/Iconify';
import InputStyle from '../../components/InputStyle';
import * as FileSaver from 'file-saver';
import XLSX from 'sheetjs-style';

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
  mainSubject,
  comparedList,
  filterName,
  onFilterName,
  setIsGroupBy,
  isGroupBy,
  comparePercentage,
  setComparePercentage,
}) {
  const theme = useTheme();

  const isLight = theme.palette.mode === 'light';

  const exportToExcel = async () => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtention = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(
      comparedList.map((item) => {
        return {
          'Primary Subject': item?.MainSubject,
          'Secondary Subject': item?.SecondarySubject,
          Links: `[${item?.Links?.MainOrganicsCount} - ${item?.Links?.SubjectOrganicCount} - ${item?.Links?.Similarity}]`,
          'Similarity Percentage': item?.SimilarityPercentage,
        };
      })
    );
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, (mainSubject?.searchParameters?.q ?? 'data') + fileExtention);
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

      <Box>
        <Tooltip placement="top" title="Turn on grouping">
          <IconButton onClick={() => setIsGroupBy((pervious) => !pervious)}>
            <Iconify
              color={isGroupBy ? theme.palette.primary.main : theme.palette.text.primary}
              icon={'codicon:group-by-ref-type'}
            />
          </IconButton>
        </Tooltip>
        <Tooltip placement="top" title="Export to excel">
          <IconButton onClick={() => exportToExcel()}>
            <Iconify icon={'vscode-icons:file-type-excel'} />
          </IconButton>
        </Tooltip>
        {isGroupBy && (
          <Box sx={{ width: 1, display: 'flex' }}>
            <Slider
              defaultValue={comparePercentage}
              onChange={(e) => setComparePercentage(e.target.value)}
              aria-label="Default"
              valueLabelFormat={(e) => `${e}% Similarity`}
              valueLabelDisplay="auto"
            />
          </Box>
        )}
      </Box>
    </RootStyle>
  );
}
