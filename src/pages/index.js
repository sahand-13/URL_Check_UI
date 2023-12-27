import { useRef } from 'react';
import { Box, Card, CardContent, Container, Divider, Typography } from '@mui/material';
import MainCheckURLForm from '../sections/Home/MainCheckURLForm';
import Searched from '../sections/Home/Searched';

export default function Index() {
  const SearchedRef = useRef();
  return (
    <Container maxWidth={'xl'}>
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', alignContent: 'center' }}>
        <Card sx={{ width: '30%', display: 'block', textAlign: 'center', height: 1 }}>
          <CardContent>
            <Typography variant="h4" sx={{ color: (theme) => theme.palette.info.main }}>
              Check URL
            </Typography>

            <Typography variant="caption">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua.
            </Typography>

            <Divider orientation="horizontal" sx={{ my: 2 }} />
            <MainCheckURLForm SearchedRef={SearchedRef} />
          </CardContent>
        </Card>

        <Searched ref={SearchedRef} />
      </Box>
    </Container>
  );
}
