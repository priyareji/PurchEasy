import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'rangeDateTime'
})
export class RangeDateTimePipe implements PipeTransform {

  transform(value: any, args?: Formator): any {
    const datePipe = new DatePipe('en-us');
    let returnDate = '';
    if (value !== null && value.length && args) {
      value.map((resp: any, index: number) => {
        value[index] = datePipe.transform(resp, args.format);
      });
      returnDate = value[0] + args.separator + value[1];
    }
    return returnDate;
  }

}

export class Formator {
  separator = '-';
  format = 'dd/MM/yyyy';
}
