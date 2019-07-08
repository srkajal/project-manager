export class TaskRequest {
    task_id: number;
    task_name: String;
    priority: number;
    start_date: String;
    end_date: String;
    parent_id: number;
    project_id: number;
    user_id: number;

    constructor(task_id?: number, task_name?: String, priority?: number, start_date?: String, end_date?: String, parent_id?: number, project_id?: number, user_id?: number){
        this.task_id = task_id;
        this.task_name = task_name;
        this.priority = priority;
        this.start_date = start_date;
        this.end_date = end_date;
        this.parent_id = parent_id;
        this.project_id = project_id;
        this.user_id = user_id;
    }
}
