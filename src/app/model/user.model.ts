export class User{
    user_id: number;
    first_name: string;
    last_name: string;
    employee_id: number;

    constructor(user_id: number, first_name: string, last_name: string, employee_id: number){
        this.user_id = user_id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.employee_id = employee_id;
    }
}