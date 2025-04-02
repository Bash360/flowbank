class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

export default AppError;
