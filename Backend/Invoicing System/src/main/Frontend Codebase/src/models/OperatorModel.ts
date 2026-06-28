import CountryModel from "./CountryModel";

export default class OperatorModel {

    constructor(values?: any) {
        if (values) {
            this.id = values.id;
            this.name = values.name;
            this.tadigCode = values.tadigCode;
            this.callReceivedAboard = values.callReceivedAboard;
            this.callMadeAboard = values.callMadeAboard;
            this.smsReceivedAboard = values.smsReceivedAboard;
            this.smsMadeAboard = values.smsMadeAboard;
            this.country = values.country;
        }
    }
    id?: number;
    name?:string;
    tadigCode?: string;
    callReceivedAboard? : number;
    callMadeAboard?: number;
    smsReceivedAboard?: number;
    smsMadeAboard?: number;
    country?: CountryModel;
}