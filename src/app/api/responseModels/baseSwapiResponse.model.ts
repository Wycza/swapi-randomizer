import { ResponseMessageType } from "../../enums/responseMessageType.enum"

export interface IBaseSwapiResponseModel {
  message: ResponseMessageType;
  description: string;
  _id: string;
  uid: string;
  __v: number;
}