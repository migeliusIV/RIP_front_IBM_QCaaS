import { useEffect } from 'react';
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
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setSearchTermAction } from '../store/slices/filtersSlice';
import { 
  useGates, 
  useGatesLoading, 
  useGatesError, 
  useDraftTask,
  useMockMode,
  incrementGatesCountAction
} from '../store/slices/gatesSlice';
import { useGatesData } from '../hooks/useGatesData';
import './styles/IBMGatesList.css';

export const IBMGatesList = () => {
  const dispatch = useAppDispatch();
  
  // Получаем данные из Redux store
  const gates = useGates();
  const loading = useGatesLoading();
  const error = useGatesError();
  const draftTask = useDraftTask();
  const useMock = useMockMode();
  const searchTerm = useAppSelector((state) => state.filters.searchTerm);
  
  const { fetchGates } = useGatesData();

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    fetchGates(searchTerm);
  };

  const handleSearchChange = (value: string) => {
    dispatch(setSearchTermAction(value));
  };

  const handleAddToTask = (gateId: number) => {
    if (!draftTask || draftTask.TaskID === 0) {
      alert('Сначала создайте черновик задачи!');
      return;
    }
    try {
      console.log(`Добавление гейта ${gateId} в задачу ${draftTask.TaskID}`);
      dispatch(incrementGatesCountAction());
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
          {useMock && (
            <Alert variant="warning" className="mb-3">
              <strong>Режим MOCK:</strong> Используются тестовые данные
            </Alert>
          )}
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
                  onChange={(e) => handleSearchChange(e.target.value)}
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
                        src="http://127.0.0.1:9000/ibm-pictures/img/basket.png"
                        alt="Корзина"
                        width={60}
                        height={60}
                      />
                    </a>
                  ) : (
                    <span style={{ cursor: 'not-allowed' }} className="d-flex align-items-center">
                      <Image
                        src="http://127.0.0.1:9000/ibm-pictures/img/basket.png"
                        alt="Корзина"
                        width={60}
                        height={60}
                        style={{ opacity: 0.5 }}
                      />
                    </span>
                  )}
                  {draftTask?.GatesCount !== undefined && draftTask.GatesCount > 0 && (
                    <Badge pill bg="secondary" className="cart-indicator">
                      {draftTask.GatesCount}
                    </Badge>
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
          <Row className="gates-templ">
            <Col xs={12} lg={10}>
              <Row xs={1} md={2} lg={2} xxl={2} className="g-4">
                {gates.map(gate => (
                  <Col key={gate.ID_gate}>
                    <GateCard 
                      gate={gate} 
                      onAddToTask={() => handleAddToTask(gate.ID_gate)}
                    />
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