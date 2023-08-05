import { ValidatorFn, FormGroup, FormControl } from '@angular/forms';

export function ConditionMatch(conditionControl: any, condition: string, caption: string): ValidatorFn | any {
    const validator = (control: FormControl): any => {
        let returnData = null;
        if (!([null, undefined].includes(control.value)) && !([null, undefined].includes(conditionControl.value))) {
            const value: any = new Date(control.value);
            value.setHours(0, 0, 0, 0);
            const conditionControlVal: any = new Date(conditionControl.value);
            conditionControlVal.setHours(0, 0, 0, 0);
            if (condition === 'greater') {
                if (Date.parse(value) < Date.parse(conditionControlVal)) {
                    returnData = {
                        mustMatch: {
                            msg: caption
                        }
                    };
                } else {
                    returnData = null;
                    conditionControl.setErrors(null);
                }
            } else if (condition === 'less') {
                if (Date.parse(value) > Date.parse(conditionControlVal)) {
                    returnData = {
                        mustMatch: {
                            msg: caption
                        }
                    };
                } else {
                    returnData = null;
                    conditionControl.setErrors(null);
                }
            }
        }
        return returnData;
    };
    return validator;
}
