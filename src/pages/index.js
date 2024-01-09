import { Box, Card, Container, Step, StepConnector, StepLabel, Stepper, Typography, styled } from '@mui/material';
import React, { useState } from 'react';
import useSettings from '../hooks/useSettings';
import Iconify from '../components/Iconify';
import { UrlCheckProvider } from '../contexts/UrlCheckContext';
import useURLCheck from '../hooks/useURLCheck';
import MainCheckURLForm from '../sections/UrlCheck/MainCheckURLForm';
import DataSourceStep from '../sections/UrlCheck/DataSourceStep';
import SearchList from '../sections/Home/SearchList';
import { AnimatePresence, m } from 'framer-motion';
import { MotionContainer, varFade } from '../components/animate';
import ResultStep from '../sections/UrlCheck/ResultStep';

const STEPS = ['Upload excel files', 'Select Datasource', 'Result'];

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  top: 10,
  left: 'calc(-50% + 20px)',
  right: 'calc(50% + 20px)',
  '& .MuiStepConnector-line': {
    borderTopWidth: 2,
    borderColor: theme.palette.divider,
  },
  '&.Mui-active, &.Mui-completed': {
    '& .MuiStepConnector-line': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

function QontoStepIcon({ active, completed, icon, selectedDB, ...other }) {
  const IconName = {
    1: 'solar:upload-minimalistic-line-duotone',
    2: 'iconoir:db',
    3: 'uim:grid',
  };
  return (
    <Box
      sx={{
        zIndex: 9,
        width: 24,
        height: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: active ? 'primary.main' : 'text.disabled',
        position: 'relative',
      }}
    >
      {icon === 2 && Boolean(selectedDB.length) && (
        <Typography variant="caption" sx={{ position: 'absolute', top: 0, right: 0, transform: 'translate(0,15px)' }}>
          {selectedDB.length}
        </Typography>
      )}
      <Iconify
        icon={IconName[icon]}
        sx={{ zIndex: 1, width: 20, height: 20, color: active || completed ? 'primary.main' : 'text.disabled' }}
      />
    </Box>
  );
}

function Index() {
  const { activeStep, setActiveStep, selectedDB } = useURLCheck();
  const { themeStretch } = useSettings();
  const isComplete = 1 === STEPS.length;
  return (
    <Container maxWidth="xl">
      <Card sx={{ m: 2 }}>
        <Stepper alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
          {STEPS.map((label, index) => (
            <Step key={label}>
              <StepLabel
                onClick={() => {
                  setActiveStep(index);
                }}
                StepIconComponent={(e) => QontoStepIcon({ ...e, selectedDB })}
                sx={{
                  '& .MuiStepLabel-label': {
                    typography: 'subtitle2',
                    color: 'text.disabled',
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Card>
      <AnimatePresence>
        <MotionContainer>
          {activeStep === 0 && <MainCheckURLForm />}
          {activeStep === 1 && <DataSourceStep />}
          {activeStep === 2 && <ResultStep />}
        </MotionContainer>
      </AnimatePresence>
    </Container>
  );
}

export default UrlCheckProvider(Index);
