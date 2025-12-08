// src/pages/QuantumTasksListPage.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { Container, Table, Form, Row, Col, Badge, Spinner, Card, ListGroup, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchTasksList } from '../store/slices/taskSlice';
import { Funnel, PersonFill, ExclamationCircleFill } from 'react-bootstrap-icons';
import type { AppDispatch, RootState } from '../store';
import './styles/QuantumTasksListPage.css';
import { AppNavbar } from '../components/Navbar';

// Статусы из InternalAppHandlerDTORespTasks
const STATUS_DRAFT = 'черновик';
const STATUS_FORMED = 'сформирован';
const STATUS_COMPLETED = 'совершён';
const STATUS_REJECTED = 'отклонён';

const getStatusBadge = (status: string | undefined) => {
  switch (status) {
    case STATUS_DRAFT:
      return <Badge bg="secondary">Черновик</Badge>;
    case STATUS_FORMED:
      return <Badge bg="primary">Сформирована</Badge>;
    case STATUS_COMPLETED:
      return <Badge bg="success">Завершена</Badge>;
    case STATUS_REJECTED:
      return <Badge bg="danger">Отклонена</Badge>;
    default:
      return <Badge bg="light" text="dark">Неизвестно</Badge>;
  }
};

export const QuantumTasksListPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { list, loading } = useSelector((state: RootState) => state.task);
  const { user } = useSelector((state: RootState) => state.user);

  // Фильтры (API-level)
  const [apiFilters, setApiFilters] = useState({
    status: 'all',
    from: '',
    to: '',
  });

  // Фильтр по пользователю (только для модератора)
  const [selectedUserId, setSelectedUserId] = useState<number | 'all'>('all');

  // Short Polling (аналогично коллеге)
  useEffect(() => {
    const loadData = () => dispatch(fetchTasksList(apiFilters));
    loadData();
    const intervalId = setInterval(loadData, 5000);
    return () => clearInterval(intervalId);
  }, [dispatch, apiFilters]);

  // Статистика по пользователям (только модератору)
  const usersStats = useMemo(() => {
    if (!list || !user?.is_admin) return [];
    const stats = new Map<number, { countFormed: number; total: number; name: string }>();
    list.forEach(task => {
      const userId = task.id_user || 0;
      const userName = `Пользователь #${userId}`;
      if (!stats.has(userId)) {
        stats.set(userId, { countFormed: 0, total: 0, name: userName });
      }
      const stat = stats.get(userId)!;
      stat.total += 1;
      if (task.task_status === STATUS_FORMED) {
        stat.countFormed += 1;
      }
    });
    return Array.from(stats.entries()).map(([id, data]) => ({ id, ...data }));
  }, [list, user?.is_admin]);

  // Отфильтрованный список (с учётом модератора)
  const displayedList = useMemo(() => {
    if (!list) return [];
    if (!user?.is_admin) return list;
    if (selectedUserId === 'all') return list;
    return list.filter(task => task.id_user === selectedUserId);
  }, [list, user?.is_admin, selectedUserId]);

  const handleRowClick = (id: number | undefined) => {
    if (id) navigate(`/quantum_task/${id}`);
  };

  const handleApiFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setApiFilters({ ...apiFilters, [e.target.name]: e.target.value });
  };

  return (
    <div className="page-body">
    <AppNavbar />
    <Container fluid className="pt-5 mt-5 px-4">
          <h2 className="fw-bold mb-4 text-center text-secondary">
              {user?.is_admin ? 'Панель квантового системного инженера' : 'Мои квантовые задачи'}
          </h2>

          <Row>
              {/* Левая колонка: фильтр по пользователям (только для модератора) */}
              {user?.is_admin && (
                  <Col lg={3} className="mb-4">
                      <Card className="shadow-sm border-0 h-100">
                          <Card.Header className="bg-danger text-white fw-bold d-flex align-items-center gap-2">
                              <PersonFill /> Пользователи
                          </Card.Header>
                          <ListGroup variant="flush" className="user-filter-list">
                              <ListGroup.Item
                                  action
                                  active={selectedUserId === 'all'}
                                  onClick={() => setSelectedUserId('all')}
                                  className="d-flex justify-content-between align-items-center"
                              >
                                  <span>Все пользователи</span>
                                  <Badge bg="secondary" pill>{list.length}</Badge>
                              </ListGroup.Item>
                              {usersStats.map(userStat => (
                                  <ListGroup.Item
                                      key={userStat.id}
                                      action
                                      active={selectedUserId === userStat.id}
                                      onClick={() => setSelectedUserId(userStat.id)}
                                      className="d-flex justify-content-between align-items-center"
                                  >
                                      <span>{userStat.name}</span>
                                      <div className="d-flex gap-2 align-items-center">
                                          {userStat.countFormed > 0 && (
                                              <ExclamationCircleFill
                                                  className="text-warning blink-icon"
                                                  title="Есть необработанные заявки" />
                                          )}
                                          <Badge bg="light" text="dark" pill>
                                              {userStat.total}
                                          </Badge>
                                      </div>
                                  </ListGroup.Item>
                              ))}
                          </ListGroup>
                      </Card>
                  </Col>
              )}

              {/* Правая колонка: фильтры и таблица */}
              <Col lg={user?.is_admin ? 9 : 12}>
                  {/* Панель фильтров */}
                  <Card className="mb-4 border-0 shadow-sm bg-white">
                      <Card.Body>
                          <Row className="g-3 align-items-end">
                              <Col md={user?.is_admin ? 3 : 4}>
                                  <Form.Label className="fw-bold small text-muted">Статус</Form.Label>
                                  <Form.Select
                                      name="status"
                                      value={apiFilters.status}
                                      onChange={handleApiFilterChange}
                                      size="sm"
                                  >
                                      <option value="all">Все статусы</option>
                                      <option value={STATUS_FORMED}>Сформирована</option>
                                      <option value={STATUS_COMPLETED}>Завершена</option>
                                      <option value={STATUS_REJECTED}>Отклонена</option>
                                  </Form.Select>
                              </Col>
                              <Col md={user?.is_admin ? 3 : 4}>
                                  <Form.Label className="fw-bold small text-muted">Дата от</Form.Label>
                                  <Form.Control
                                      type="date"
                                      name="from"
                                      value={apiFilters.from}
                                      // onChange={handleApiFilterChange}
                                      size="sm" />
                              </Col>
                              <Col md={user?.is_admin ? 3 : 4}>
                                  <Form.Label className="fw-bold small text-muted">Дата до</Form.Label>
                                  <Form.Control
                                      type="date"
                                      name="to"
                                      value={apiFilters.to}
                                        // onChange={handleApiFilterChange}
                                      size="sm" />
                              </Col>
                              {user?.is_admin && (
                                  <Col md={3} className="text-end">
                                      <Button
                                          variant="outline-secondary"
                                          size="sm"
                                          onClick={() => dispatch(fetchTasksList(apiFilters))}
                                      >
                                          Обновить <Funnel />
                                      </Button>
                                  </Col>
                              )}
                          </Row>
                      </Card.Body>
                  </Card>

                  {/* Таблица заявок */}
                  {loading && list.length === 0 ? (
                      <div className="text-center py-5">
                          <Spinner animation="border" variant="danger" />
                      </div>
                  ) : (
                      <div className="table-responsive shadow-sm rounded bg-white">
                          <Table hover className="align-middle mb-0">
                              <thead className="bg-light text-secondary">
                                  <tr>
                                      <th>ID</th>
                                      {user?.is_admin && <th>Пользователь</th>}
                                      <th>Статус</th>
                                      <th>Дата создания</th>
                                      <th>Дата отправки</th>
                                      <th>Результат (|0⟩ / |1⟩)</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {displayedList.length > 0 ? (
                                      displayedList.map(task => (
                                          <tr
                                              key={task.id_task}
                                              onClick={() => handleRowClick(task.id_task)}
                                              style={{ cursor: 'pointer' }}
                                              className={user?.is_admin && task.task_status === STATUS_FORMED
                                                  ? 'table-warning-soft'
                                                  : ''}
                                          >
                                              <td className="fw-bold">#{task.id_task}</td>
                                              {user?.is_admin && (
                                                  <td className="small text-muted">ID: {task.id_user}</td>
                                              )}
                                              <td>{getStatusBadge(task.task_status)}</td>
                                              <td className="small">
                                                  {task.creation_date
                                                      ? new Date(task.creation_date).toLocaleDateString()
                                                      : '-'}
                                              </td>
                                              <td className="small">
                                                  {task.formed_date
                                                      ? new Date(task.formed_date).toLocaleString()
                                                      : '-'}
                                              </td>
                                              <td>
                                                  {(task.res_koeff_0 || 0) > 0 ? (
                                                      <span className="fw-bold text-success">
                                                          {task.res_koeff_0?.toFixed(4)} / {task.res_koeff_1?.toFixed(4)}
                                                      </span>
                                                  ) : (
                                                      <span className="text-muted small">--</span>
                                                  )}
                                              </td>
                                          </tr>
                                      ))
                                  ) : (
                                      <tr>
                                          <td colSpan={user?.is_admin ? 6 : 5} className="text-center py-5 text-muted">
                                              Задач не найдено
                                          </td>
                                      </tr>
                                  )}
                              </tbody>
                          </Table>
                      </div>
                  )}
              </Col>
          </Row>
      </Container>
      </div>
  );
};