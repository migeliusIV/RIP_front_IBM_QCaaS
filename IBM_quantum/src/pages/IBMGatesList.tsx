// src/pages/IBMGatesList.tsx
import { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Spinner,
  Form,
  Image,
  Button,
  Alert
} from 'react-bootstrap';
import { AppNavbar } from '../components/Navbar';
import { GateCard } from '../components/GateCard';
import { getGates, getDraftTaskInfo } from '../api/gatesApi';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchTerm } from '../store/slices/filterSlice';
import type { RootState } from '../store';
import type { IGate, DraftTaskInfo } from '../types';
import { MOCK_GATES } from '../api/mock'
import './styles/IBMGatesList.css';
//import { Link } from 'react-router-dom';

export const IBMGatesList = () => {
  const [gates, setGates] = useState<IGate[]>([]);
  const [loading, setLoading] = useState(true);
  const [draftTask, setDraftTask] = useState<DraftTaskInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const searchTerm = useSelector((state: RootState) => state.filter.searchTerm);
  /*
  //const [searchTerm, setSearchTerm] = useState('');
  // Отладка Redux
  useEffect(() => {
    console.log('Redux store state:', store.getState());
    console.log('Search term from Redux:', searchTerm);
  }, [searchTerm]);
  */
  // Используем mock-данные, если бэкенд недоступен
  const USE_MOCK = false;

  const fetchGates = async (filterTitle: string = '') => {
    setLoading(true);
    setError(null);

    try {
      const data = await getGates(filterTitle);
      setGates(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Ошибка загрузки гейтов:', err);
      setError('Не удалось загрузить список гейтов');
      if (USE_MOCK) {
        setGates(MOCK_GATES);
      } else {
        setGates([]);
      }
    } finally {
      setLoading(false);
    };

    try {
      const task = await getDraftTaskInfo();
      setDraftTask(task);
      console.info('Проверка загрузки задачи:', task.services_count);
    } catch (err) {
      console.error('Ошибка загрузки информации о задаче:', err);
    }
  };
  
  const fetchDraftTask = async () => {
    try {
      const task = await getDraftTaskInfo();
      setDraftTask(task);
      console.info('Проверка загрузки задачи:', task);
    } catch (err) {
      console.error('Ошибка загрузки информации о задаче:', err);
    }
  };
  

  useEffect(() => {
    fetchGates();
    fetchDraftTask();
  }, []);

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    fetchGates(searchTerm);
  };
/*
  const handleAddToTask = async (gateId: number) => {
    if (!draftTask || draftTask.TaskID === 0) {
      alert('Сначала создайте черновик задачи!');
      return;
    }
    try {
      console.log(`Добавление гейта ${gateId} в задачу ${draftTask.TaskID}`);
      // После успешного добавления обновите счётчик
      setDraftTask(prev => prev ? { ...prev, GatesCount: prev.GatesCount + 1 } : null);
    } catch (err) {
      console.error('Ошибка добавления гейта:', err);
    }
  };
*/
  return (
    <div className="gates-body">
      <Container fluid className="pt-4">
        <AppNavbar />
        <div>
          <h1 className="gates-s-t">Выберите однокубитную операцию</h1>
        </div>

        <Form onSubmit={handleSearchSubmit}>
          <Row className="gates-s-f">
            <Col xs={12}>
              <div className="d-flex align-items-center w-100">
                 {/* Поле поиска */}
                  <Form.Control
                  type="search"
                  placeholder="Введите название гейта"
                  value={searchTerm}
                  onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                  className="gates-s-f input flex-grow-1"
                  />
                  
                  {/* Кнопка поиска */}
                  <Button
                  variant="dark"
                  type="submit"
                  disabled={loading}
                  className="gates-s-f button"
                  style={{ flexShrink: 0 }}
                  >
                  {loading ? 'Поиск...' : 'Найти'}
                  </Button>
                
                  {/* Корзина */}
                    <div className="cart-wrapper">
                    {draftTask?.services_count && draftTask.services_count > 0 ? (
                        <a href={`/RIP_SPA/quantum_task/${draftTask.task_id}`} className="d-flex align-items-center">
                        <Image
                            src="/RIP_SPA/basket.png"
                            alt="Корзина"
                            width={60}
                            height={60}
                        />
                        {/* Бейдж с количеством */}
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                          {draftTask.services_count}
                          <span className="visually-hidden">товаров в корзине</span>
                        </span>
                        </a>
                      ) : (
                        <span style={{ cursor: 'not-allowed' }} className="d-flex align-items-center">
                        <Image
                            src="/RIP_SPA/basket.png"
                            alt="Корзина"
                            width={60}
                            height={60}
                            style={{ opacity: 0.5 }}
                        />
                        </span>
                    )}
                </div>
              </div>
            </Col>
          </Row>
        </Form>

        {error && <Alert variant="danger">{error}</Alert>}

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Row className="justify-content-center">
            <Col xs={12} lg={10}>
              <Row xs={1} md={2} lg={2} xxl={2} className="g-4">
                {gates.map(gate => (
                  <Col key={gate.ID_gate}>
                    <GateCard gate={gate} />
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};