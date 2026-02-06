/**
 * Cookie 工具类 - 用于跨应用共享认证信息
 * 两个应用都在 www.adbiza.com 域名下，可以共享 Cookie
 */

/**
 * 设置 Cookie
 * @param name Cookie 名称
 * @param value Cookie 值
 * @param days 过期天数，默认 7 天
 */
export const setCookie = (name: string, value: string, days: number = 7): void => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  const cookieOptions = [
    `${name}=${value}`,
    `expires=${expires.toUTCString()}`,
    'path=/',
    'domain=.adbiza.com', // 注意前面的点，允许所有子域名访问
    'SameSite=Lax',
    'Secure'
  ];

  document.cookie = cookieOptions.join('; ');
};

/**
 * 获取 Cookie
 * @param name Cookie 名称
 * @returns Cookie 值或 null
 */
export const getCookie = (name: string): string | null => {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length, cookie.length);
    }
  }

  return null;
};

/**
 * 删除 Cookie
 * @param name Cookie 名称
 */
export const removeCookie = (name: string): void => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.adbiza.com`;
};

/**
 * Token 相关的 Cookie 操作
 */
export const tokenStorage = {
  // 同时设置 localStorage 和 Cookie
  setToken: (token: string, displayName?: string): void => {
    localStorage.setItem('token', token);
    localStorage.setItem('displayName', displayName || '');
    setCookie('token', token, 7);
    if (displayName) {
      setCookie('displayName', displayName, 7);
    }
  },

  // 优先从 Cookie 读取，如果没有再从 localStorage 读取
  getToken: (): string | null => {
    return getCookie('token') || localStorage.getItem('token');
  },

  getDisplayName: (): string | null => {
    return getCookie('displayName') || localStorage.getItem('displayName');
  },

  // 同时清除 localStorage 和 Cookie
  clear: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('displayName');
    removeCookie('token');
    removeCookie('displayName');
  }
};
