export const LOGIN_URL: string = import.meta.env.VITE_LOGIN_URL || '/login';

export const redirectToLogin = (includeRedirect = true): void => {
  if (!includeRedirect) {
    window.location.href = LOGIN_URL;
    return;
  }
  const currentUrl = window.location.href;
  const encodedUrl = encodeURIComponent(currentUrl);
  const separator = LOGIN_URL.includes('?') ? '&' : '?';
  const finalLoginUrl = `${LOGIN_URL}${separator}redirect=${encodedUrl}`;
  window.location.href = finalLoginUrl;
};
