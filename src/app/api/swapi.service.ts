import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { IPeopleResponseModel } from "./responseModels/peopleResponse.model";
import { IStarshipResponseModel } from "./responseModels/starshipResponse.model";
import { IPeopleModel } from "../models/people.model";

@Injectable({
  providedIn: 'root'
})
export class SwapiService {
  private readonly swapiBaseUrl = 'https://www.swapi.tech/api';

  constructor(private readonly httpClient: HttpClient) { }

  getPeople(id: number): Observable<IPeopleModel> {
    return this.httpClient.get<IPeopleResponseModel>(`${this.swapiBaseUrl}/people/${id}`)
      .pipe(
        map((res: IPeopleResponseModel) => {
          return {
            ...res.result.properties,
            description: res.result.description,
          }
        })
      )
  }

  getStarships(id: number): Observable<IStarshipResponseModel> {
    return this.httpClient.get<IStarshipResponseModel>(`${this.swapiBaseUrl}/starships/${id}`);
  }
}
