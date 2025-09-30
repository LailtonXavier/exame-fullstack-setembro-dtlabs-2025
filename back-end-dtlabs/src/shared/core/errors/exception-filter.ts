import { NotFoundError } from '@/shared/core/errors/not-found.error';
import { ValidationError } from '@/shared/core/errors/validation.error';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch()
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception instanceof NotFoundError) {
      return response.status(404).json({ message: exception.message });
    }

    if (exception instanceof ValidationError) {
      return response.status(400).json({ message: exception.message });
    }

    return response.status(500).json({ message: 'Internal server error' });
  }
}
