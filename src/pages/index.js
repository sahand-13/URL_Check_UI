import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, Card, CardContent, Container, Divider, TextareaAutosize, Typography, styled } from '@mui/material';
import MainCheckURLForm from '../sections/Home/MainCheckURLForm';
import SearchList from '../sections/Home/SearchList';

export default function Index() {
  return (
    <Container maxWidth={'xl'}>
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', alignContent: 'center' }}>
        <Card sx={{ width: '30%', display: 'block', textAlign: 'center' }}>
          <CardContent>
            <Typography variant="h4" sx={{ color: (theme) => theme.palette.info.main }}>
              Check URL
            </Typography>

            <Typography variant="caption">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua.
            </Typography>
            <Divider orientation="horizontal" sx={{ my: 2 }} />
            <MainCheckURLForm />

            {/* <Textarea aria-label="minimum height" minRows={3} placeholder="Minimum 3 rows" /> */}
          </CardContent>
        </Card>
        <Card sx={{ width: '65%' }}>
          <SearchList />
        </Card>
      </Box>
    </Container>
  );
}
