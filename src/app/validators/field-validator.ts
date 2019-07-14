import { AbstractControl, ValidatorFn } from '@angular/forms'

export function fieldValidator(required: boolean): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        if (required) {
            const isBlank = control.value == 0 || control.value == '';
            console.log('IsBlank:' + isBlank);
            return !isBlank ? null : { 'required': { 'valid': false, 'value': control.value } }
        }
        return null;
    };
}