import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { AppConfig } from '../app.config';
import { map } from 'rxjs/operators'
import { UserRequest } from '../model/user-request.model';
import { User } from '../model/user.model';

@Injectable({
    providedIn: "root"
})
export class ApiUserService {
    _baseUrl: string;
    constructor(private httpClient: HttpClient) {
        this._baseUrl = AppConfig.baseUrl;
    }

    getAllUsers() {
        return this.httpClient.get<Array<User>>(this._baseUrl + AppConfig.findAllUserUrl)
            .pipe(map((response: any) => response.users));
    }

    getAllUsersWithNoProject() {
        return this.httpClient.get<Array<User>>(this._baseUrl + AppConfig.findUsersWithNoProjectUrl)
            .pipe(map((response: any) => response.users));
    }

    addUser(userRequest: UserRequest) {
        return this.httpClient.post(this._baseUrl + AppConfig.addUserUrl, userRequest);
    }

    getUserById(userId: number){
        return this.httpClient.get<User>(this._baseUrl + AppConfig.findUserByIdUrl + userId)
        .pipe(map((response: any)=>response.user));
    }

    deleteUserById(userId: number){
        return this.httpClient.get(this._baseUrl + AppConfig.deleteUserByIdUrl + userId);
    }

    updateUser(userRequest: UserRequest) {
        return this.httpClient.post(this._baseUrl + AppConfig.updateUserUrl, userRequest);
    }
}