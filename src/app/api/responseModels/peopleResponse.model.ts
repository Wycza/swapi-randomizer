import { IPeopleModel } from "src/app/models/people.model";
import { IBaseSwapiResponseModel } from "./baseSwapiResponse.model";

export interface IPeopleResponseModel extends IBaseSwapiResponseModel {
  result: {
    description: string;
    _id: string;
    uid: string;
    __v: number;
    properties: IPeopleModel,
  }
}