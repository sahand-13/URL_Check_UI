import React, { createContext, useState } from 'react';

const UrlCheckContext = createContext({
  activeStep: 0,
  selectedDB: [],
  setActiveStep: () => {},
  setSelectedDB: () => {},
});

const UrlCheckProvider = (Component) => () => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedDB, setSelectedDB] = useState([]);

  return (
    <UrlCheckContext.Provider value={{ activeStep, selectedDB, setActiveStep, setSelectedDB }}>
      <Component />
    </UrlCheckContext.Provider>
  );
};

export { UrlCheckContext, UrlCheckProvider };
