export class AppConfig{
    public static get baseUrl(): string{
        return "http://localhost:8686"
    }

    //Task url
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

    //User url
    public static get findAllUserUrl(): string{
        return "/api/user/findAllUsers"
    }

    public static get addUserUrl(): string{
        return "/api/user/createUser"
    }

    public static get findUserByIdUrl(): string{
        return "/api/user/findUserById/"
    }

    public static get deleteUserByIdUrl(): string{
        return "/api/user/delete/"
    }

    public static get updateUserUrl(): string{
        return "/api/user/updateUser"
    }
}