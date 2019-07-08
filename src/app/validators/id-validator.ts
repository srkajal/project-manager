import { AbstractControl } from '@angular/forms'

export function idValidator(control: AbstractControl): { [key: string]: any } | null {
    console.log("EmployeeId: " + control.value);
    const valid = /^d+$/.test(control.value)
    //const valid = true;
    console.log("EmployeeId: " + control.value);
    console.log("valid: " + valid);
    return valid ? null : { 'invalidNumber': { 'valid': false, 'value': control.value } }
}