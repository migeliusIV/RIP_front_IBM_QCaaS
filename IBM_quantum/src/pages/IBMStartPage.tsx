import { AppNavbar } from '../components/Navbar';
import './styles/IBMStartPage.css';

export const HomePage = () => {
    return (
        <div className="homepage-wrapper">
            <AppNavbar />

            <div className="home-page-body">
                <div className="home-page-container">
                    <div className="home-page-content">
                        <h1>IBM Quantum — квантовые вычисления для всех</h1>
                        <p className="home-page-lead">Внедрение полезных квантовых вычислений в мир</p>
                        {/*
                        <div className="home-page-actions">
                            <a href="/gates" className="home-page-btn primary">Начать работу</a>
                            <a href="/tasks" className="home-page-btn secondary">Мои задачи</a>
                        </div>
                        */}
                    </div>
                    <div className="video-content">
                        <video autoPlay loop muted playsInline className="home-video">
                            <source src="/RIP_SPA/Quantum-Code-Animation-v4.mp4" type="video/mp4" />
                            Ваш браузер не поддерживает видео.
                        </video>
                    </div>
                </div>
            </div>
        </div>
    );
};