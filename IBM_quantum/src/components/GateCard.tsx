// src/components/GateCard.tsx
import { Button, Card, Badge, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import type { AppDispatch, RootState } from '../store';
import { addGateToDraft } from '../store/slices/gatesSlice';
import type { IGate } from '../types';
import './styles/GateCard.css';

export const GateCard = ({ gate }: { gate: IGate }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { addingGate } = useSelector((state: RootState) => ({ addingGate: state.task.addingGate }));

  const handleAddToDraft = () => {
    if (gate.ID_gate != null) {
      dispatch(addGateToDraft(gate.ID_gate));
    }
  };

  return (
    <Card className="gates-card h-100">
      <div className="gates-crd-cnt">
        <div className="gates-crd-txt">
          <div className="attributes">
            {gate.TheAxis !== 'non' ? (
              <>
                <Badge bg="info" className="attribute-editable">Требуется ввод данных</Badge>
                <Badge bg="secondary" className="attribute-axis">Изменение по оси {gate.TheAxis}</Badge>
              </>
            ) : (
              <Badge bg="light" text="dark" className="attribute-not-editable">Не требуется ввод данных</Badge>
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

      <div className="card-buttons mt-0">
        <Button
          variant="success"
          size="sm"
          className="card-button-add w-30 mb-0"
          onClick={handleAddToDraft}
          disabled={addingGate === gate.ID_gate}
        >
          {addingGate === gate.ID_gate ? (
            <>
              <Spinner as="span" animation="border" size="sm" className="me-1" />
              Добавление...
            </>
          ) : (
            <>
              <i className="bi bi-plus-circle me-1"></i>
              Добавить
            </>
          )}
        </Button>
 
        <Link to={`/gate_property/${gate.ID_gate}`} className="card-button-more text-center text-decoration-none">
          Подробнее
        </Link>
      </div>
    </Card>
  );
};