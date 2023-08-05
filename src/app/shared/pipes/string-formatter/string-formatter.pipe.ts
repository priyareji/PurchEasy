import { Pipe, PipeTransform } from '@angular/core';


@Pipe({ name: 'stringFormatter' })
export class StringFormatterPipe implements PipeTransform {
  transform(value: string, formatter?: string, previousValue?: string): string {
    let returnStr = value;
    if (formatter && value) {
      const strArr = value.toString().split('');
      formatter.toString().split('').map((char, index) => {
        if (strArr[index] && char !== 'x') {
          const lastStr = value.toString().substr(value.length - 1);
          if (char !== strArr[index] && char !== lastStr) {
            strArr.splice(index, 0, char);
          } else {
            // if (char !== strArr[index]) {
            //   strArr.splice(index, 1);
            // } else
            if (lastStr === char && index === (value.length - 1) && previousValue) {
              if (previousValue.length > 1 && previousValue[(previousValue.length - 2)] === lastStr) {
                strArr.splice(index, 1);
              }
            }
          }
        }
      });

      // if (formatter[strArr.length - 1] !== 'x') {
      //   const lastStr = value.toString().substr(value.length - 1);
      //   if (formatter[strArr.length - 1] === lastStr) {
      //     strArr.pop();
      //   }
      // }

      returnStr = '';
      for (const str of strArr) {
        returnStr += str;
      }
    }
    return returnStr;
  }
}
