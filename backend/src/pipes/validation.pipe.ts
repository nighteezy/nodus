import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { plainToClass, plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { ValidationException } from "src/exceptions/validation.exception";

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const { metatype } = metadata;
    if (!metatype) {
      return value;
    }
    const obj = plainToInstance(metatype, value);
    const errors = await validate(obj);

    if (errors.length) {
      console.log(errors);
      throw new ValidationException("");
    }
    return value;
  }
}
