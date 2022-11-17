import { ResponseMessageType } from "../../enums/responseMessageType.enum"

export interface IBaseSwapiResponseModel {
  message: ResponseMessageType;
}