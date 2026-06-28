export default class DailyBaseAggregationReportModel {

    constructor(values?: any) {
        if (values) {
            this.year = values.year;
            this.month = values.month;
            this.day = values.day;
            this.fileCount = values.fileCount;
            this.totalAmount = values.totalAmount;
        }
    }

    year?: string;
    month?: string;
    day?: string;
    fileCount?: number;
    totalAmount?: number;
}

