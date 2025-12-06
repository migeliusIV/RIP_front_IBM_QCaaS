import { Navbar, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export const AppNavbar = () => {
  const [isGray, setIsGray] = useState(false);

  useEffect(() => {
    // Устанавливаем таймер на 10 секунд
    const timer = setTimeout(() => {
      console.log('Таймер сработал - меняем цвет на серый');
      setIsGray(true);
    }, 10000); // 10000 миллисекунд = 10 секунд

    // Функция очистки таймера при размонтировании компонента
    return () => {
      clearTimeout(timer);
      console.log('Таймер очищен');
    };
  }, []); // Пустой массив зависимостей - таймер запустится только один раз при монтировании

  return (
    <Navbar bg="light" variant="light" fixed="top" className="shadow-sm border-bottom">
      <Container fluid className="px-4">
        {/* Единый бренд как ссылка */}
        <Navbar.Brand 
          as={Link} 
          to="/" 
          className="fs-4"
          style={{ 
            color: isGray ? '#64047eff' : 'inherit',
            transition: 'color 0.3s ease'
          }}
        >
          IBM
        </Navbar.Brand>

        {/* Отдельная навигация */}
        <div className="me-auto">
          <Link 
            to="/gates" 
            className="fs-5 text-decoration-none"
            style={{ 
              color: isGray ? '#64047eff' : '#212529',
              transition: 'color 0.3s ease'
            }}
          >
            Quantum
          </Link>
        </div>
      </Container>
    </Navbar>
  );
};