import config from '../config';

type Method = 'get' | 'post' | 'put' | 'delete';

export function apiService() {
  async function call<T>(
    method: Method,
    endpoint: string,
    body?: Record<string, any>,
  ) {
    const route = `${config.apiBaseUrl}${endpoint}`;
    const init: RequestInit = {
      credentials: 'include',
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      ...(body && method !== 'get' ? { body: JSON.stringify(body) } : {}),
    };

    const response = await fetch(route, init);
    if (!response.ok || response.status !== 200 || response.statusText !== 'OK') {
      throw new Error('An error occurred');
    }

    const result: T = await response.json();
    return result;
  }

  async function get<T>(endpoint: string) {
    const result: T = await call('get', endpoint);
    return result;
  }

  async function post<T>(endpoint: string, body?: Record<string, any>) {
    const result: T = await call('post', endpoint, body);
    return result;
  }

  async function put<T>(endpoint: string, body?: Record<string, any>) {
    const result: T = await call('put', endpoint, body);
    return result;
  }

  async function del<T>(endpoint: string, body?: Record<string, any>) {
    const result: T = await call('delete', endpoint, body);
    return result;
  }

  return {
    get,
    post,
    put,
    del,
  };
}

