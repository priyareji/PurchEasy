import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objectKeys'
})
export class ObjectKeysPipe implements PipeTransform {

  transform(value: any, args: string[]): any {
    const keys: any[] = [];
    if (value && typeof value === 'object' && Object.keys(value).length > 0) {
      Object.keys(value).map(key => {
        keys.push(key);
      });
    }
    return keys;
  }

}
