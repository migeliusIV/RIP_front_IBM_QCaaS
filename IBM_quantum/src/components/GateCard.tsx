// src/components/GateCard.tsx
import { Button, Card, Badge, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import type { AppDispatch, RootState } from '../store';
import { addGateToDraft } from '../store/slices/taskSlice'; // ← укажите правильный путь к вашему слайсу
import type { IGate } from '../types';
import './styles/GateCard.css';

interface GateCardProps {
  gate: IGate;
}

export const GateCard = ({ gate }: GateCardProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const { currentTask, addingGate } = useSelector((state: RootState) => ({
    currentTask: state.task.currentTask,
    addingGate: state.task.addingGate,
  }));

  // Проверяем, есть ли гейт уже в черновике (по id_gate)
const isInDraft = currentTask?.gates_degrees?.some(gd => gd.id_gate === gate.ID_gate);

  const handleAddToDraft = () => {
    if (gate.ID_gate == null) return;
    dispatch(addGateToDraft(gate.ID_gate));
  };

  return (
    <Card className="gates-card h-100">
      <div className="gates-crd-cnt">
        <div className="gates-crd-txt">
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

      <div className="card-buttons mt-0">
        <Button
          variant={isInDraft ? 'outline-success' : 'success'}
          size="sm"
          className="card-button-add w-30 mb-0"
          onClick={handleAddToDraft}
          disabled={isInDraft || addingGate === gate.ID_gate}
        >
          {addingGate === gate.ID_gate ? (
            <>
              <Spinner as="span" animation="border" size="sm" className="me-1" />
              Добавление...
            </>
          ) : isInDraft ? (
            <>
              <i className="bi bi-check-circle me-1"></i>
              В заявке
            </>
          ) : (
            <>
              <i className="bi bi-plus-circle me-1"></i>
              Добавить
            </>
          )}
        </Button>
 
        <Link
          to={`/gate_property/${gate.ID_gate}`}
          className="card-button-more text-center text-decoration-none"
        >
          Подробнее
        </Link>
      </div>
    </Card>
  );
};