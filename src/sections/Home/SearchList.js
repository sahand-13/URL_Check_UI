import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
// next
import NextLink from 'next/link';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Card,
  Table,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Divider,
  LinearProgress,
  Box,
  CardContent,
  IconButton,
  CircularProgress,
} from '@mui/material';
// components

// import Iconify from '../../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
// sections
import ListToolbar from './ListToolbar';
import ListHead from './ListHead';
import uuidv4 from '../../utils/uuidv4';
import SimilarityList from './Similarity/SimilarityList';
import _ from 'lodash';
import Iconify from '../../components/Iconify';
import RowComponent from './RowComponent';
import useURLCheck from '../../hooks/useURLCheck';
import axiosInstance from '../../utils/axios';
import { useSnackbar } from 'notistack';
import Pako from 'pako';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'MainSubject', label: 'Main Subject', alignRight: false, width: '15%' },
  { id: 'Difficulty', label: 'Difficulty', alignRight: false, width: '15%' },
  { id: 'RelatedKeys', label: 'Related Keys', alignRight: false },
  { id: 'SearchRate', label: 'Search Rate', alignRight: false, width: '15%' },
];

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function SearchList() {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { selectedDB } = useURLCheck();
  const [comparedList, setComparedList] = useState([]);

  const [isGroupBy, setIsGroupBy] = useState(false);

  const [comparePercentage, setComparePercentage] = useState(50);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get('/api/excel/exceldata', {
        params: { Similarity: comparePercentage, DBNames: JSON.stringify(selectedDB) },
        responseType: 'arraybuffer',
      })
      .then((response) => {
        const uint8Array = new Uint8Array(response.data);

        // Decode the Uint8Array to a string
        const decoder = new TextDecoder('utf-8');
        const decodedData = decoder.decode(uint8Array);

        // Parse the JSON data
        const jsonData = JSON.parse(decodedData);
        setComparedList(jsonData);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);

        enqueueSnackbar('Something went wrong', { variant: 'error' });
      });
  }, [comparePercentage, selectedDB]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - comparedList.length) : 0;

  const filteredItems = applySortFilter(comparedList, getComparator(order, orderBy), filterName);
  const isNotFound = !filteredItems.length && Boolean(filterName);

  return (
    <Card sx={{ width: '95%', height: 1, mx: 'auto' }}>
      <CardContent>
        <ListToolbar
          comparedList={comparedList}
          filterName={filterName}
          isGroupBy={isGroupBy}
          comparePercentage={comparePercentage}
          setComparePercentage={setComparePercentage}
          setIsGroupBy={setIsGroupBy}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ minWidth: 800, height: 440, maxHeight: 440 }}>
            <Table id={'test'}>
              <ListHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={filteredItems.length}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {filteredItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                  return <RowComponent key={row?.ID} row={row} />;
                })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
              {loading && (
                <TableBody>
                  <TableRow>
                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
              {isNotFound && (
                <TableBody>
                  <TableRow>
                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                      <SearchNotFound searchQuery={filterName} />
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </Scrollbar>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredItems.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, page) => setPage(page)}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </CardContent>
    </Card>
  );
}

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    const newArray = array.map((item) => {
      return {
        ...item,
        SimilarityChildrens: item?.SimilarityChildrens.filter(
          (item) => item?.SearchKey.toLowerCase().indexOf(query.toLowerCase()) !== -1
        ),
      };
    });
    return newArray.filter((item) => item?.SimilarityChildrens.length > 0);
  }
  return stabilizedThis.map((el) => el[0]);
}
