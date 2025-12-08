import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Trash, Floppy, PlayCircle } from 'react-bootstrap-icons';
import './styles/IBMOrderPage.css';
import { AppNavbar } from '../components/Navbar';

// Redux
import {
  fetchTaskById,
  updateTaskDescription,
  updateGateAngle,
  removeGateFromTask,
  deleteTask,
  resolveTask,
  resetOperationSuccess,
  clearCurrentTask,
  formedTask,
} from '../store/slices/taskSlice';
import type { AppDispatch, RootState } from '../store';

// Типы
import type {
  InternalAppHandlerDTORespTasks,
  InternalAppHandlerDTORespGatesDegrees,
} from '../api/Api';

// Вспомогательная функция преобразования оси
const parseAxis = (axis?: string | null): 'x' | 'y' | 'z' | null => {
  if (!axis || axis === 'non') return null;
  const lower = axis.toLowerCase();
  return lower === 'x' || lower === 'y' || lower === 'z' ? lower : null;
};

export const DefaultGateImage = '/RIP_SPA/imageError.gif';

export const QuantumTaskPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { currentTask, loading, operationSuccess } = useSelector(
    (state: RootState) => state.task
  );

  // 1. Загрузка задачи при входе
  useEffect(() => {
    if (id) {
      dispatch(fetchTaskById(Number(id)));
    }
    return () => {
      dispatch(clearCurrentTask());
      dispatch(resetOperationSuccess());
    };
  }, [id, dispatch]);

  // 2. После успешной операции — показываем экран успеха
  if (operationSuccess) {
    return (
      <div className="quantum-success-container">
        <div className="quantum-success-card">
          <h3>Действие выполнено успешно!</h3>
          <p>Статус заявки был обновлён.</p>
          <button
            onClick={() => navigate('/tasks')}
            className="quantum-success-btn"
          >
            К списку задач
          </button>
        </div>
      </div>
    );
  }

  if (loading || !currentTask) {
    return (
      <div className="quantum-loading-container">
        <div className="quantum-spinner"></div>
        <span className="quantum-loading-text">Загрузка...</span>
      </div>
    );
  }

  const isDraft = currentTask.task_status === 'черновик';
  const isFormed = currentTask.task_status === 'сформирован';
  const isCompleted = currentTask.task_status === 'совершён';
  const isRejected = currentTask.task_status === 'отклонён';

  const amplitude0 = (currentTask.res_koeff_0 ?? 0).toFixed(4);
  const amplitude1 = (currentTask.res_koeff_1 ?? 0).toFixed(4);
  const resultStr = `${amplitude0}|0⟩ + ${amplitude1}|1⟩`;

  // --- Обработчики ---
  const handleSaveDescription = () => {
    if (currentTask.id_task && currentTask.task_description !== undefined) {
      dispatch(
        updateTaskDescription({
          id: currentTask.id_task,
          description: currentTask.task_description,
        })
      );
    }
  };

  const handleAngleChange = (
    serviceId: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const degrees = parseFloat(e.target.value) || 0;
    if (currentTask.id_task) {
      dispatch(updateGateAngle({ taskId: currentTask.id_task, serviceId, degrees }));
    }
  };

  const handleDeleteGate = (serviceId: number) => {
    if (currentTask.id_task && confirm('Удалить гейт из задачи?')) {
      dispatch(removeGateFromTask({ taskId: currentTask.id_task, serviceId }));
    }
  };

  const handleDeleteTask = () => {
    if (currentTask.id_task && confirm('Удалить задачу? Это действие нельзя отменить.')) {
      dispatch(deleteTask(currentTask.id_task));
    }
  };

  const handleFormed = () => {
    if (currentTask.id_task && confirm('Уверены, что хотите сформировать задачу? Это действие нельзя отменить.')) {
      dispatch(formedTask(currentTask.id_task));
    }
  };

  const handleResolve = (action: 'complete' | 'reject') => {
    if (currentTask.id_task) {
      const msg = action === 'complete' ? 'Завершить заявку?' : 'Отклонить заявку?';
      if (confirm(msg)) {
        dispatch(resolveTask({ id: currentTask.id_task, action }));
      }
    }
  };

  return (
    <div className="quantum-task-body">
      <AppNavbar />

      <div className="quantum-task-content">
        {/* Описание + результат + удаление */}
        <div className="quantum-description-container">
          <div className="quantum-description-block">
            <div className="quantum-block-header">Описание</div>
            <div className="quantum-block-text">
              Добавьте описание задачи, чтобы не перепутать её с другими.
            </div>
            <textarea
              value={currentTask.task_description ?? ''}
              onChange={(e) =>
                dispatch({
                  type: 'task/setCurrentTaskField',
                  payload: { field: 'task_description', value: e.target.value },
                })
              }
              className="quantum-description-field"
              rows={5}
              disabled={!isDraft}
            />
          </div>

          <div className="quantum-delete-button-container">
            <div className="quantum-result-container">
              <div className="quantum-block-header">Результат</div>
              <input
                type="text"
                value={resultStr}
                readOnly
                className="quantum-result-field"
              />
            </div>
            {isDraft && (
              <button onClick={handleDeleteTask} className="quantum-delete-btn">
                <Trash size={16} style={{ marginRight: '8px' }} />
                Удалить задачу
              </button>
            )}
          </div>
        </div>

        {/* Гейты */}
        <div className="quantum-gates-container">
          <div className="quantum-block-header">Укажите детали выражения</div>
          <div className="quantum-block-text">
            Расположите карточки в необходимом порядке и введите углы для операций вращения.
          </div>

          <div className="quantum-gates-list">
            {currentTask.gates_degrees?.map((gd: InternalAppHandlerDTORespGatesDegrees) => {
              if (gd.id_gate == null) return null;

              // В реальности — можно загружать метаданные гейта (title/image/axis) через gate.id_gate
              // Пока используем заглушку, или предположим, что бэкенд возвращает gate в ответе
              const axis = gd.TheAxis;
              const gateTitle = `${gd.titile ?? '?'}`;
              const degrees = gd.degrees ?? 0;

              return (
                <div key={gd.id_gate} className="quantum-gate-card">
                  <img
                    src={gd.Image}
                    alt={gd.Image}
                    className="quantum-gate-image"
                    width="70"
                    height="50"
                  />
                  <div className="quantum-gate-name">{gateTitle}</div>

                  {axis !== 'non' && (
                    <div className="quantum-gate-angle">
                      <span>θ =</span>
                      <input
                        type="number"
                        value={degrees}
                        onChange={(e) => handleAngleChange(gd.id_gate!, e)}
                        className="quantum-angle-input"
                        step="0.1"
                        disabled={!isDraft}
                      />
                    </div>
                  )}

                  {isDraft && (
                    <button
                      onClick={() => handleDeleteGate(gd.id_gate!)}
                      className="gate-delete-btn"
                    >
                      <Trash size={16} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Кнопки управления */}
      <div className="quantum-button-container">
        {isDraft && (
          <>
            <button
              onClick={handleSaveDescription}
              className="quantum-save-btn quantum-save-btn-secondary"
            >
              <Floppy size={14} style={{ marginRight: '4px' }} /> Сохранить описание
            </button>
            <button
              onClick={() => handleFormed()}
              className="quantum-save-btn quantum-save-btn-success"
            >
              <PlayCircle size={14} style={{ marginRight: '4px' }} /> Сформировать заявку
            </button>
          </>
        )}

        {isFormed && (
          <>
            <button
              onClick={() => handleResolve('reject')}
              className="quantum-save-btn quantum-save-btn-danger"
            >
              <Trash size={14} style={{ marginRight: '4px' }} /> Отклонить
            </button>
            <button
              onClick={() => handleResolve('complete')}
              className="quantum-save-btn quantum-save-btn-success"
            >
              <PlayCircle size={14} style={{ marginRight: '4px' }} /> Принять
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default QuantumTaskPage;