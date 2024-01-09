import { useContext } from 'react';
import { UrlCheckContext } from '../contexts/UrlCheckContext';

const useURLCheck = () => useContext(UrlCheckContext);

export default useURLCheck;
