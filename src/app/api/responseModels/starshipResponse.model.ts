import { IStarshipModel } from "src/app/models/starship.model"
import { IBaseSwapiResponseModel } from "./baseSwapiResponse.model"

export interface IStarshipResponseModel extends IBaseSwapiResponseModel {
  result: {
    description: string;
    _id: string;
    uid: string;
    __v: number;
    properties: IStarshipModel,
  }
}