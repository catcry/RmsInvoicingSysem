import OutboundStatementModel from "./OutboundStatementModel";
import {Page} from "../types";
import BaseAggregationModel from "./BaseAggregationModel";

export default class OutboundBaseAggregationModel {
    constructor(values: any) {
        if (values) {
            this.outbound = values.outbound;
            this.baseAggregations = values.baseAggregations
            ;
        }
    }

    outbound?: OutboundStatementModel;
    baseAggregations?: Page<BaseAggregationModel>;
}