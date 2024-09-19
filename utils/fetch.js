import { env } from './env.js';
import { getCookie } from './cache.js';
const env = env();
const apiHost = env.apiHost;
let accessToken = getCookie('t') || '';
const ERRORCODE = {
  'OFFLINE': 900,
  'NETWORKERROR': 901
}
const d4Options = {
  headers: {
    'Content-Type': 'application/json',
  },
  mode: 'cors', // no-cors, cors, *same-origin
  // credentials: 'include', // include, same-origin, *omit
  cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
  redirect: 'follow', // manual, *follow, error
  referrer: 'no-referrer', // *client, no-referrer
};

class FetchError extends Error {
  constructor(response, data) {
    super(data.message);
    this.name = 'FetchError';
    this.status = response.status || '';
    this.data = data;
    this.code = response.status || data.code;
  }
}

const initUrlencoded = (obj) => {
  const urlencoded = new URLSearchParams();
  for (const key in obj) {
    urlencoded.append(key, obj[key]);
  }
  return urlencoded;
}

export async function apiFetch(arg) {
  const option = {
    method: arg.method,
    url: arg.url || '',
    body: arg.body || '',
    queryString: initUrlencoded(arg.queryString) || '',
    header: arg.header || {}
  }
  if (!option.method) {
    console.error('apiFetch:', 'no set method');
    return;
  }
  d4Options.headers = {
    ...d4Options.headers,
    ...option.header
  };
  if (accessToken) {
    d4Options.headers['Authorization'] = `Bearer ${accessToken}`
  }
  if (option.method !== 'GET') {
    d4Options.body = option.body
  }
  const apiURL = (option.method === 'GET') ? `${apiHost}/${option.url}?${option.queryString.toString()}` : `${apiHost}/${option.url}`
  try {
    const response = await fetch(apiURL, {
      ...d4Options,
      method: option.method
    });
    if (!response.ok) {
      switch (response.status) {
        case 400:
          throw new FetchError(response, {message: 'Bad Request' });
        case 401:
          throw new FetchError(response, { message: 'Unauthorized' });
        case 403:
          throw new FetchError(response, { message: 'Forbidden' });
        case 404:
          throw new FetchError(response, { message: 'Not Found' });
        case 500:
          throw new FetchError(response, { message: 'Internal Server Error' });
        default:
          throw new FetchError(response, { message: 'Unknown Error' });
      }
    }

    const contentType = response.headers.get('Content-Type');

    if (contentType.includes('application/json')) {
        return response.json();
    } else if (contentType.includes('text/plain')) {
        return response.text();
    } else if (contentType.includes('text/html')) {
        return response.text();
    } else if (contentType.includes('image/') || contentType.includes('application/octet-stream')) {
        return response.blob();
    } else {
        return response.text();
    }
  } catch (error) {
    if (error instanceof FetchError) {
      if (error.code === 401) {
        location.href = '/login.html'
      } else {
        throw error;
      }
    } else {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        // Using navigator.onLine as an additional check
        if (!navigator.onLine) {
          console.error('Network error: You appear to be offline.');
          throw new FetchError('Network error', {
            message: 'offline',
            code: ERRORCODE.OFFLINE
          })
        } else {
          console.error('Network error: Connection was reset.');
          throw new FetchError('Network error', {
            message: 'network error',
            code: ERRORCODE.NETWORKERROR
          })
        }
      } else {
        console.error('Unexpected error:', error);
      }
      console.error('Unexpected error:', error);
    }
  }

}