export class ParentTask {
    parent_id: number;
    parent_task_name: String;

    constructor(parent_id: number, parent_task_name: String){
        this.parent_id =parent_id;
        this.parent_task_name = parent_task_name;
    }
}
