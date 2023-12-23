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
} from '@mui/material';

// _mock_
import { _userList } from '../../_mock';

// components

// import Iconify from '../../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
// sections
import ListToolbar from './ListToolbar';
import ListHead from './ListHead';
import uuidv4 from '../../utils/uuidv4';
import SimilarityList from './Similarity/SimilarityList';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'MainSubject', label: 'Main Subject', alignRight: false },
  { id: 'SecondarySubject', label: 'Secondary Subject', alignRight: false },
  { id: 'Links', label: 'Links', alignRight: false },
  { id: 'Similarity', label: 'Similarity', alignRight: false },
];

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function SearchList({ subjects }) {
  const theme = useTheme();
  const [comparedList, setComparedList] = useState([]);

  const [isGroupBy, setIsGroupBy] = useState(false);

  const [comparePercentage, setComparePercentage] = useState(50);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const getSimilarity = ({ mainOrganics, subjectOrganics }) => {
    return subjectOrganics.reduce((accumulator, currentValue) => {
      let newAccumulator = accumulator;
      mainOrganics.forEach((mainOrganic) => {
        if (mainOrganic?.link === currentValue?.link) {
          newAccumulator++;
        }
      });
      return newAccumulator;
    }, 0);
  };

  useEffect(() => {
    if (subjects?.secondarySubjects?.length && typeof subjects?.mainSubject === 'object') {
      const { secondarySubjects, mainSubject } = subjects;
      setComparedList(
        secondarySubjects.map((items, index) => {
          const Similarity = getSimilarity({ mainOrganics: mainSubject.organic, subjectOrganics: items?.organic });
          return {
            id: uuidv4(),
            MainSubject: mainSubject?.searchParameters?.q,
            SecondarySubject: items?.searchParameters?.q,
            Links: {
              MainOrganicsCount: mainSubject?.organic?.length,
              SubjectOrganicCount: items?.organic?.length,
              Similarity,
            },
            SimilarityPercentage: Math.round((100 / mainSubject?.organic?.length) * Similarity),
          };
        })
      );
      setPage(0);
    }
  }, [subjects]);

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
    <Card sx={{ width: '65%', height: 1 }}>
      <CardContent>
        {isGroupBy ? (
          <SimilarityList
            subjects={subjects}
            comparedList={comparedList}
            isGroupBy={isGroupBy}
            comparePercentage={comparePercentage}
            setComparePercentage={setComparePercentage}
            setIsGroupBy={setIsGroupBy}
          />
        ) : (
          <>
            <ListToolbar
              mainSubject={subjects?.mainSubject}
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
                <Table>
                  <ListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={filteredItems.length}
                    onRequestSort={handleRequestSort}
                  />
                  <TableBody>
                    {filteredItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const { id, Links, MainSubject, SecondarySubject, SimilarityPercentage } = row;

                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          role="checkbox"
                          sx={{ backgroundColor: theme.palette.grey[200] }}
                        >
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
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredItems.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(e, page) => setPage(page)}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
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
    return array.filter((list) => list.SecondarySubject.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}
