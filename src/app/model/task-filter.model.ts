import { ParentTask } from './parent-task.model';

export class TaskFilter {
    task_id: number;
    task_name: String;
    priority_from: number;
    priority_to: number;
    start_date: Date;
    end_date: Date;
    parent_task: ParentTask;
}
