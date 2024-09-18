// interface params {
//   name: string;
//   value?: any;
//   expiredTime?: number;
//   domain?: string;
//   path?: string;
// }

const setLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

const getLocalStorage = (key) => {
  let value = localStorage.getItem(key) || ''
  try {
    value = JSON.parse(value)
  } catch (error) {
    console.log('getLocalStorage', error)
  }
  return value
}

const removeLocalStorage = (key) => {
  localStorage.removeItem(key)
}

const setCookie = (params) => {
  const domain = params.domain ? ' domain=' + params.domain + ';' : ''
  const path = params.path ? ' path=' + params.path + ';' : ''
  const expiredTime = params.expiredTime ? params.expiredTime : 60 * 60 * 24 * 30
  let expires = ''
  if (expiredTime) {
    let day = new Date();
    let currentTimeZone = 0 - (day.getTimezoneOffset() / 60);
    // day.setTime(day.getTime() + (extime*1000) + currentTimeZone*60*60*1000);
    day = new Date(Date.now() + expiredTime * 1000 + currentTimeZone*60*60*1000)
    expires = 'expires=' + day.toUTCString() + ';'
  }
  document.cookie = params.name + '=' + ( typeof params.value === 'string' ? params.value : JSON.stringify(params.value)) + ';' + domain + path + expires
}

const getCookie = (params) => {
  let cname = params.name + '='
  let ca = document.cookie.split(';')
  for(let i = 0; i < ca.length; i++) {
      let c = ca[i].trim()
      if (c.indexOf(cname) === 0) {
        let value = c.substring(cname.length, c.length)
        try {
          value = JSON.parse(value)
        } catch (error) {
          console.log('getCookie', error)
        }
        return value
      }
  }
  return '';
}

const removeCookie = (params) => {
  const domain = params.domain ? ' domain=' + params.domain + ';' : ''
  const path = params.path ? ' path=' + params.path + ';' : ''
  document.cookie = params.name + '=;' + domain + path + ' expires=Thu, 01 Jan 1970 00:00:00 UTC;'
}
