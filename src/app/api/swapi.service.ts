import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { IPeopleResponseModel } from "./responseModels/peopleResponse.model";
import { IStarshipResponseModel } from "./responseModels/starshipResponse.model";

@Injectable({
  providedIn: 'root'
})
export class SwapiService {
  private readonly swapiBaseUrl = 'https://www.swapi.tech/api';

  constructor(private readonly httpClient: HttpClient) { }

  getPeople(id: number): Observable<IPeopleResponseModel> {
    return this.httpClient.get<IPeopleResponseModel>(`${this.swapiBaseUrl}/people/${id}`);
  }

  getStarships(id: number): Observable<IStarshipResponseModel> {
    return this.httpClient.get<IStarshipResponseModel>(`${this.swapiBaseUrl}/starships/${id}`);
  }
}
