import { IService } from "../types";

export interface IEventsHandler extends IService {
  initialized: boolean;
}
