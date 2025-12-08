import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { PersonCircle, BoxArrowRight } from 'react-bootstrap-icons';
import { logoutUser } from '../store/slices/userSlice';
import type { RootState, AppDispatch } from '../store';

export const AppNavbar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  // Используем вашу структуру состояния пользователя
  const { isAuthenticated, user } = useSelector((state: RootState) => state.user);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/login');
    } catch (error) {
      console.error('Ошибка при выходе:', error);
      // Даже если ошибка, всё равно очищаем локально
      localStorage.removeItem('authToken');
      localStorage.removeItem('userInfo');
      navigate('/login');
    }
  };

  // Функция для отображения имени пользователя
  const getUserDisplayName = () => {
    if (user) {
      // Используем структуру из вашего типа InternalAppHandlerDTOUser
      return user.login || 'Пользователь';
    }
    return 'Пользователь';
  };

  return (
    <Navbar bg="light" variant="light" fixed="top" className="shadow-sm border-bottom" expand="lg">
      <Container fluid className="px-4">
        <Navbar.Brand as={Link} to="/" className="fs-4">
          IBM
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />

        <Navbar.Collapse id="navbar-nav">
          {/* Основная навигация */}
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/gates" className="fs-5 text-dark">
              Quantum
            </Nav.Link>

            <Nav.Link as={Link} to="/tasks" className="fs-5 text-dark">
              QCaaS-history
            </Nav.Link>
          </Nav>

          {/* Навигация пользователя */}
          <Nav className="align-items-center gap-2">
            {isAuthenticated ? (
              <>
                {/* Ссылка на профиль с иконкой и именем пользователя */}
                <Nav.Link 
                  as={Link} 
                  to="/profile" 
                  className="text-dark d-flex align-items-center gap-2"
                >
                  <PersonCircle size={20} />
                  <span className="fw-bold">
                    {getUserDisplayName()}
                  </span>
                </Nav.Link>

                <div className="text-secondary mx-2 d-none d-lg-block">|</div>

                {/* Кнопка выхода */}
                <Button 
                  variant="outline-secondary" 
                  size="sm" 
                  onClick={handleLogout}
                  className="d-flex align-items-center gap-2"
                >
                  <BoxArrowRight /> Выход
                </Button>
              </>
            ) : (
              <>
                <div className="text-secondary mx-2 d-none d-lg-block">|</div>
                
                {/* Ссылка на вход */}
                <Nav.Link as={Link} to="/login" className="text-dark">
                  Вход
                </Nav.Link>
                
                {/* Кнопка регистрации */}
                <Link to="/registry">
                  <Button variant="primary" className="fw-bold">
                    Регистрация
                  </Button>
                </Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};