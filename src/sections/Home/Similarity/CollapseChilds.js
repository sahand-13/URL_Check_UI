import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
// next
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
} from '@mui/material';

// _mock_

// components

// import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/SearchNotFound';
import ListHead from '../ListHead';
// sections

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'MainSubject', label: 'Main Subject', alignRight: false },
  { id: 'SecondarySubject', label: 'Secondary Subject', alignRight: false },
  { id: 'Links', label: 'Links', alignRight: false },
  { id: 'Similarity', label: 'Similarity', alignRight: false },
];

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function CollapseChilds({ Childs }) {
  const theme = useTheme();

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - Childs.length) : 0;

  const newfilteredItems = applySortFilter(Childs, getComparator(order, orderBy), filterName);
  const isNotFound = !newfilteredItems.length && Boolean(filterName);

  return (
    <>
      <Scrollbar>
        <TableContainer sx={{ minWidth: 750, maxWidth: 750 }}>
          <Table>
            <ListHead
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={newfilteredItems.length}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {newfilteredItems.map((row) => {
                debugger;

                const { id, Links, MainSubject, SecondarySubject, SimilarityPercentage } = row?.data;

                return (
                  <TableRow hover key={id} tabIndex={-1} role="checkbox">
                    <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="subtitle2" noWrap>
                        {MainSubject}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography variant="subtitle2" noWrap>
                        {SecondarySubject}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Box sx={{ display: 'flex' }}>
                        <Typography sx={{ display: 'flex' }}>
                          {Links?.MainOrganicsCount}
                          <Divider orientation="vertical" sx={{ mx: 1 }} variant="fullWidth" />
                          {Links?.SubjectOrganicCount}
                          <Divider orientation="vertical" sx={{ mx: 1 }} variant="fullWidth" />
                          {Links?.Similarity}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="left">
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Box sx={{ width: '80%', mr: 1 }}>
                          <LinearProgress value={SimilarityPercentage} variant="determinate" />
                        </Box>
                        <Box sx={{ minWidth: '20%' }}>
                          <Typography variant="body2" color="text.secondary">{`${Math.round(
                            SimilarityPercentage
                          )}%`}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
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
    </>
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
    return array.filter((list) => list.SecondarySubject.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}
