import { HttpException, HttpStatus } from '@nestjs/common';

class CustomError extends HttpException {
  constructor(message: string, statusCode: HttpStatus) {
    super(message, statusCode);  // Usamos el constructor de HttpException directamente
  }
}

export default CustomError;



