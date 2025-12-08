import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AppNavbar } from './components/Navbar';
import { HomePage } from './pages/IBMStartPage';
import { RegisterPage } from './pages/IBMRegisterPage';
import { IBMGatesList } from './pages/IBMGatesList';
import { IBMGateProp } from './pages/IBMGateProp';
import { LoginPage } from './pages/IBMLoginPage';
import { ProfilePage } from './pages/IBMUserPage';
import { QuantumTaskPage } from './pages/IBMOrderPage';
import { QuantumTasksListPage } from './pages/IBMQTasksList';

const MainLayout = () => (
    <>
        <AppNavbar />
        <main>
            <Outlet />
        </main>
    </>
);

function App() {
    return (
        <BrowserRouter basename="/RIP_SPA/">
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/gates" element={<IBMGatesList />} />
                <Route path="/gate_property/:id" element={<IBMGateProp />} />
                <Route path="/quantum_task/:id" element={<QuantumTaskPage />} />
                <Route path="/registry" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/tasks" element={<QuantumTasksListPage />} />
                <Route element={<MainLayout />}>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
/*
<Route path="/factors" element={<FactorsListPage />} />
<Route path="/factors/:id" element={<FactorDetailPage />} />
*/