import { Observable } from 'rxjs/Observable';
import { UxSettings, Query } from './../models/ux-settings';
import { UserService } from './user.service';
import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class UxSettingsService {
    private token: string;

    constructor(
        private _http: Http,
        private _userService: UserService) {
        this._userService.getStartupInfo()
            .subscribe(info => {
                this.token = info.token;
            });
    }

    getGraphs(id: string): Observable<Query[]> {
        return this._http.get(`/api/uxsettings/${id}`, { headers: this.getPortalHeaders() })
            .map(r => <UxSettings> r.json())
            .map(r => r.graphs);
    }

    private getPortalHeaders(): Headers {
        const contentType = 'application/json';
        const headers = new Headers();

        headers.append('Content-Type', contentType);
        headers.append('Accept', 'application/json,*/*');

        if (this.token) {
            headers.append('client-token', this.token);
            headers.append('portal-token', this.token);
        }

        return headers;
    }
}
