
export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);

    this.name = "AppError";
    this.statusCode = statusCode;

    // Mantém o protótipo correto da classe de erro.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
