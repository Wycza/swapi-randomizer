import { IBaseSwapiModel } from "./baseSwapi.model";

export interface IPeopleModel extends IBaseSwapiModel {
  result: {
    properties: {
      height: number;
      mass: number;
      hair_color: string;
      skin_color: string;
      eye_color: string;
      birth_year: string;
      gender: string;
      created: Date;
      edited: Date;
      name: string;
      homeworld: string;
      url: string
    };
  }
}