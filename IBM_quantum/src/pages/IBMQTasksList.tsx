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

//const STATUS_DRAFT = 'черновик';
//const STATUS_DELETED = 'удалён';
const STATUS_FORMED = 'сформирован';
const STATUS_COMPLETED = 'завершён';
const STATUS_REJECTED = 'отклонён';

const getStatusBadge = (status: string | undefined) => {
  switch (status) {
    //case STATUS_DRAFT: return <Badge bg="secondary">Черновик</Badge>;
    //case STATUS_DELETED: return <Badge bg="dark">Удалена</Badge>;
    case STATUS_FORMED: return <Badge bg="primary">Сформирована</Badge>;
    case STATUS_COMPLETED: return <Badge bg="success">Завершена</Badge>;
    case STATUS_REJECTED: return <Badge bg="danger">Отклонена</Badge>;
    default: return <Badge bg="light" text="dark">Неизвестно</Badge>;
  }
};

// ✅ Вспомогательная функция: получить дату в формате YYYY-MM-DD
const getTodayISO = () => {
  const today = new Date();
  return today.toISOString().split('T')[0]; // "2025-12-23"
};

export const QuantumTasksListPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { list, loading } = useSelector((state: RootState) => state.task);
  const { user } = useSelector((state: RootState) => state.user);

  // ✅ Инициализируем фильтры с датой "сегодня"
  const [apiFilters, setApiFilters] = useState({
    status: 'all',
    from: getTodayISO(),
    to: getTodayISO(),
  });

  const [selectedUserId, setSelectedUserId] = useState<number | 'all'>('all');

  // Short Polling — с защитой от undefined list
  useEffect(() => {
    const loadData = () => {
      try {
        dispatch(fetchTasksList(apiFilters));
      } catch (err) {
        console.error('[Polling] Failed to load tasks:', err);
      }
    };
    loadData();
    const intervalId = setInterval(loadData, 5000);
    return () => clearInterval(intervalId);
  }, [dispatch, apiFilters]);

  // ✅ Статистика — защита от undefined list
  const usersStats = useMemo(() => {
    if (!list || !Array.isArray(list) || !user?.is_admin) return [];
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

  // ✅ Отфильтрованный список — защита от undefined list
  const displayedList = useMemo(() => {
    if (!list || !Array.isArray(list)) return [];
    if (!user?.is_admin) return list;
    if (selectedUserId === 'all') return list;
    return list.filter(task => task.id_user === selectedUserId);
  }, [list, user?.is_admin, selectedUserId]);

  const handleRowClick = (id: number | undefined) => {
    if (id) navigate(`/quantum_task/${id}`);
  };

  // ✅ Безопасный обработчик фильтра
  const handleApiFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setApiFilters(prev => ({ ...prev, [name]: value }));
  };

  // ✅ Обновить фильтры программно (например, "за сегодня")
  const setFilterToday = () => {
    const today = getTodayISO();
    setApiFilters(prev => ({ ...prev, from: today, to: today }));
    // Автоматически применяем фильтр
    dispatch(fetchTasksList({ ...apiFilters, from: today, to: today }));
  };

  return (
    <div className="page-body">
      <AppNavbar />
      <Container fluid className="pt-5 mt-5 px-4">
        <h2 className="fw-bold mb-4 text-center text-secondary">
          {user?.is_admin ? 'Панель квантового системного инженера' : 'Мои квантовые задачи'}
        </h2>

        <Row>
          {user?.is_admin && (
            <Col lg={2} className="mb-4">
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
                    <span>Все</span>
                    <Badge bg="secondary" pill>{list?.length ?? 0}</Badge>
                  </ListGroup.Item>
                  {usersStats.map(userStat => (
                    <ListGroup.Item
                      key={userStat.id}
                      action
                      active={selectedUserId === userStat.id}
                      onClick={() => setSelectedUserId(userStat.id)}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <span>#{userStat.id}</span>
                      <div className="d-flex gap-1 align-items-center">
                        {userStat.countFormed > 0 && (
                          <ExclamationCircleFill className="text-warning blink-icon" />
                        )}
                        <Badge bg="light" text="dark" pill>{userStat.total}</Badge>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card>
            </Col>
          )}

          <Col lg={user?.is_admin ? 10 : 12}>
            <Card className="mb-4 border-0 shadow-sm bg-white">
              <Card.Body>
                <Row className="g-3 align-items-end">
                  <Col md={user?.is_admin ? 2 : 3}>
                    <Form.Label className="fw-bold small text-muted">Статус</Form.Label>
                    <Form.Select
                      name="status"
                      value={apiFilters.status}
                      onChange={handleApiFilterChange}
                      size="sm"
                    >
                      <option value="all">Любой</option>
                      <option value={STATUS_FORMED}>Сформирована</option>
                      <option value={STATUS_COMPLETED}>Завершена</option>
                      <option value={STATUS_REJECTED}>Отклонена</option>
                    </Form.Select>
                  </Col>
                  <Col md={user?.is_admin ? 2 : 3}>
                    <Form.Label className="fw-bold small text-muted">Дата от</Form.Label>
                    <Form.Control
                      type="date"
                      name="from"
                      value={apiFilters.from}
                      onChange={handleApiFilterChange}
                      size="sm"
                    />
                  </Col>
                  <Col md={user?.is_admin ? 2 : 3}>
                    <Form.Label className="fw-bold small text-muted">Дата до</Form.Label>
                    <Form.Control
                      type="date"
                      name="to"
                      value={apiFilters.to}
                      onChange={handleApiFilterChange}
                      size="sm"
                    />
                  </Col>
                  <Col md={user?.is_admin ? 2 : 3}>
                    <Form.Label className="fw-bold small text-muted">Поиск</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="ID, описание..."
                      size="sm"
                    />
                  </Col>
                  {user?.is_admin && (
                    <Col md={2} className="text-end">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => dispatch(fetchTasksList(apiFilters))}
                        title="Применить выбранные фильтры"
                      >
                        Применить <Funnel />
                      </Button>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="ms-2"
                        onClick={setFilterToday}
                        title="Показать заявки за сегодня"
                      >
                        Сегодня
                      </Button>
                    </Col>
                  )}
                </Row>
              </Card.Body>
            </Card>

            {loading && (!list || list.length === 0) ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="danger" />
                <p className="mt-2 text-muted">Загрузка списка заявок...</p>
              </div>
            ) : (displayedList?.length ?? 0) === 0 ? (
              <div className="text-center py-5 bg-light rounded">
                <p className="text-muted">
                  📅 По вашему запросу (с {apiFilters.from} по {apiFilters.to}) не найдено заявок.
                </p>
                <Button variant="outline-secondary" size="sm" onClick={setFilterToday}>
                  Показать заявки за сегодня
                </Button>
              </div>
            ) : (
              <div className="table-responsive shadow-sm rounded bg-white">
                <Table hover className="align-middle mb-0" size="sm">
                  <thead className="bg-light text-secondary">
                    <tr>
                      <th>ID</th>
                      {user?.is_admin && <th style={{ width: '90px' }}>ID польз.</th>}
                      <th>Статус</th>
                      <th>Создана</th>
                      <th>Отправлена</th>
                      <th>Описание</th>
                      <th>Результат</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedList.map(task => (
                      <tr
                        key={task.id_task}
                        onClick={() => handleRowClick(task.id_task)}
                        style={{ cursor: 'pointer' }}
                        className={user?.is_admin && task.task_status === STATUS_FORMED ? 'table-warning' : ''}
                      >
                        <td className="fw-bold">#{task.id_task}</td>
                        {user?.is_admin && <td className="small text-muted">#{task.id_user}</td>}
                        <td>{getStatusBadge(task.task_status)}</td>
                        <td className="small">
                          {task.creation_date
                            ? new Date(task.creation_date).toLocaleDateString('ru-RU')
                            : '-'}
                        </td>
                        <td className="small">
                          {task.formed_date
                            ? new Date(task.formed_date).toLocaleDateString('ru-RU')
                            : '-'}
                        </td>
                        <td className="small text-truncate" style={{ maxWidth: '200px' }}>
                          {task.task_description || '-'}
                        </td>
                        <td>
                          {(task.res_koeff_0 ?? 0) >= 0 ? (
                            <span className="fw-bold text-success">
                              {task.res_koeff_0?.toFixed(4)} / {task.res_koeff_1?.toFixed(4)}
                            </span>
                          ) : (
                            <span className="text-muted">--</span>
                          )}
                        </td>
                      </tr>
                    ))}
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