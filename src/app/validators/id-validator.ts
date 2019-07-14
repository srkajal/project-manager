import { AbstractControl, ValidatorFn } from '@angular/forms'
import { AppConfig } from '../shared/app.config'

export function idValidator(required: boolean): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        if (required) {
            const isBlank = control.value == 0 || control.value == '';
            console.log('IsBlank:'+ isBlank);
            if (isBlank) {
                return !isBlank ? null : { 'required': { 'valid': false, 'value': control.value } }
            } else {
                const valid = AppConfig.idRegExp.test(control.value)
                return valid ? null : { 'invalidNumber': { 'valid': false, 'value': control.value } }
            }
        }
        return null;
    };
}