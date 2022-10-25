import { ApiErrorDetail, ApiErrorResponse, StatusCode } from './apiHelper';
import { ErrorCode } from './const/errorCode';

const statusCode = { networkError: 418 } as const;
export class ApiError extends Error {
  public errorResponse: ApiErrorResponse;

  constructor(_errorResponse: ApiErrorResponse) {
    super('API error occurred.');
    this.errorResponse = _errorResponse;
  }
}

async function get<T>(path: string) {
  const request = new Request(path, {
    method: 'GET',
    headers: {
      // Accept: 'application/json',
      // 'Content-Type': 'application/json',
    },
    // body: JSON.stringify(data),
  });

  return sendRequest<T>(request);
}

async function post<T>(path: string, data: any) {
  const request = new Request(path, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return sendRequest<T>(request);
}

async function postFromData<T>(path: string, formData: FormData) {
  const request = new Request(path, {
    method: 'POST',
    headers: {
      // 'Content-Type': 'multipart/form-data',
    },
    body: formData,
  });

  return sendRequest<T>(request);
}

async function download(path: string, data: any, optionHeader: HeadersInit = {}) {
  const request = new Request(path, {
    method: 'POST',
    headers: {
      Accept: 'text/csv',
      'Content-Type': 'application/json',
      ...optionHeader,
    },
    body: JSON.stringify(data),
  });

  let response: Response;

  try {
    response = await fetch(request);
  } catch (error: any) {
    console.log(error);
    const apiError: ApiErrorDetail = { code: ErrorCode.client_all_network, message: 'network error occurred.' };
    throw new ApiError({ statusCode: statusCode.networkError, errors: [apiError] });
  }

  if (!response.ok) {
    throw await createApiError(response);
  }

  const blob = await response.blob();

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.download = 'be-suit.csv';
  a.href = url;
  a.click();
  a.remove();
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1e4);
}
async function sendRequest<T>(request: Request) {
  let response: Response;

  try {
    response = await fetch(request);
  } catch (error: any) {
    const apiError: ApiErrorDetail = { code: ErrorCode.client_all_network, message: 'network error occurred.' };
    throw new ApiError({ statusCode: statusCode.networkError, errors: [apiError] });
  }

  if (!response.ok) {
    throw await createApiError(response);
  }

  const result = (await response.json()) as T & StatusCode;
  result.statusCode = response.status;
  return result;
}

async function createApiError(response: Response): Promise<ApiError> {
  console.log(`error occurred. StatusCode = [ ${response.status} ]`);
  const contentType = response.headers.get('content-type');
  //problem+json
  if (contentType == null) {
    // if (contentType == null || !contentType.includes('application/problem+json')) {
    const text = await response.text();

    const apiError: ApiErrorDetail = {
      code: ErrorCode.client_all_network,
      message: `Unknown error occurred. StatusCode = [ ${response.status} ]` + `\n\n${text}`,
    };
    console.log(response);
    return new ApiError({ statusCode: response.status, errors: [apiError] });
  }

  const errorResponse = (await response.json()) as ApiErrorResponse;
  errorResponse.statusCode = response.status;

  return new ApiError(errorResponse);
}

const api = {
  get,
  post,
  postFromData,
  download,
};

export { api };
