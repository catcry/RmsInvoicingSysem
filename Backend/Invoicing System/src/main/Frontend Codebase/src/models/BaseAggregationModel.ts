export default class BaseAggregationModel {

    constructor(values: any) {
        if (values) {
            this.tapSequenceNumber = values.tapSequenceNumber;
            this.fileCreationTime = values.fileCreationTime;
            this.fileCreationUtcTo = values.fileCreationUtcTo;
            this.totalCharge = Number(values.totalCharge); // Ensuring numeric type
            this.totalTaxValue = Number(values.totalTaxValue);
            this.totalDiscountValue = Number(values.totalDiscountValue);
            this.callEventDetailsCnt = Number(values.callEventDetailsCnt);
            this.localCurrency = values.localCurrency;
            this.tapCurrency = values.tapCurrency;
            this.exchangeRate = Number(values.exchangeRate);
        }
    }

    tapSequenceNumber?: string;
    totalCharge?: number;
    totalTaxValue?: number;
    totalDiscountValue?: number;
    localCurrency?: string;
    tapCurrency?: string;
    fileCreationTime?: string;
    fileCreationUtcTo?: string;
    callEventDetailsCnt?: number;
    exchangeRate?: number;
}