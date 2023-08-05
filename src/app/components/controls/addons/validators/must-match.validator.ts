import { ValidatorFn, FormGroup } from '@angular/forms';

export function MustMatch(parentControlName: string, matchControlName: Array<string>): ValidatorFn | any {
    const validator = (form: FormGroup): any => {
        const parentControl = form.get(parentControlName);
        if (matchControlName.length && parentControl) {
            for (const matchControl of matchControlName) {
                const control = form.get(matchControl);
                if (control) {
                    if (control.value !== parentControl.value) {
                        parentControl.setErrors({
                            mustMatch: {
                                msg: matchControl + ' not match.'
                            }
                        });
                        return;
                    } else {
                        if (parentControl.errors && typeof parentControl.errors === 'object'
                            && parentControl.errors.hasOwnProperty('mustMatch')) {
                            let error = null;
                            error = parentControl.errors;
                            delete error.mustMatch;
                            if (Object.keys(error).length === 0) {
                                parentControl.setErrors(null);
                            } else {
                                parentControl.setErrors(error);
                            }
                        }
                    }
                }
            }
        }
    };
    return validator;
}

// @Directive({
//     selector: '[mustMatch]',
//     providers: [{ provide: NG_VALIDATORS, useExisting: MustMatchDirective, multi: true }]
// })
// export class MustMatchDirective implements Validator {
//     @Input('mustMatch') mustMatch:any = [];

//     constructor() {
//         console.log(this.mustMatch);
//        setTimeout(() => {
//         console.log(this.mustMatch);
//         this.mustMatch = this.mustMatch;
//        },2000)
//     }
//     validate(formGroup: FormGroup): ValidationErrors {
//         console.log(formGroup);
//         return MustMatch(this.mustMatch[0], this.mustMatch[1])(formGroup);
//     }
// }

// export const identityRevealedValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
//     console.log(control);
//     const name = control.get('name');
//     const alterEgo = control.get('alterEgo');

//     return name && alterEgo && name.value === alterEgo.value ? { 'identityRevealed': true } : null;
//   };
