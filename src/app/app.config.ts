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
    public static get findUsersWithNoProjectUrl(): string{
        return "/api/user/findUsersWithNoProject"
    }

    public static get findUsersWithNoTaskUrl(): string{
        return "/api/user/findUsersWithNoTask"
    }

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

    //Project url
    public static get findAllProjecstUrl(): string{
        return "/api/project/findAllProjects"
    }

    public static get findAllActiveProjectUrl(): string{
        return "/api/project/findAllActiveProjects"
    }

    public static get addProjectUrl(): string{
        return "/api/project/createProject"
    }

    public static get findProjectByIdUrl(): string{
        return "/api/project/findProjectById/"
    }

    public static get updateProjectUrl(): string{
        return "/api/project/updateProject"
    }

    public static get suspendProjectByIdUrl(): string{
        return "/api/project/suspendProject/"
    }

    public static get activateProjectByIdUrl(): string{
        return "/api/project/activateProject/"
    }
    
}