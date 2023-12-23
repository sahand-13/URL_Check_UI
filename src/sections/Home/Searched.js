import { forwardRef, useImperativeHandle, useState } from 'react';
import SearchList from './SearchList';

const Searched = forwardRef((_, ref) => {
  const [subjects, setSubjects] = useState({
    mainSubject: null,
    secondarySubjects: null,
  });

  useImperativeHandle(
    ref,
    () => {
      return { setSubjects };
    },
    []
  );
  return <SearchList subjects={subjects} />;
});

export default Searched;
