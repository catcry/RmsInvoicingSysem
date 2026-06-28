import {Page} from "../types";
import SettlementExceptionModel from "./SettlementExceptionModel";

export default class SettlementApiResponse<T> {

    constructor(values: any) {
        if (values) {
            this.responseBody = values.responseBody;
            this.exception = values.exception;
            this.status = values.status;
        }
    }

    responseBody?: T;
    exception?: SettlementExceptionModel;
    status?:any;
}