import { useEffect } from 'react';
import { useAppDispatch } from './redux';
import { getGates, checkBackendAvailability } from '../api/gatesApi';
import { 
  setGatesAction, 
  setLoadingAction, 
  setErrorAction,
  setUseMockAction 
} from '../store/slices/gatesSlice';
import { useAppSelector } from './redux';

export const useGatesData = () => {
  const dispatch = useAppDispatch();
  const searchTerm = useAppSelector((state) => state.filters.searchTerm);

  // Функция для определения режима работы
  const determineMode = async () => {
    const isBackendAvailable = await checkBackendAvailability();
    dispatch(setUseMockAction(!isBackendAvailable));
    return !isBackendAvailable;
  };

  const fetchGates = async (filterTitle: string = '') => {
    dispatch(setLoadingAction(true));
    dispatch(setErrorAction(null));
    
    try {
      // Определяем режим работы (MOCK или реальный бэкенд)
      const useMock = await determineMode();
      
      console.log(`Используем ${useMock ? 'MOCK' : 'реальный'} режим`);
      
      const data = await getGates(filterTitle);
      dispatch(setGatesAction(Array.isArray(data) ? data : []));
    } catch (err) {
      console.error('Ошибка загрузки гейтов:', err);
      dispatch(setErrorAction('Не удалось загрузить список гейтов'));
      dispatch(setGatesAction([]));
    } finally {
      dispatch(setLoadingAction(false));
    }
  };

  // Автоматическая загрузка при изменении searchTerm
  useEffect(() => {
    fetchGates(searchTerm);
  }, [searchTerm]);

  return { fetchGates };
};