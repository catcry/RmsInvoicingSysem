export default class SettlementExceptionModel {

    constructor(values: any) {
        if (values) {
            this.message = values.message;
            this.status = values.status;
        }
    }

    message?: string;
    status?: number;
}