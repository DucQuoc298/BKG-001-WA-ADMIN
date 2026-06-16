/** @format */

/**
 * URL đăng nhập tập trung — chỉ cần thay đổi ở `.env` là áp dụng toàn bộ app.
 *
 * - Production / Dev server : VITE_LOGIN_URL = "https://home-dev.tavicosoft.com/login"
 * - Localhost (nếu cần)     : VITE_LOGIN_URL = "/login"   (hoặc bỏ trống → fallback "/login")
 */
export const LOGIN_URL: string = import.meta.env.VITE_LOGIN_URL || '/login';

/**
 * Chuyển hướng trình duyệt đến trang login.
 *
 * - Nếu `LOGIN_URL` là URL tuyệt đối (https://…) → full-page redirect ra host chính.
 * - Nếu là path tương đối (/login)                → điều hướng trong SPA.
 */
export const redirectToLogin = (): void => {
  window.location.href = LOGIN_URL;
};
