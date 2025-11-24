// src/components/GateCard.tsx
import { Card, Badge } from 'react-bootstrap';
import type { IGate } from '../types';
import './styles/GateCard.css';
import { Link } from 'react-router-dom';

interface GateCardProps {
  gate: IGate;
}

export const GateCard = ({ gate }: GateCardProps) => {
  return (
    <Card className="gates-card h-100">
      <div className="gates-crd-cnt">
        <div className="gates-crd-txt">
          {gate.TheAxis !== 'non' ? (
            <div className="attributes mb-2">
              <Badge bg="info" className="attribute-editable me-2">
                Требуется ввод данных
              </Badge>
              <Badge bg="secondary" className="attribute-axis me-2">
                Изменение по оси {gate.TheAxis}
              </Badge>
            </div>
          ) : (
            <Badge bg="light" text="dark" className="attribute-not-editable mb-2">
              Не требуется ввод данных
            </Badge>
          )}
          <h5 className="gates-crd-ttl">{gate.Title}</h5>
          <p className="gates-crd-dscr">{gate.Description}</p>
        </div>
        <div className="gates-crd-img">
          <img
            src={gate.Image || 'http://127.0.0.1:9000/ibm-pictures/img/imageError.gif'}
            alt={gate.Title}
            className="img-fluid"
          />
        </div>
      </div>
      <div className="card-buttons mt-3">
        {/*
        <Button
          variant="dark"
          size="sm"
          className="card-button-add w-100 mb-2"
          onClick={onAddToTask}
        >
          Добавить
        </Button>
        */}
        <Link to={`/gate_property/${gate.ID_gate}`}
          className="card-button-more d-block text-center"
        >
          Подробнее
        </Link>
      </div>
    </Card>
  );
};