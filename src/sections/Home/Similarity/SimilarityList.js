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

// components

// import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/SearchNotFound';
// sections
import SimilarityListToolbar from './SimilarityListToolbar';
import SimilarityListHead from './SimilarityListHead';
import uuidv4 from '../../../utils/uuidv4';
import SimilarityRow from './SimilarityRow';
import * as stringSimilarity from 'string-similarity';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'GroupName', label: 'Group Name', alignRight: false },
  { id: 'GroupWords', label: 'Words in group', alignRight: false },
  { id: 'Rating', label: 'Similarity Words Rating', alignRight: false },
];

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function SimilarityList({
  subjects,
  comparedList,
  isGroupBy,
  setIsGroupBy,
  comparePercentage,
  setComparePercentage,
}) {
  const [groupByList, setGroupByList] = useState([]);

  const theme = useTheme();

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    if (comparedList?.length) {
      const Words = comparedList.map((item) => item?.SecondarySubject);
      const Groups = [
        ...Words?.map((item) => {
          return { id: uuidv4(), GroupName: item, GroupWords: [], Rating: 0 };
        }),
      ];
      Words.forEach((item) => {
        const compareWords = stringSimilarity.findBestMatch(item, Words);
        if (compareWords) {
          compareWords?.ratings.forEach((y) => {
            if (y.rating * 100 >= comparePercentage) {
              Groups.forEach((x) => {
                if (item === x?.GroupName) {
                  x.Rating = y.rating * 100;
                  x.GroupWords.push({
                    id: uuidv4(),
                    Word: y?.target,
                    data: comparedList.find((v) => v?.SecondarySubject === y?.target),
                  });
                }
              });
            }
          });
        }
      });

      setGroupByList(Groups);
    }
  }, [comparedList, comparePercentage]);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - groupByList.length) : 0;

  const filteredItems = applySortFilter(groupByList, getComparator(order, orderBy), filterName);
  const isNotFound = !filteredItems.length && Boolean(filterName);

  return (
    <>
      <SimilarityListToolbar
        mainSubject={subjects?.mainSubject}
        comparedList={groupByList}
        filterName={filterName}
        isGroupBy={isGroupBy}
        setIsGroupBy={setIsGroupBy}
        comparePercentage={comparePercentage}
        setComparePercentage={setComparePercentage}
        onFilterName={handleFilterByName}
      />

      <Scrollbar>
        <TableContainer sx={{ minWidth: 1, maxWidth: 800, height: 440, maxHeight: 440 }}>
          <Table sx={{ width: 1 }}>
            <SimilarityListHead
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={filteredItems.length}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {filteredItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                return <SimilarityRow row={row} />;
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
    return array.filter((list) => list.GroupName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}
