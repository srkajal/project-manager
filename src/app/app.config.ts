export class AppConfig{
    public static get baseUrl(): string{
        return "http://localhost:8686"
    }

    public static get findAllTaskUrl(): string{
        return "/api/task/findAllTasks"
    }

    public static get findAllParentUrl(): string{
        return "/api/task/findAllParentTasks"
    }

    public static get closeTaskUrl(): string{
        return "/api/task/closeTaskById/"
    }

    public static get addTaskUrl(): string{
        return "/api/task/createTask"
    }

    public static get updateTaskUrl(): string{
        return "/api/task/updateTask"
    }

    public static get findTaskByIdUrl(): string{
        return "/api/task/findTaskById/"
    }
}