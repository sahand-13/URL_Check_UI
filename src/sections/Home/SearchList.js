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

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'MainSubject', label: 'Main Subject', alignRight: false, width: '15%' },
  { id: 'Difficulty', label: 'Difficulty', alignRight: false, width: '15%' },
  { id: 'RelatedKeys', label: 'Related Keys', alignRight: false },
  { id: 'SearchRate', label: 'Search Rate', alignRight: false, width: '15%' },
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
    if (subjects?.SearchedResult?.length) {
      const { SearchedResult, allImportedDataFromExcel } = subjects;

      const AllComparedGroupKeys = new Array();

      const CombinedData = SearchedResult.reduce((accumulator, currentValue) => {
        const FindInExcelData = allImportedDataFromExcel?.find((x) => x?.Query === currentValue?.searchParameters?.q);
        const newObject = {
          id: uuidv4(),
          SearchKey: currentValue?.searchParameters?.q,
          organic: [...currentValue.organic],
          SimilarityChildrens: [],
          Difficulty: FindInExcelData?.Difficulty || 0,
          SearchRate: FindInExcelData?.SearchRate || 0,
        };
        const SearchKeysArray = new Array(currentValue?.searchParameters?.q);

        SearchedResult.forEach((item) => {
          if (item?.searchParameters?.q !== currentValue?.searchParameters?.q) {
            const intersections = _.intersectionBy(currentValue.organic, item.organic, 'link');
            const SimilarityPercantage = Math.round(
              (intersections.length / (currentValue?.organic?.length + item?.organic?.length - intersections.length)) *
                100
            );
            if (
              SimilarityPercantage >= comparePercentage &&
              intersections?.length &&
              !newObject.SimilarityChildrens.find((item) => item?.SearchKey === item?.searchParameters?.q)
            ) {
              const itemFindInExcelData = allImportedDataFromExcel?.find((x) => x?.Query === item?.searchParameters?.q);
              SearchKeysArray.push(item?.searchParameters?.q);
              newObject.SimilarityChildrens.push({
                id: uuidv4(),
                ParentSearchKey: newObject?.SearchKey,
                ParentSearchLinkLength: currentValue?.organic?.length,
                SearchKey: item?.searchParameters?.q,
                SearchLinkLength: item?.organic?.length,
                organic: [...item?.organic],
                Similarity: intersections?.length,
                SimilarityLinks: intersections,
                Difficulty: itemFindInExcelData?.Difficulty || 0,
                SearchRate: itemFindInExcelData?.SearchRate || 0,
              });
            }
          }
        });
        debugger;
        let IsExistGroup = 0;
        AllComparedGroupKeys.forEach((item) => {
          const isEqual = _.difference(SearchKeysArray, item);
          if (!isEqual.length) {
            IsExistGroup += 1;
          }
        });

        if (!Boolean(IsExistGroup)) {
          AllComparedGroupKeys.push(SearchKeysArray);
          accumulator.push(newObject);
        }

        return accumulator;
      }, []);
      debugger;
      setComparedList(CombinedData);
      setPage(0);
    }
  }, [subjects, comparePercentage]);

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
                  return <RowComponent key={row?.id} row={row} />;
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
