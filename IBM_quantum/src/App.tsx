import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AppNavbar } from './components/Navbar';
import { HomePage } from './pages/IBMStartPage';
import { IBMGatesList } from './pages/IBMGatesList';
import { IBMGateProp } from './pages/IBMGateProp';

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
        <BrowserRouter basename="/RepoName">
            <Routes>
                <Route path="/IBM" element={<HomePage />} />
                <Route path="/gates" element={<IBMGatesList />} />
                <Route path="/gate_property/:id" element={<IBMGateProp />} />
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