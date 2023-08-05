import { FormArray, ValidatorFn } from '@angular/forms';

export function ArrayLength(min: number = 1, max: number): ValidatorFn | any {
  const validator = (formArray: FormArray): { [key: string]: any } | null => {
    let selectedCount = 0;
    let defaultMax = 0;
    // if (([null, undefined].includes(max))) {
    defaultMax = formArray.controls.length;
    // }
    formArray.controls
      .map(control => control.value)
      .reduce((prev, next) => selectedCount = (!([null, undefined, '', false].includes(next))) ?
        selectedCount + 1 :
        selectedCount,
        selectedCount);

    let returnData = null;
    if (selectedCount < min || selectedCount > (max || defaultMax)) {
      returnData = {
        arrayLength: {
          minLength: min,
          maxLength: max || defaultMax,
          selectedLength: selectedCount,
          message: ''
        }
      };
      if (selectedCount < min) {
        returnData.arrayLength.message = `Minimum length is ${min}`;
      }
      if (selectedCount > (max || defaultMax)) {
        returnData.arrayLength.message = `Maximum length is ${max || defaultMax}`;
      }
    }

    return returnData;
  };
  return validator;
}
