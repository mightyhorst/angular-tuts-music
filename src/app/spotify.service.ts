import { Injectable } from '@angular/core';
import { HttpModule } from '@angular/http';
import {
  Http,
  Headers,
  RequestOptions
} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import {throwError} from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

/**
 * SpotifyService works querying the Spotify Web API
 * https://developer.spotify.com/web-api/
 */

@Injectable()
export class SpotifyService {
  static BASE_URL = 'https://api.spotify.com/v1';

  constructor(private http: Http) {}

  query(
    URL: string,
    params?: Array<string>
  ): Observable<any[]> {
    let queryURL = `${SpotifyService.BASE_URL}${URL}`;
    if (params) {
      queryURL = `${queryURL}?${params.join('&')}`;
    }
    const apiKey = environment.spotifyApiKey;
    const headers = new Headers({
      Authorization: `Bearer ${apiKey}`
    });
    const options = new RequestOptions({
      headers: headers
    });

    return this.http
      .request(queryURL, options)
      .map((res: any) => res.json());

    // return this.http
    //   .request(queryURL, options).pipe(
    //     map(res => res.json() ),
    //     catchError(this.handleError)
    //   );
  }

  // private handleError(error: HttpErrorResponse) {
  //   if (error.error instanceof ErrorEvent) {
  //     // A client-side or network error occurred. Handle it accordingly.
  //     console.error('An error occurred:', error.error.message);
  //   } else {
  //     // The backend returned an unsuccessful response code.
  //     // The response body may contain clues as to what went wrong,
  //     console.error(
  //       `Backend returned code ${error.status}, ` +
  //       `body was: ${error.error}`);


  //     if(confirm('Hack - go here to get an OAuth https://developer.spotify.com/console/get-search-item/')){
  //       window.location.href='https://developer.spotify.com/console/get-search-item/'
  //     }


  //   }
  //   // return an observable with a user-facing error message
  //   throwError('Something bad happened; please try again later.');
  // };

  search(query: string, type: string): Observable<any[]> {
    return this.query(`/search`, [
      `q=${query}`,
      `type=${type}`
    ]);
  }

  searchTrack(query: string): Observable<any[]> {
    return this.search(query, 'track');
  }

  getTrack(id: string): Observable<any[]> {
    return this.query(`/tracks/${id}`);
  }

  getArtist(id: string): Observable<any[]> {
    return this.query(`/artists/${id}`);
  }

  getAlbum(id: string): Observable<any[]> {
    return this.query(`/albums/${id}`);
  }
}

export const SPOTIFY_PROVIDERS: Array<any> = [
  { provide: SpotifyService, useClass: SpotifyService }
];
