import { PipeTransform, Pipe } from '@angular/core';
import { Task } from '../model/task.model';

@Pipe({
    name: 'taskFilter',
    pure: false
})
export class TaskFilterPipe implements PipeTransform {
    STRING_TYPE = 'string';
    NUMBER_TYPE = 'number';
    OBJECT_TYPE = 'object';
    FIELD_START_DATE = 'start_date';
    FIELD_END_DATE = 'end_date';
    FIELD_TASK_NAME = 'task_name';
    FIELD_PRIORITY_FROM = 'priority_from';
    FIELD_PRIORITY_TO = 'priority_to';
    FIELD_PRIORITY = 'priority';

    transform(tasks: Task[], filter: Task) {
        if(!tasks || !filter){
            return tasks;
        }

        return tasks.filter(t=>this.applyFilter(t, filter));
    }

    applyFilter(task: Task, filter: Task): boolean{
        
        for(let field in filter){
            if(filter[field]){
                if(typeof filter[field] === this.STRING_TYPE && typeof task[field] === this.STRING_TYPE){
                    if(field === this.FIELD_START_DATE){
                        return new Date(filter[field]) <= new Date(task[field]);
                    } 
                    
                    if(field === this.FIELD_END_DATE){
                        return new Date(filter[field]) <= new Date(task[field]);
                    } 
                    
                    if(field === this.FIELD_TASK_NAME) {
                        return task[field].toLowerCase().indexOf(filter[field].toLowerCase()) !== -1;
                    }
                } 
                
                if(typeof filter[field] === this.STRING_TYPE && typeof task[field] === this.OBJECT_TYPE){
                    return task[field].parent_task_name.toLowerCase().indexOf(filter[field].toLowerCase()) !== -1;
                }
                
                if(typeof filter[field] === this.NUMBER_TYPE){

                    if(field === this.FIELD_PRIORITY_FROM){
                        return task[this.FIELD_PRIORITY] >= filter[field];
                    }

                    if(field === this.FIELD_PRIORITY_TO){
                        return task[this.FIELD_PRIORITY] <= filter[field];
                    }
                }
            }
        }
        return true;
    }
}