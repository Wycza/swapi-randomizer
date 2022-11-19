import { Injectable } from "@angular/core";
import { map, Observable, of } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { IPeopleResponseModel } from "./responseModels/peopleResponse.model";
import { IStarshipResponseModel } from "./responseModels/starshipResponse.model";
import { IPeopleModel } from "../models/people.model";
import { IStarshipModel } from "../models/starship.model";

@Injectable({
  providedIn: 'root'
})
export class SwapiService {
  private readonly swapiBaseUrl = 'https://www.swapi.tech/api';

  constructor(private readonly httpClient: HttpClient) { }

  getPeopleById(id: number): Observable<IPeopleModel> {
    return this.httpClient.get<IPeopleResponseModel>(`${this.swapiBaseUrl}/people/${id}`)
      .pipe(
        map((res: IPeopleResponseModel) => {
          return {
            ...res.result.properties,
            description: res.result.description,
            mass: Number(res.result.properties.mass.toString().replace(/,/g, '.')),
            id: res.result.uid,
          }
        })
      )
  }

  getStarshipById(id: number): Observable<IStarshipModel> {
    return this.httpClient.get<IStarshipResponseModel>(`${this.swapiBaseUrl}/starships/${id}`)
      .pipe(
        map((res: IStarshipResponseModel) => {
          return {
            ...res.result.properties,
            description: res.result.description,
            length: Number(res.result.properties.length.toString().replace(/,/g, '.')),
            id: res.result.uid,
          }
        })
      );
  }
}
