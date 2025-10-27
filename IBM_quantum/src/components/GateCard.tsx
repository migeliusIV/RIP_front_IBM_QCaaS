// src/components/GateCard.tsx
import { Card, Button, Badge } from 'react-bootstrap';
import type { IGate } from '../types/types';
import './styles/GateCard.css';

interface GateCardProps {
  gate: IGate;
  onAddToTask: () => void;
}

export const GateCard = ({ gate, onAddToTask }: GateCardProps) => {
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
            src={gate.Image || 'http://127.0.0.1:9000/ibm-pictures/img/default-gate.png'}
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
        <a
          href={`/gate_property/${gate.ID_gate}`}
          className="card-button-more d-block text-center"
        >
          Подробнее
        </a>
      </div>
    </Card>
  );
};