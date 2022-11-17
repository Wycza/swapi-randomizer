import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IPeopleModel } from "../models/people.model";
import { HttpClient } from '@angular/common/http';
import { IStarshipModel } from "../models/starship.model";

@Injectable({
  providedIn: 'root'
})
export class SwapiService {
  private readonly swapiBaseUrl = 'https://www.swapi.tech/api';

  constructor(private readonly httpClient: HttpClient) { }

  getPeople(id: number): Observable<IPeopleModel> {
    return this.httpClient.get<IPeopleModel>(`${this.swapiBaseUrl}/people/${id}`);
  }

  getStarships(id: number): Observable<IStarshipModel> {
    return this.httpClient.get<IStarshipModel>(`${this.swapiBaseUrl}/starships/${id}`);
  }
}
