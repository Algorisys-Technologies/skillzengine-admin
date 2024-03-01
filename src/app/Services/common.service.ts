import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CommonService {
    private baseUri = environment.apiEndpoint;// '/routes';    //server deployment
    //private baseUri = 'http://localhost:3000/routes';

    constructor(private http: Http) { }

    post(route, object = {}): Observable<Object> {
        return this.http.post(this.baseUri + route, object)
            .pipe(map((result) => result = result.json()),
                catchError((error) => {
                    return Observable.throw(error);
                })
            );
    }
}
