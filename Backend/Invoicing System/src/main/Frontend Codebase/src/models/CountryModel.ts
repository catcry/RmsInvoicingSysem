import OperatorType from "../base/OperatorType";
import OperatorModel from "./OperatorModel";

export default class CountryModel {

    constructor(values?: any) {
        if (values) {
            this.id = values.id;
            this.name = values.name;
            this.isoAlpha2 = values.isoAlpha2;
            this.isoAlpha3 = values.isoAlpha3;
            this.countryCode = values.countryCode;
            this.operators = values.operator;
        }
    }

    id?: number;
    name?: string;
    isoAlpha2?: string;
    isoAlpha3?: string;
    countryCode?: string;
    operators?:OperatorModel[];
}

