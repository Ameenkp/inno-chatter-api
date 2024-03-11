export class InnoChatterApiError extends Error {
  status: number;
  errorMessage: string[];

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.errorMessage = [message];
    Error.captureStackTrace(this, this.constructor);
  }
}
