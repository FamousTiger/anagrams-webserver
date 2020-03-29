import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class MandatoryStringPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value == null || value.length === 0){
        throw new BadRequestException('Missing required parameter: word');
      }
    return value;
  }
}