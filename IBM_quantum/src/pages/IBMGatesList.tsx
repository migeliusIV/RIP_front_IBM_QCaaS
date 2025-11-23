// src/pages/IBMGatesList.tsx
import { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Spinner,
  Form,
  Badge,
  Image,
  Button,
  Alert
} from 'react-bootstrap';
import { AppNavbar } from '../components/Navbar';
import { GateCard } from '../components/GateCard';
import { getGates, getDraftTaskInfo } from '../api/gatesApi';
import type { IGate, DraftTaskInfo } from '../types/types';
import { MOCK_GATES } from '../api/mock'
import './styles/IBMGatesList.css';

export const IBMGatesList = () => {
  const [gates, setGates] = useState<IGate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [draftTask, setDraftTask] = useState<DraftTaskInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Используем mock-данные, если бэкенд недоступен
  const USE_MOCK = false; // ← измените на true для mock-режима

  const fetchGates = async (filterTitle: string = '') => {
    setLoading(true);
    setError(null);

    try {
      const data = await getGates(filterTitle);
      setGates(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Проверка загрузки задачи:', draftTask?.TaskID);
      console.error('Ошибка загрузки гейтов:', err);
      setError('Не удалось загрузить список гейтов');
      if (USE_MOCK) {
        setGates(MOCK_GATES);
      } else {
        setGates([]);
      }
    } finally {
      // const task = await getDraftTaskInfo();
      // setDraftTask(task);
      // console.info('Проверка загрузки задачи:', task.GatesCount);
      setLoading(false);
    }

    try {
      const task = await getDraftTaskInfo();
      setDraftTask(task);
      console.info('Проверка загрузки задачи:', task.GatesCount);
    } finally {
      console.info('Проверка загрузки задачи:', "жопа");
    }
  };

  useEffect(() => {
    fetchGates();
  }, []);

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    fetchGates(searchTerm);
  };

  const handleAddToTask = async (gateId: number) => {
    if (!draftTask || draftTask.TaskID === 0) {
      alert('Сначала создайте черновик задачи!');
      return;
    }
    try {
      // Здесь можно вызвать API для добавления гейта
      console.log(`Добавление гейта ${gateId} в задачу ${draftTask.TaskID}`);
      // После успешного добавления обновите счётчик
      setDraftTask(prev => prev ? { ...prev, GatesCount: prev.GatesCount + 1 } : null);
    } catch (err) {
      console.error('Ошибка добавления гейта:', err);
    }
  };

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
                    onChange={(e) => setSearchTerm(e.target.value)}
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
                    {draftTask?.GatesCount && draftTask.GatesCount > 0 ? (
                        <a href={`/quantum_task/${draftTask.TaskID}`} className="d-flex align-items-center">
                        <Image
                            src="basket.png"
                            alt="Корзина"
                            width={60}
                            height={60}
                        />
                        {/* Бейдж с количеством */}
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                          {draftTask.GatesCount}
                          <span className="visually-hidden">товаров в корзине</span>
                        </span>
                        </a>
                      ) : (
                        <span style={{ cursor: 'not-allowed' }} className="d-flex align-items-center">
                        <Image
                            src="basket.png"
                            alt="Корзина"
                            width={60}
                            height={60}
                            style={{ opacity: 0.5 }}
                        />
                        </span>
                    )}
                    {/* {draftTask?.GatesCount !== undefined && draftTask.GatesCount > 0 && (
                        <Badge pill bg="secondary" className="cart-indicator">
                        {draftTask.GatesCount}
                        </Badge>
                    )} */}
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
          <Row className="gates-templ">
            <Col xs={12} lg={10}>
                <Row xs={1} md={2} lg={2} xxl={2} className="g-4">
                    {gates.map(gate => (
                        <Col key={gate.ID_gate}>  {/* ← ОБЯЗАТЕЛЬНО! */}
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