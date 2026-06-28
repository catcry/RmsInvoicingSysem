export default class ProfileViewModel{

    constructor(values?: any) {
        if (values) {
            this.id = values.id;
            this.yearMonth = values.yearMonth;
            this.operator = values.operator;
            this.country = values.country;
            this.streamType = values.streamType;
            this.status = values.status;
            this.tap3Amount = values.tap3Amount;
        }
    }

    id? : number;
    yearMonth? : string;
    operator? : string;
    country? : string;
    streamType? : string;
    status? : boolean;
    tap3Amount? : number;

}