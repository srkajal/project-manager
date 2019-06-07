import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
    name: 'sortBy',
    pure: false
})
export class SortByPipe implements PipeTransform {
    transform(values: number[] | string[] | object[], key?: string, reverse?: boolean) {
        if (!Array.isArray(values) || values.length <= 0) {
            return null;
        }

        if (!key) {
            return values
        }

        return this.sort(values, key, reverse);
    }

    private sort(value: any[], key?: any, reverse?: boolean): any[] {
        const array: any[] = value.sort((a: any, b: any): number => {
            return a[key] > b[key] ? 1 : -1;
        });

        if (reverse) {
            return array.reverse();
        }
        return array;
    }
}