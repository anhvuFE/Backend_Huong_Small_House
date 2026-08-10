import AppError from './appError';

/**
 * Ép một tham số (route param / body) về số nguyên dương hợp lệ.
 * Ngăn các giá trị không phải số (vd "abc", {}, undefined) lọt vào truy vấn
 * Mongoose gây CastError -> 500. Ném AppError(400) rõ nghĩa để error handler bắt.
 */
export const parseNumericId = (raw: unknown, field = 'id'): number => {
  const value = Number(raw);
  if (!Number.isInteger(value) || value <= 0) {
    throw new AppError(`Invalid ${field}`, 400);
  }
  return value;
};
