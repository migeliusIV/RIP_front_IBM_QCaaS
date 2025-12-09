import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Spinner, Row, Col, Button } from 'react-bootstrap';
import { getGateById } from '../api/gatesApi';
import type { IGate } from '../types';
import { CustomBreadcrumbs } from '../components/Breadcrumbs';
import { AppNavbar } from '../components/Navbar';
import './styles/IBMGateProp.css';

export const IBMGateProp = () => {
    const { id } = useParams<{ id: string }>();
    const [gate, setGate] = useState<IGate | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            setLoading(true);
            getGateById(id)
                .then(data => setGate(data))
                .finally(() => setLoading(false));
        }
    }, [id]);

    if (loading) {
        return (
            <div className="gate-detail-page">
                <AppNavbar />
                <div className="gate-detail-loading">
                    <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
                </div>
            </div>
        );
    }

    if (!gate) {
        return (
            <div className="gate-detail-page">
                <AppNavbar />
                <Container className="gate-not-found">
                    <h2>Гейт не найден</h2>
                    <Link to="/gates">
                        <Button variant="outline-primary" className="mt-3">Вернуться к списку гейтов</Button>
                    </Link>
                </Container>
            </div>
        );
    }

    const breadcrumbs = [
        { label: 'Гейты', path: '/gates' },
        { label: gate.Title, active: true },
    ];

    return (
        <div className="prop-body">
            <AppNavbar />
            <div className="prop-s-t"> Подробнее о гейте </div>
            <Container className="prop-card">
                <div className="prop-crd-cnt">                    
                    <Row>
                         <div className="mb-4">
                            <CustomBreadcrumbs crumbs={breadcrumbs} />
                        </div>
                        <Col lg={5}>
                            <div className="prop-crd-img">
                                <img 
                                    src={gate.Image || 'RIP_front_IBM_QCaaS/imageError.gif'} 
                                    alt={gate.Title}
                                    className="prop-crd-img img"
                                />
                            </div>
                        </Col>
                        
                        <Col lg={7}>
                            <h1 className="prop-crd-ttl">{gate.Title}</h1>
                            <div className="prop-crd-dscr">
                                <p>{gate.FullInfo}</p>
                            </div>
                            
                            <div className="gate-attributes mb-4">
                                {gate.TheAxis && gate.TheAxis !== "non" ? (
                                    <div className="attributes">
                                        <div className="attribute-editable">
                                            <span>Требуется ввод данных</span>
                                        </div>
                                        <div className="attribute-axis">
                                            <span>Изменение по оси {gate.TheAxis}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="attribute-not-editable">
                                        <span>Не требуется ввод данных</span>
                                    </div>
                                )}
                            </div>
                            
                            <div className="gate-actions">
                                {/*
                                <Button className="gate-btn-primary mt-3 px-4 py-2" variant="dark" size="lg">
                                    Добавить в квантовую схему
                                </Button>
                                <Link to="/gates" className="gate-btn-back">
                                    <Button variant="outline-secondary" className="mt-3 ms-3 px-4 py-2" size="lg">
                                        Назад к списку
                                    </Button>
                                </Link>
                                */}
                            </div>
                        </Col>
                    </Row>
                </div>
            </Container>
        </div> 
    );
};