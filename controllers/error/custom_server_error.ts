type Error = { statusCode?: number; message: string; location?: string };

export default class CustomServerError extends Error {
  public statusCode: number;

  public location?: string;

  constructor({ statusCode = 500, message, location }: Error) {
    super(message);
    this.statusCode = statusCode;
    this.location = location;
  }

  serializeErrors(): { message: string } | string {
    return { message: this.message };
  }
}
