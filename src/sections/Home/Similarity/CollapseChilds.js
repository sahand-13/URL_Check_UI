import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
// next
// @mui
import { styled, useTheme } from '@mui/material/styles';
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
  Tooltip,
  tooltipClasses,
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
  { ID: 'SecondarySubject', label: 'Secondary Subject', alignRight: false },
  { ID: 'SearchRate', label: 'Search Rate', alignRight: false },
  { ID: 'Links', label: 'Links', alignRight: false },
  { ID: 'Similarity', label: 'Similarity', alignRight: false },
];

// ----------------------------------------------------------------------
const CustomWidthTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 800,
  },
});
// ----------------------------------------------------------------------

export default function CollapseChilds({ Childs, parentData }) {
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
        <TableContainer sx={{ maxWidth: '95%' }}>
          <Table>
            <ListHead
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={newfilteredItems.length}
              onRequestSort={handleRequestSort}
              hasCollapseIcon={false}
            />
            <TableBody>
              {newfilteredItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                debugger;
                const {
                  ID,
                  ParentSearchKey,
                  ParentSearchLinkLength,
                  Key,
                  SearchLinkLength,
                  OrganicList,
                  Similarity,
                  Difficulty,
                  SearchRate,
                  SimilarityLinks,
                } = row;
                return (
                  <TableRow hover Key={ID} tabIndex={-1} role="checkbox">
                    <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="subtitle2" noWrap>
                        {Key}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography variant="subtitle2" noWrap>
                        {SearchRate}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Box sx={{ display: 'flex' }}>
                        <Typography sx={{ display: 'flex' }}>
                          <CustomWidthTooltip
                            sx={{ width: 1000 }}
                            title={
                              <Box sx={{ display: 'block', width: 1 }}>
                                {OrganicList?.length &&
                                  OrganicList?.map((item) => {
                                    return (
                                      <Box
                                        sx={{
                                          m: 1,
                                          textAlign: 'center',
                                          display: 'flex',
                                          justifyContent: 'space-between',
                                          alignItems: 'center',
                                        }}
                                      >
                                        <Typography variant="button" sx={{ mx: 1 }}>
                                          {item}
                                        </Typography>
                                      </Box>
                                    );
                                  })}
                              </Box>
                            }
                          >
                            <div>{ParentSearchLinkLength}</div>
                          </CustomWidthTooltip>
                          <Divider orientation="vertical" sx={{ mx: 1 }} variant="fullWidth" />
                          <CustomWidthTooltip
                            sx={{ width: 1000 }}
                            title={
                              <Box sx={{ display: 'block', width: 1 }}>
                                {OrganicList?.length &&
                                  OrganicList?.map((item) => {
                                    return (
                                      <Box
                                        sx={{
                                          m: 1,
                                          textAlign: 'center',
                                          display: 'flex',
                                          justifyContent: 'space-between',
                                          alignItems: 'center',
                                        }}
                                      >
                                        <Typography variant="button" sx={{ mx: 1 }}>
                                          {item}
                                        </Typography>
                                      </Box>
                                    );
                                  })}
                              </Box>
                            }
                          >
                            <div>{SearchLinkLength}</div>
                          </CustomWidthTooltip>
                          <Divider orientation="vertical" sx={{ mx: 1 }} variant="fullWidth" />
                          <CustomWidthTooltip
                            sx={{ width: 1000 }}
                            title={
                              <Box sx={{ display: 'block', width: 1 }}>
                                {SimilarityLinks?.length &&
                                  SimilarityLinks?.map((item) => {
                                    return (
                                      <Box
                                        sx={{
                                          m: 1,
                                          textAlign: 'center',
                                          display: 'flex',
                                          justifyContent: 'space-between',
                                          alignItems: 'center',
                                        }}
                                      >
                                        <Typography variant="button" sx={{ mx: 1 }}>
                                          {item?.title}
                                        </Typography>
                                        <Typography variant="button" sx={{ mx: 1 }}>
                                          {item?.link}
                                        </Typography>
                                        <Typography variant="button" sx={{ mx: 1, width: 200 }}>
                                          Position: {item?.position}
                                        </Typography>
                                      </Box>
                                    );
                                  })}
                              </Box>
                            }
                          >
                            <div>{SimilarityLinks.length}</div>
                          </CustomWidthTooltip>
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="left">
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Box sx={{ width: '80%', mr: 1 }}>
                          <LinearProgress value={Similarity} variant="determinate" />
                        </Box>
                        <Box sx={{ minWidth: '20%' }}>
                          <Typography variant="body2" color="text.secondary">{`${Similarity}%`}</Typography>
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
      <TablePagination
        sx={{ mx: 15 }}
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={Childs?.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(e, page) => setPage(page)}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
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
