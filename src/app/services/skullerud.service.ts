import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TimeSlot, TimeSlotDTO } from '../types/TimeSlot';
import { DateTime } from 'luxon';

@Injectable({
  providedIn: 'root',
})
export class SkullerudService {
  constructor(private http: HttpClient) {}

  createHeaders() {
    return new HttpHeaders({
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'en-US',
      'X-REQUEST-SOURCE': 'brpweb',
    });
  }

  async getAvailableSlots(date: Date) {
    const headers = this.createHeaders();

    const startDate = new Date(date.setHours(2, 0, 0, 0));

    const endDate = new Date(date.setHours(23, 23, 23, 999));

    const configUrl = `https://osloklatresenter.brpsystems.com/brponline/api/ver3/products/services/3233/suggestions?businessUnit=1&period=${startDate.toISOString()}%7C${endDate.toISOString()}`;

    console.log(configUrl);

    const data: TimeSlot[] = await this.http
      .get<TimeSlotDTO[]>(configUrl, { headers })
      .pipe(catchError(this.handleError))
      .pipe(
        map((response) => {
          return response.map((x) => {
            return {
              ...x,
              duration: {
                start: DateTime.fromISO(x.duration.start),
                end: DateTime.fromISO(x.duration.end),
              },
            };
          });
        })
      )
      .toPromise();

    console.log(data);
    return data;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }
    // Return an observable with a user-facing error message.
    return throwError('Something bad happened; please try again later.');
  }
}
