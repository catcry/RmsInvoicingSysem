export default class OutboundStatementModel {

    constructor(values: any) {
        if (values) {
            this.id = values.id;
            this.operator = values.operator; // Ensuring numeric type
            this.sequenceFrom = values.sequenceFrom;
            this.sequenceTo = values.sequenceTo;
            this.streamType = values.streamType;
            this.year = values.year;
            this.month = values.month;
            this.tap3Amount = values.tap3Amount;
            this.fileCount = values.fileCount;
        }
    }

    id?: number;
    operator?: string;
    sequenceFrom?: string;
    sequenceTo?: string;
    streamType?: string;
    year?: string;
    month?: string;
    tap3Amount?: string;
    fileCount?: number;
}