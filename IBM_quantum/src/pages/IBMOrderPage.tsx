import { useEffect, useState } from 'react';
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

// async
const callQuantumBackend = async (taskId: number) => {
  const resp = await fetch('http://localhost:8000/api/calculate_quantum_task/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id_task: taskId }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Quantum backend error: ${resp.status} ${text}`);
  }
};

export const DefaultGateImage = '/RIP_SPA/imageError.gif';

export const QuantumTaskPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { currentTask, loading, operationSuccess } = useSelector(
    (state: RootState) => state.task
  );

  // ✅ Локальное состояние для углов (ключ — service_id)
  const [localAngles, setLocalAngles] = useState<Record<number, number>>({});

  useEffect(() => {
    if (id) {
      dispatch(fetchTaskById(Number(id)));
    }
    return () => {
      dispatch(clearCurrentTask());
      dispatch(resetOperationSuccess());
    };
  }, [id, dispatch]);

  // ✅ После загрузки задачи — инициализируем локальные углы
  useEffect(() => {
    if (currentTask) {
      const angles: Record<number, number> = {};
      currentTask.gates_degrees?.forEach(gd => {
        if (gd.service_id != null) {
          angles[gd.service_id] = gd.degrees ?? 0;
        }
      });
      setLocalAngles(angles);
    }
  }, [currentTask?.id_task]);

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

  // ✅ Только локальное обновление
  const handleAngleInput = (serviceId: number, value: string) => {
    const degrees = parseFloat(value) || 0;
    setLocalAngles(prev => ({ ...prev, [serviceId]: degrees }));
  };

  // ✅ Сохранение по кнопке
  const handleSaveAngle = (serviceId: number) => {
    if (currentTask.id_task) {
      dispatch(updateGateAngle({
        taskId: currentTask.id_task,
        serviceId: serviceId,
        degrees: localAngles[serviceId] ?? 0
      }));
    }
  };

  const handleDeleteGate = (serviceId: number) => {
    if (currentTask.id_task && confirm('Удалить гейт из задачи?')) {
      dispatch(removeGateFromTask({ taskId: currentTask.id_task, serviceId }));
    }
  };

  const handleDeleteTask = () => {
    if (currentTask.id_task && confirm('Удалить задачу?')) {
      dispatch(deleteTask(currentTask.id_task));
    }
  };

  const handleFormed = () => {
    if (currentTask.id_task && confirm('Сформировать задачу?')) {
      dispatch(formedTask(currentTask.id_task));
    }
  };

  const handleResolve = async (action: 'complete' | 'reject') => {
    if (!currentTask.id_task) return;

    const msg =
      action === 'complete'
        ? 'Завершить заявку?'
        : 'Отклонить заявку?';

    if (!confirm(msg)) return;

    try {
      // 🔹 ТОЛЬКО ПРИ COMPLETE — дергаем Python backend
      if (action === 'complete') {
        await callQuantumBackend(currentTask.id_task);
      }

      // 🔹 Потом стандартное завершение в Go
      dispatch(resolveTask({ id: currentTask.id_task, action }));

    } catch (err) {
      console.error(err);
      alert('Ошибка при запуске квантового расчёта');
    }
  };


  return (
    <div className="quantum-task-body">
      <AppNavbar />

      <div className="quantum-task-content">
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
                  payload: {
                    field: 'task_description',
                    value: e.target.value,
                  },
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
          </div>
        </div>

        <div className="quantum-gates-container">
          <div className="quantum-block-header">Укажите детали выражения</div>
          <div className="quantum-block-text">
            Расположите карточки в необходимом порядке и введите углы для операций вращения.
          </div>

          <div className="quantum-gates-list">
            {currentTask.gates_degrees?.map((gd) => {
              if (gd.id_gate == null) return null;

              const axis = gd.TheAxis;
              const gateTitle = gd.titile ?? `Gate ${gd.id_gate}`;
              const degrees = localAngles[gd.id_gate] ?? gd.degrees ?? 0;

              return (
                <div key={gd.service_id} className="quantum-gate-card">
                  <img
                    src={gd.Image || DefaultGateImage}
                    alt={gateTitle}
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
                        onChange={(e) => handleAngleInput(gd.id_gate!, e.target.value)}
                        className="quantum-angle-input"
                        step="0.1"
                        disabled={!isDraft}
                      />
                    </div>
                  )}
                  {axis !== 'non' &&isDraft && (
                    <button
                      onClick={() => handleSaveAngle(gd.id_gate!)}
                      className="quantum-m2m-save"
                      title="Сохранить угол"
                    >
                      <Floppy size={16} />
                    </button>
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
              onClick={handleFormed}
              className="quantum-save-btn quantum-save-btn-success"
            >
              <PlayCircle size={14} style={{ marginRight: '4px' }} /> Сформировать заявку
            </button>
            <button onClick={handleDeleteTask} className="quantum-delete-btn">
              <Trash size={14} style={{ marginRight: '8px' }} />
              Удалить задачу
            </button>
          </>
        )}

        {currentTask.task_status === 'сформирован' && (
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