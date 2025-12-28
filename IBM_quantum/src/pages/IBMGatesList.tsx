// src/pages/IBMGatesList.tsx
import { useEffect } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { setSearchTerm } from '../store/slices/filterSlice';
import { 
  fetchGatesList, 
  fetchDraftTaskInfo 
} from '../store/slices/gatesSlice';
import './styles/IBMGatesList.css';

export const IBMGatesList = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const { data: gates, loading, error } = useSelector((state: RootState) => state.gates);
  const draftTask = useSelector((state: RootState) => state.gates.draftTask);
  const searchTerm = useSelector((state: RootState) => state.filter.searchTerm);

  // ✅ Загрузка при монтировании
  useEffect(() => {
    dispatch(fetchGatesList({ title: searchTerm }));
    dispatch(fetchDraftTaskInfo());
  }, [dispatch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(fetchGatesList({ title: searchTerm }));
  };

  return (
    <div className="gates-body">
      <Container fluid className="pt-4">
        <AppNavbar />
        <h1 className="gates-s-t">Выберите однокубитную операцию</h1>

        <Form onSubmit={handleSearchSubmit}>
          <Row className="gates-s-f">
            <Col xs={12}>
              <div className="d-flex align-items-center w-100">
                <Form.Control
                  type="search"
                  placeholder="Введите название гейта"
                  value={searchTerm}
                  onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                  className="gates-s-f input flex-grow-1"
                />
                <Button
                  variant="dark"
                  type="submit"
                  disabled={loading}
                  className="gates-s-f button ms-2"
                >
                  {loading ? 'Поиск...' : 'Найти'}
                </Button>

                {/* ✅ Корзина — обновляется из Redux */}
                <div className="cart-wrapper ms-3">
                  {draftTask && draftTask.services_count > 0 ? (
                    <a 
                      href={`/RIP_SPA/quantum_task/${draftTask.task_id}`} 
                      className="d-flex align-items-center"
                    >
                      <Image 
                        src="/RIP_SPA/basket.png" 
                        alt="Корзина" 
                        width={60} 
                        height={60} 
                      />
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {draftTask.services_count}
                      </span>
                    </a>
                  ) : (
                    <span className="d-flex align-items-center" style={{ opacity: 0.5 }}>
                      <Image 
                        src="/RIP_SPA/basket.png" 
                        alt="Корзина" 
                        width={60} 
                        height={60} 
                      />
                    </span>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </Form>

        {error && <Alert variant="danger" className="my-3">{error}</Alert>}

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