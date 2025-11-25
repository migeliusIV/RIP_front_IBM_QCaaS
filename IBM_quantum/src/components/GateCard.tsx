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
          {/* Всегда используем div.attributes для единообразия */}
          <div className="attributes">
            {gate.TheAxis !== 'non' ? (
              <>
                <Badge bg="info" className="attribute-editable">
                  Требуется ввод данных
                </Badge>
                <Badge bg="secondary" className="attribute-axis">
                  Изменение по оси {gate.TheAxis}
                </Badge>
              </>
            ) : (
              <Badge bg="light" text="dark" className="attribute-not-editable">
                Не требуется ввод данных
              </Badge>
            )}
          </div>
          
          <h5 className="gates-crd-ttl">{gate.Title}</h5>
          <p className="gates-crd-dscr">{gate.Description}</p>
        </div>
        <div className="gates-crd-img">
          <img
            src={gate.Image || '/RIP_SPA/imageError.gif'}
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