import {
  Box,
  Collapse,
  Divider,
  IconButton,
  LinearProgress,
  TableCell,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';

import React, { useState } from 'react';
import Iconify from '../../../components/Iconify';
import CollapseChilds from './CollapseChilds';
import uuidv4 from '../../../utils/uuidv4';

const SimilarityRow = ({ row }) => {
  const { id, GroupName, GroupWords, Rating } = row;
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow
        hover
        key={id}
        tabIndex={-1}
        role="checkbox"
        sx={{
          '& > *': { borderBottom: 'unset' },
          backgroundColor: theme.palette.grey[200],
        }}
      >
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <Iconify icon="iconamoon:arrow-up-2-light" /> : <Iconify icon="iconamoon:arrow-down-2-light" />}
          </IconButton>
        </TableCell>
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="subtitle2" noWrap>
            {GroupName}
          </Typography>
        </TableCell>
        <TableCell align="left">
          <Typography variant="subtitle2">
            {GroupWords.length &&
              GroupWords.map((item, index) => {
                return (
                  <>
                    {item?.Word} {GroupWords.length !== index + 1 && <> - </>}
                  </>
                );
              })}
          </Typography>
        </TableCell>
        <TableCell align="left">
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box sx={{ width: '80%', mr: 1 }}>
              <LinearProgress value={Rating} variant="determinate" />
            </Box>
            <Box sx={{ minWidth: '20%' }}>
              <Typography variant="body2" color="text.secondary">{`${Math.round(Rating)}%`}</Typography>
            </Box>
          </Box>
        </TableCell>

        {/* <TableCell align="left">
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
            <Typography variant="body2" color="text.secondary">{`${Math.round(SimilarityPercentage)}%`}</Typography>
          </Box>
        </Box>
      </TableCell> */}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1, ml: 3, width: 1 }}>
              <CollapseChilds key={uuidv4()} Childs={GroupWords} />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default SimilarityRow;
