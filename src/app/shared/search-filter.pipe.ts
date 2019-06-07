import { PipeTransform, Pipe } from '@angular/core';
import { SearchFilter } from '../model/search-filter.model';

@Pipe({
    name: 'searchFilter',
    pure: false
})
export class SearchFilterPipe implements PipeTransform {
    STRING_TYPE = 'string';
    NUMBER_TYPE = 'number';
    OBJECT_TYPE = 'object';

    transform(values: object[], searchFilter: SearchFilter) {
        if(!values || !searchFilter){
            return values;
        }

        return values.filter(o=>this.applyFilter(o, searchFilter));
    }

    applyFilter(object: Object, filter: SearchFilter): boolean{
        
        for(let field in filter){
            if(filter[field]){
                if(typeof filter[field] === this.STRING_TYPE && typeof object[field] === this.STRING_TYPE){
                    
                    return object[field].toLowerCase().indexOf(filter[field].toLowerCase()) !== -1;
                    
                }
            }
        }
        return true;
    }
}