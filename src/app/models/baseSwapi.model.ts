import { ResponseMessageType } from "../enums/responseMessageType.enum"

export interface IBaseSwapiModel {
  message: ResponseMessageType;
  description: string;
  _id: string;
  uid: string;
  __v: number;
}