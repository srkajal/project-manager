import { ParentTask } from './parent-task.model';

export class Task {
    task_id: number;
    task_name: String;
    priority: number;
    start_date: Date;
    end_date: Date;
    status: String;
    parent_task: ParentTask;
}
