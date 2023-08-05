import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrToStr'
})
export class ArrToStrPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!([null, undefined].includes(value)) && value.length) {
      value = value.toString().replace(/(?:,)/g, ', ');
    }
    return value;
  }

}
