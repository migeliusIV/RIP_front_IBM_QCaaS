import { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Badge } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  PersonCircle, 
  PencilSquare, 
  CheckLg, 
  XLg, 
  BoxArrowRight 
} from 'react-bootstrap-icons';
import { 
  updateUserProfile, 
  logoutUser, 
  fetchUserProfile 
} from '../store/slices/userSlice';
import type { RootState, AppDispatch } from '../store';
import './styles/ProfilePage.css';

export const ProfilePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, token } = useSelector((state: RootState) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ login: '', password: '' });

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else if (!user) {
      dispatch(fetchUserProfile());
    }
  }, [token, navigate, user, dispatch]);

  useEffect(() => {
    if (user) {
      setEditData({
        login: user.login || '',
        password: '',
      });
    }
  }, [user]);

  const handleSave = () => {
    dispatch(updateUserProfile(editData))
      .unwrap()
      .then(() => {
        setIsEditing(false);
        setEditData(prev => ({ ...prev, password: '' }));
        // Перезагружаем профиль
        dispatch(fetchUserProfile());
      })
      .catch((err) => {
        alert(`Ошибка: ${err}`);
      });
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      login: user?.login || '',
      password: '',
    });
  };

  if (!user) {
    return (
      <div className="profile-body">
        <div className="profile-loading">
          Загрузка...
        </div>
      </div>
    );
  }

  return (
    <div className="profile-body">
      <Container fluid className="profile-container">
        <div className="profile-content">
          <h1 className="profile-title">IBM Quantum</h1>
          <p className="profile-lead">Личный кабинет</p>

          <Card className="profile-card">
            <Card.Body className="p-4">
              {/* Шапка профиля */}
              <div className="profile-header">
                <div className="profile-avatar">
                  <PersonCircle size={60} color="#000" />
                </div>
                <div className="profile-info">
                  <h2 className="profile-name">{user.login}</h2>
                  <p className="profile-id">ID: {user.id_user}</p>
                  {user.is_admin && (
                    <Badge bg="light" text="dark" className="profile-badge">
                      Администратор
                    </Badge>
                  )}
                </div>
              </div>

              {/* Форма */}
              <Form className="profile-form">
                <Form.Group className="mb-3">
                  <Form.Label className="profile-label">Логин</Form.Label>
                  <Form.Control
                    type="text"
                    value={isEditing ? editData.login : user.login || ''}
                    onChange={(e) => setEditData({ ...editData, login: e.target.value })}
                    disabled={!isEditing}
                    className={`profile-input ${isEditing ? 'editing' : ''}`}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="profile-label">
                    {isEditing ? 'Новый пароль' : 'Пароль'}
                  </Form.Label>
                  <Form.Control
                    type="password"
                    value={isEditing ? editData.password : '••••••••'}
                    placeholder={isEditing ? 'Введите новый пароль' : ''}
                    onChange={(e) => setEditData({ ...editData, password: e.target.value })}
                    disabled={!isEditing}
                    className={`profile-input ${isEditing ? 'editing' : ''}`}
                  />
                  {isEditing && (
                    <Form.Text className="profile-hint">
                      Оставьте пустым, если не хотите менять пароль.
                    </Form.Text>
                  )}
                </Form.Group>

                {/* Кнопки */}
                <div className="profile-actions">
                  <div className="profile-edit-actions">
                    {!isEditing ? (
                      <Button
                        type="button"
                        className="profile-btn edit"
                        onClick={() => setIsEditing(true)}
                      >
                        <PencilSquare size={16} /> Редактировать
                      </Button>
                    ) : (
                      <div className="d-flex gap-2">
                        <Button
                          type="button"
                          className="profile-btn save"
                          onClick={handleSave}
                        >
                          <CheckLg size={16} /> Сохранить
                        </Button>
                        <Button
                          type="button"
                          className="profile-btn cancel"
                          onClick={handleCancel}
                        >
                          <XLg size={16} /> Отмена
                        </Button>
                      </div>
                    )}
                  </div>

                  <Button
                    type="button"
                    className="profile-btn logout"
                    onClick={handleLogout}
                  >
                    <BoxArrowRight size={16} /> Выйти
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </div>
  );
};