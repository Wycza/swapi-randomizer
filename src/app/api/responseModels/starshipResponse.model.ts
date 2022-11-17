import { IStarshipModel } from "src/app/models/starship.model"
import { IBaseSwapiResponseModel } from "./baseSwapiResponse.model"

export interface IStarshipResponseModel extends IBaseSwapiResponseModel {
  result: {
    properties: IStarshipModel,
  }
}