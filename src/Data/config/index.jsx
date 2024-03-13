
import { API_BASE } from './apiBase';

export const exceptionExtractError = (exception) => {
    if (!exception.Errors) return false;
    let error = false;
    const errorKeys = Object.keys(exception.Errors);
    if (errorKeys.length > 0) {
        error = exception.Errors[errorKeys[0]][0].message;
    }
    return error;
};

const getQueryString = (params) => {
    const esc = encodeURIComponent;
    return Object.keys(params)
        .map(k => `${esc(k)}=${esc(params[k])}`)
        .join('&');
};

export const fetchApi = async (
    endPoint,
    payload = {},
    method = 'get',
    option,
) => {
    let qs = '';
    let body;
    let slashId = '';

    if (['get', 'head'].indexOf(method) > -1) {
        if (payload && Object.keys(payload).length > 0) qs = `?${getQueryString(payload)}`;
    } else if (['delete'].indexOf(method) > -1) {
        Object.keys(payload).forEach((key) => {
            if (body === undefined) {
                body = `${key}=${encodeURIComponent(payload[key])}`;
            } else {
                body = `${body}&&${key}=${encodeURIComponent(payload[key])}`;
            }
        });
    } else if (['patch'].indexOf(method) > -1) {
        body = payload;
    } else {
        body = JSON.stringify(payload);
    }

    let apiBase = API_BASE;

    const url = `${apiBase}${endPoint}${slashId}${qs}`;
    const mergedHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    const response = await fetch(url, {
        method: method.toLowerCase(),
        headers: mergedHeaders,
        body,
    });


  if (!response.ok) {
    let errMsg = response.statusText;
    const responseBody = await response.json();

    if (responseBody) {
        if (typeof responseBody === 'string') {
            errMsg = responseBody;
        }

        if (typeof responseBody === 'object') {
            if (Object.hasOwnProperty.call(responseBody, 'msg')) {
                errMsg = responseBody.msg;
            }
            if (Object.hasOwnProperty.call(responseBody, 'message')) {
                errMsg = responseBody.message;
            }
        }

        if (responseBody.message === "Unauthenticated.") {
            localStorage.removeItem("currentUser");

            window.location.href = "/login";
        }
    }

    throw Error(errMsg);
  }
  
  let data = null;
  try {
    data = await response.json();
  } catch (e) { /* empty */ }
  return data;
};
