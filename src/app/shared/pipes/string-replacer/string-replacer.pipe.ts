import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringReplacer'
})
export class StringReplacerPipe implements PipeTransform {

  transform(value: string, from: number, to: number, replaceStr: string, args?: any): any {
    let returnData = '';
    if (value) {
      value = value.toString();
      if (!from) {
        from = 0;
      }
      if (!to) {
        to = value.length;
      }
      value = value.replace(/\s+/g, ' ');
      if (replaceStr) {
        for (let index = 0; index < value.length; index++) {
          if (((index === from) || (index <= to)) && value[index] !== ' ') {
            returnData += replaceStr;
          } else {
            returnData += value[index];
          }
        }
      }
    }
    return returnData.trim();
  }

}
