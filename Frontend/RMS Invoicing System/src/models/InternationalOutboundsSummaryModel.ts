export default class InternationalOutboundsSummaryModel {
    constructor(values?: any) {
        if (values) {
            this.yearMonth = values.yearMonth;
            this.closedInvoices = values.closedInvoices;
            this.closedTap3Amounts = values.closedTap3Amounts;
            this.closedDiffAmounts = values.closedDiffAmounts;
            this.pendingInvoices = values.pendingInvoices;
            this.pendingTap3Amounts = values.pendingTap3Amounts;
            this.pendingDiffAmounts = values.pendingDiffAmounts;
        }
    }
    yearMonth?: string;
    closedInvoices?: number;
    closedTap3Amounts?: number;
    closedDiffAmounts? : number;
    pendingInvoices?: number;
    pendingTap3Amounts?: number;
    pendingDiffAmounts?: number;
}