import { Box, Collapse, IconButton, LinearProgress, TableCell, TableRow, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import Iconify from '../../components/Iconify';
import _ from 'lodash';
import CollapseChilds from './Similarity/CollapseChilds';

const RowComponent = ({ row }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const { id, organic, SimilarityChildrens, SearchRate, SearchKey, Difficulty } = row;
  const SimilarityJoin =
    SimilarityChildrens?.length > 0 &&
    _.join(
      SimilarityChildrens?.map((item) => item?.SearchKey),
      ' - '
    );
  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" sx={{ backgroundColor: theme.palette.grey[200] }}>
        {SimilarityChildrens?.length > 0 ? (
          <TableCell>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <Iconify icon="iconamoon:arrow-up-2-light" /> : <Iconify icon="iconamoon:arrow-down-2-light" />}
            </IconButton>
          </TableCell>
        ) : (
          <TableCell padding="checkbox"></TableCell>
        )}
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="subtitle2" noWrap>
            {SearchKey}
          </Typography>
        </TableCell>
        <TableCell align="left">
          <Typography variant="subtitle2" noWrap>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Box sx={{ width: '60%' }}>
                <LinearProgress value={Difficulty} variant="determinate" />
              </Box>
              <Box sx={{ minWidth: '20%' }}>
                <Typography variant="body2" color="text.secondary">{`${Math.round(Difficulty)}%`}</Typography>
              </Box>
            </Box>
          </Typography>
        </TableCell>
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="subtitle2">{Boolean(SimilarityChildrens?.length) && SimilarityJoin}</Typography>
        </TableCell>
        <TableCell align="left">{SearchRate}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1, ml: 3, width: 1 }}>
              <CollapseChilds Childs={SimilarityChildrens} parentData={row} />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default RowComponent;
