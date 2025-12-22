/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface FrontStartInternalAppDsDegreesToGates {
  /** @format float32 */
  degrees?: number;
  /** Связи, необходимые для работы сервиса */
  gate?: FrontStartInternalAppDsGate;
  id_gate?: number;
  id_task?: number;
  task?: FrontStartInternalAppDsQuantumTask;
}

export interface FrontStartInternalAppDsGate {
  /** Несущая связь */
  degrees?: FrontStartInternalAppDsDegreesToGates[];
  description?: string;
  /** subject area */
  fullInfo?: string;
  i0j0?: number;
  i0j1?: number;
  i1j0?: number;
  i1j1?: number;
  id_gate?: number;
  image?: string;
  matrix_koeff?: number;
  status?: boolean;
  theAxis?: string;
  title?: string;
}

export interface FrontStartInternalAppDsQuantumTask {
  conclusionDate?: string;
  creationDate?: string;
  formedDate?: string;
  /** Несущая связь */
  gatesDegrees?: FrontStartInternalAppDsDegreesToGates[];
  id_moderator?: number;
  id_task?: number;
  id_user?: number;
  moderator?: FrontStartInternalAppDsUsers;
  res_koeff_0?: number;
  res_koeff_1?: number;
  /** Задание пользователя */
  taskDescription?: string;
  taskStatus?: string;
  /** Связь для программы */
  user?: FrontStartInternalAppDsUsers;
}

export interface FrontStartInternalAppDsUsers {
  id_user?: number;
  isAdmin?: boolean;
  login?: string;
  password?: string;
}

/** Данные для обновления углов поворота гейта */
export interface InternalAppHandlerDTOReqDegreesUpd {
  /** @example 45.5 */
  degrees: number;
}

/** Данные для создания нового квантового гейта */
export interface InternalAppHandlerDTOReqGateCreate {
  /** @example "Quantum Fourier transform gate" */
  description?: string;
  /** @example "Creates superposition states" */
  full_info?: string;
  /** @example 1 */
  i0j0?: number;
  /** @example 0 */
  i0j1?: number;
  /** @example 0 */
  i1j0?: number;
  /** @example 1 */
  i1j1?: number;
  /** @example 0.707 */
  matrix_koeff?: number;
  /** @example true */
  status?: boolean;
  /** @example "X" */
  the_axis?: "X" | "Y" | "Z" | "non";
  /** @example "Hadamard Gate" */
  title: string;
}

/** Данные для завершения или отклонения квантовой задачи */
export interface InternalAppHandlerDTOReqTaskResolve {
  /** @example "complete" */
  action: "complete" | "reject";
}

/** Данные для обновления описания квантовой задачи */
export interface InternalAppHandlerDTOReqTaskUpd {
  /** @example "Calculate quantum state probabilities" */
  task_description: string;
}

/** Данные для регистрации нового пользователя */
export interface InternalAppHandlerDTOReqUserReg {
  /** @example "quantum_user" */
  login: string;
  /** @example "secure_password_123" */
  password: string;
}

/** Данные для обновления пароля пользователя */
export interface InternalAppHandlerDTOReqUserUpd {
  /** @example "new_secure_password" */
  password?: string;
}

/** Статистика по текущей задаче пользователя */
export interface InternalAppHandlerDTORespCurrTaskInfo {
  /** @example 3 */
  services_count?: number;
  /** @example 5 */
  task_id?: number;
}

/** Полная информация о квантовом гейте */
export interface InternalAppHandlerDTORespGate {
  /** @example "Quantum NOT gate" */
  description?: string;
  /** @example "Bit flip gate" */
  full_info?: string;
  /** @example 0 */
  i0j0?: number;
  /** @example 1 */
  i0j1?: number;
  /** @example 1 */
  i1j0?: number;
  /** @example 0 */
  i1j1?: number;
  /** @example 1 */
  id_gate?: number;
  /** @example "gate_x.png" */
  image?: string;
  /** @example 1 */
  matrix_koeff?: number;
  /** @example true */
  status?: boolean;
  /** @example "X" */
  the_axis?: string;
  /** @example "Pauli-X" */
  title?: string;
}

/** Информация о гейте в задаче с указанными углами поворота */
export interface InternalAppHandlerDTORespGatesDegrees {
  /** @example 90 */
  degrees?: number;
  /** @example 2 */
  id_gate?: number;
  /** @example 1 */
  service_id?: number;
  id_task?: number;
  titile?: string;
  TheAxis?: string;
  Image?:string;
}

export interface InternalAppHandlerDTORespSimpleID {
  /** @example 1 */
  id?: number;
}

/** Информация о связи между задачей и гейтом */
export interface InternalAppHandlerDTORespTaskServiceLink {
  /** @example 3 */
  service_id?: number;
  /** @example 1 */
  task_id?: number;
}

/** Полная информация о квантовой задаче включая гейты */
export interface InternalAppHandlerDTORespTasks {
  /** @example "2023-10-01T16:04:05Z" */
  conclusion_date?: string;
  /** @example "2023-10-01T15:04:05Z" */
  creation_date?: string;
  formed_date?: string;
  gates_degrees?: InternalAppHandlerDTORespGatesDegrees[];
  /** @example 1 */
  id_task?: number;
  /** @example 1 */
  id_user?: number;
  /** @example 0.707 */
  res_koeff_0?: number;
  /** @example 0.707 */
  res_koeff_1?: number;
  /** @example "Quantum state calculation" */
  task_description?: string;
  /** @example "completed" */
  task_status?: "черновик" | "сформирован" | "совершён" | "отклонён";
}

/** Ответ содержащий JWT токен и данные пользователя */
export interface InternalAppHandlerDTORespTokenLogin {
  /** @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." */
  token?: string;
  /** Базовая информация о пользователе системы */
  user?: InternalAppHandlerDTOUser;
}

/** Результат обновления углов поворота гейта */
export interface InternalAppHandlerDTORespUpdateDegrees {
  /** @example 45.5 */
  degrees?: number;
  /** @example 2 */
  service_id?: number;
  /** @example 1 */
  task_id?: number;
}

/** Результат загрузки изображения для гейта */
export interface InternalAppHandlerDTORespUploadImg {
  /** @example 1 */
  id?: number;
  /** @example "gate_image.png" */
  image?: string;
}

/** Упрощенные данные пользователя */
export interface InternalAppHandlerDTORespUser {
  /** @example "quantum_researcher" */
  login?: string;
}

/** Базовая информация о пользователе системы */
export interface InternalAppHandlerDTOUser {
  /** @example 1 */
  id_user?: number;
  /** @example false */
  is_admin?: boolean;
  /** @example "quantum_researcher" */
  login?: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      //baseURL: axiosConfig.baseURL || "http://localhost:8080",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Quantum Tasks API
 * @version 1.0
 * @license MIT (https://opensource.org/licenses/MIT)
 * @termsOfService http://swagger.io/terms/
 * @baseUrl http://localhost:8080
 * @contact API Support <support@swagger.io> (http://www.swagger.io/support)
 *
 * API для управления квантовыми задачами и гейтами
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * @description Добавляет JWT токен в черный список и выполняет деавторизацию
     *
     * @tags Users
     * @name AuthLogoutCreate
     * @summary Выход из системы
     * @request POST:/api/auth/logout
     * @secure
     * @response `200` `object` Сообщение об успешном выходе" {"message": "Деавторизация прошла успешно"}
     * @response `400` `string` Invalid authorization header
     * @response `500` `string` Internal server error
     */
    authLogoutCreate: (params: RequestParams = {}) =>
      this.request<object, string>({
        path: `/api/auth/logout`,
        method: "POST",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Добавляет указанный гейт в текущую черновую задачу пользователя.
     *
     * @tags Gates
     * @name DraftGatesCreate
     * @summary Добавить гейт в черновик задачи
     * @request POST:/api/draft/gates/{id}
     * @response `201` `InternalAppHandlerDTORespTaskServiceLink` Created
     * @response `400` `Record<string,string>` Некорректный ID гейта
     * @response `401` `Record<string,string>` Требуется авторизация
     * @response `500` `Record<string,string>` Ошибка при добавлении гейта в задачу
     */
    draftGatesCreate: (id: number, params: RequestParams = {}) =>
      this.request<
        InternalAppHandlerDTORespTaskServiceLink,
        Record<string, string>
      >({
        path: `/api/draft/gates/${id}`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает список всех гейтов. Поддерживает фильтрацию по названию.
     *
     * @tags Gates
     * @name GatesList
     * @summary Получить список гейтов
     * @request GET:/api/gates
     * @response `200` `(InternalAppHandlerDTORespGate)[]` OK
     * @response `500` `Record<string,string>` Внутренняя ошибка сервера
     */
    gatesList: (
      query?: {
        /** Фильтр по названию гейта (поиск по подстроке) */
        title?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<InternalAppHandlerDTORespGate[], Record<string, string>>({
        path: `/api/gates`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Создаёт новый квантовый гейт с указанными параметрами.
     *
     * @tags Gates
     * @name GatesCreate
     * @summary Создать новый гейт
     * @request POST:/api/gates
     * @response `201` `FrontStartInternalAppDsGate` Created
     * @response `400` `Record<string,string>` Некорректные данные запроса
     * @response `500` `Record<string,string>` Ошибка при создании гейта
     */
    gatesCreate: (
      gate: InternalAppHandlerDTOReqGateCreate,
      params: RequestParams = {},
    ) =>
      this.request<FrontStartInternalAppDsGate, Record<string, string>>({
        path: `/api/gates`,
        method: "POST",
        body: gate,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает полную информацию о гейте по его идентификатору.
     *
     * @tags Gates
     * @name GatesDetail
     * @summary Получить гейт по ID
     * @request GET:/api/gates/{id}
     * @response `200` `FrontStartInternalAppDsGate` OK
     * @response `400` `Record<string,string>` Некорректный ID
     * @response `404` `Record<string,string>` Гейт не найден
     * @response `500` `Record<string,string>` Внутренняя ошибка сервера
     */
    gatesDetail: (id: number, params: RequestParams = {}) =>
      this.request<FrontStartInternalAppDsGate, Record<string, string>>({
        path: `/api/gates/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Обновляет существующий гейт по ID.
     *
     * @tags Gates
     * @name GatesUpdate
     * @summary Обновить гейт
     * @request PUT:/api/gates/{id}
     * @response `200` `FrontStartInternalAppDsGate` OK
     * @response `400` `Record<string,string>` Некорректные данные запроса или ID
     * @response `500` `Record<string,string>` Ошибка при обновлении гейта
     */
    gatesUpdate: (
      id: number,
      gate: InternalAppHandlerDTOReqGateCreate,
      params: RequestParams = {},
    ) =>
      this.request<FrontStartInternalAppDsGate, Record<string, string>>({
        path: `/api/gates/${id}`,
        method: "PUT",
        body: gate,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Удаляет гейт по ID.
     *
     * @tags Gates
     * @name GatesDelete
     * @summary Удалить гейт
     * @request DELETE:/api/gates/{id}
     * @response `200` `InternalAppHandlerDTORespSimpleID` OK
     * @response `400` `Record<string,string>` Некорректный ID
     * @response `500` `Record<string,string>` Ошибка при удалении гейта
     */
    gatesDelete: (id: number, params: RequestParams = {}) =>
      this.request<InternalAppHandlerDTORespSimpleID, Record<string, string>>({
        path: `/api/gates/${id}`,
        method: "DELETE",
        format: "json",
        secure: true,
        ...params,
      }),

    /**
     * @description Загружает изображение гейта и обновляет URL в базе данных.
     *
     * @tags Gates
     * @name GatesImageCreate
     * @summary Загрузить изображение для гейта
     * @request POST:/api/gates/{id}/image
     * @response `201` `InternalAppHandlerDTORespUploadImg` Created
     * @response `400` `Record<string,string>` Некорректный ID или отсутствует файл
     * @response `500` `Record<string,string>` Ошибка при загрузке изображения
     */
    gatesImageCreate: (
      id: number,
      data: {
        /** Изображение гейта */
        file: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<InternalAppHandlerDTORespUploadImg, Record<string, string>>({
        path: `/api/gates/${id}/image`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает ID текущей черновой задачи и количество добавленных в неё гейтов.
     *
     * @tags QuantumTasks
     * @name QuantumTaskCurrentList
     * @summary Получить информацию о текущей черновой задаче
     * @request GET:/api/quantum_task/current
     * @response `200` `InternalAppHandlerDTORespCurrTaskInfo` OK
     * @response `500` `Record<string,string>` Ошибка при получении данных задачи
     */
    quantumTaskCurrentList: (params: RequestParams = {}) =>
      this.request<
        InternalAppHandlerDTORespCurrTaskInfo,
        Record<string, string>
      >({
        path: `/api/quantum_task/current`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает список квантовых задач. Пользователь видит только свои задачи, модератор - все задачи, неавторизованный пользователь - ошибку доступа.
     *
     * @tags QuantumTasks
     * @name QuantumTasksList
     * @summary Получить список задач
     * @request GET:/api/quantum_tasks
     * @secure
     * @response `200` `(InternalAppHandlerDTORespTasks)[]` Список задач
     * @response `401` `string` Unauthorized
     * @response `403` `string` Forbidden
     * @response `500` `string` Internal server error
     */
    quantumTasksList: (
      query?: {
        /** Фильтр по статусу */
        status?: string;
        /** Начальная дата (фильтр от) */
        from?: string;
        /** Конечная дата (фильтр до) */
        to?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<InternalAppHandlerDTORespTasks[], string>({
        path: `/api/quantum_tasks`,
        method: "GET",
        query: query,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает детальную информацию о квантовой задаче по её идентификатору
     *
     * @tags QuantumTasks
     * @name QuantumTasksDetail
     * @summary Получить задачу по ID
     * @request GET:/api/quantum_tasks/{id}
     * @response `200` `InternalAppHandlerDTORespTasks` Детали задачи
     * @response `400` `string` Invalid task ID
     * @response `404` `string` Task not found
     */
    quantumTasksDetail: (id: number, params: RequestParams = {}) =>
      this.request<InternalAppHandlerDTORespTasks, string>({
        path: `/api/quantum_tasks/${id}`,
        method: "GET",
        secure: true, 
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Обновляет описание квантовой задачи
     *
     * @tags QuantumTasks
     * @name QuantumTasksUpdate
     * @summary Обновить задачу
     * @request PUT:/api/quantum_tasks/{id}
     * @response `200` `InternalAppHandlerDTORespTasks` Обновленная задача
     * @response `400` `string` Invalid input
     * @response `500` `string` Internal server error
     */
    quantumTasksUpdate: (
      id: number,
      request: InternalAppHandlerDTOReqTaskUpd,
      params: RequestParams = {},
    ) =>
      this.request<InternalAppHandlerDTORespTasks, string>({
        path: `/api/quantum_tasks/${id}`,
        method: "PUT",
        secure: true, 
        body: request,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Полностью удаляет квантовую задачу из системы
     *
     * @tags QuantumTasks
     * @name QuantumTasksDelete
     * @summary Удалить задачу
     * @request DELETE:/api/quantum_tasks/{id}
     * @response `200` `InternalAppHandlerDTORespSimpleID` ID удаленной задачи
     * @response `400` `string` Invalid task ID
     * @response `500` `string` Internal server error
     */
    quantumTasksDelete: (id: number, params: RequestParams = {}) =>
      this.request<InternalAppHandlerDTORespSimpleID, string>({
        path: `/api/quantum_tasks/${id}`,
        method: "DELETE",
        type: ContentType.Json,
        format: "json",
        secure: true,
        ...params,
      }),

    /**
     * @description Переводит задачу из статуса черновика в статус сформированной
     *
     * @tags QuantumTasks
     * @name QuantumTasksFormUpdate
     * @summary Сформировать задачу
     * @request PUT:/api/quantum_tasks/{id}/form
     * @response `200` `InternalAppHandlerDTORespTasks` Сформированная задача
     * @response `400` `string` Invalid task ID or cannot form task
     */
    quantumTasksFormUpdate: (id: number, params: RequestParams = {}) =>
      this.request<InternalAppHandlerDTORespTasks, string>({
        path: `/api/quantum_tasks/${id}/form`,
        method: "PUT",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Выполняет завершение или отклонение квантовой задачи с вычислением результата
     *
     * @tags QuantumTasks
     * @name QuantumTasksResolveUpdate
     * @summary Завершить/отклонить задачу
     * @request PUT:/api/quantum_tasks/{id}/resolve
     * @response `200` `InternalAppHandlerDTORespTasks` Решенная задача
     * @response `400` `string` Invalid input or missing required fields
     * @response `401` `string` Unauthorized
     * @response `404` `string` Task not found
     * @response `500` `string` Internal server error
     */
    quantumTasksResolveUpdate: (
      id: number,
      request: InternalAppHandlerDTOReqTaskResolve,
      params: RequestParams = {},
    ) =>
      this.request<InternalAppHandlerDTORespTasks, string>({
        path: `/api/quantum_tasks/${id}/resolve`,
        method: "PUT",
        secure: true,
        body: request,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Обновляет значение градусов для конкретного гейта в задаче
     *
     * @tags M-M
     * @name TasksServicesUpdate
     * @summary Обновить градусы гейта
     * @request PUT:/api/tasks/{task_id}/services/{service_id}
     * @response `200` `InternalAppHandlerDTORespUpdateDegrees` Обновленные данные
     * @response `400` `string` Invalid input
     * @response `500` `string` Internal server error
     */
    tasksServicesUpdate: (
      taskId: number,
      serviceId: number,
      request: InternalAppHandlerDTOReqDegreesUpd,
      params: RequestParams = {},
    ) =>
      this.request<InternalAppHandlerDTORespUpdateDegrees, string>({
        path: `/api/tasks/${taskId}/services/${serviceId}`,
        method: "PUT",
        secure: true,
        body: request,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Удаляет связь между гейтом и задачей
     *
     * @tags M-M
     * @name TasksServicesDelete
     * @summary Удалить гейт из задачи
     * @request DELETE:/api/tasks/{task_id}/services/{service_id}
     * @response `200` `InternalAppHandlerDTORespTaskServiceLink` Информация об удаленной связи
     * @response `400` `string` Invalid IфDs
     * @response `500` `string` Internal server error
     */
    tasksServicesDelete: (
      taskId: number,
      serviceId: number,
      params: RequestParams = {},
    ) =>
      this.request<InternalAppHandlerDTORespTaskServiceLink, string>({
        path: `/api/tasks/${taskId}/services/${serviceId}`,
        method: "DELETE",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает данные аутентифицированного пользователя
     *
     * @tags Users
     * @name UsersMeList
     * @summary Получить текущего пользователя
     * @request GET:/api/users/me
     * @secure
     * @response `200` `InternalAppHandlerDTORespUser` Данные пользователя
     * @response `401` `string` Unauthorized
     * @response `500` `string` Internal server error
     */
    usersMeList: (params: RequestParams = {}) =>
      this.request<InternalAppHandlerDTORespUser, string>({
        path: `/api/users/me`,
        method: "GET",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Обновляет пароль текущего аутентифицированного пользователя
     *
     * @tags Users
     * @name UsersMeUpdate
     * @summary Обновить данные пользователя
     * @request PUT:/api/users/me
     * @secure
     * @response `200` `InternalAppHandlerDTORespUser` Обновленные данные пользователя
     * @response `400` `string` Invalid input data
     * @response `401` `string` Unauthorized
     * @response `500` `string` Internal server error
     */
    usersMeUpdate: (
      request: InternalAppHandlerDTOReqUserUpd,
      params: RequestParams = {},
    ) =>
      this.request<InternalAppHandlerDTORespUser, string>({
        path: `/api/users/me`,
        method: "PUT",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  login = {
    /**
     * @description Выполняет вход пользователя и возвращает JWT токен
     *
     * @tags Users
     * @name LoginCreate
     * @summary Аутентификация пользователя
     * @request POST:/login
     * @response `200` `InternalAppHandlerDTORespTokenLogin` Токен и данные пользователя
     * @response `400` `string` Invalid input data
     * @response `401` `string` Invalid credentials
     * @response `500` `string` Internal server error
     */
    loginCreate: (
      request: InternalAppHandlerDTOReqUserReg,
      params: RequestParams = {},
    ) =>
      this.request<InternalAppHandlerDTORespTokenLogin, string>({
        path: `/login`,
        method: "POST",
        body: request,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  users = {
    /**
     * @description Создает нового пользователя с указанными логином и паролем
     *
     * @tags Users
     * @name UsersCreate
     * @summary Регистрация пользователя
     * @request POST:/users
     * @response `200` `InternalAppHandlerDTORespUser` Зарегистрированный пользователь
     * @response `400` `string` Invalid input data
     * @response `500` `string` Internal server error
     */
    usersCreate: (
      request: InternalAppHandlerDTOReqUserReg,
      params: RequestParams = {},
    ) =>
      this.request<InternalAppHandlerDTORespUser, string>({
        path: `/users`,
        method: "POST",
        body: request,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
