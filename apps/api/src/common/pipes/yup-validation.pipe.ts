import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ValidationError, type AnyObjectSchema } from 'yup';

@Injectable()
export class YupValidationPipe implements PipeTransform {
  constructor(private schema: AnyObjectSchema) {}

  async transform(value: Record<string, unknown>): Promise<Record<string, unknown>> {
    try {
      const result = await this.schema.validate(value, {
        abortEarly: false,
        stripUnknown: true,
      });

      return result;
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new BadRequestException(error.errors);
      }

      throw new BadRequestException('Validation failed');
    }
  }
}
