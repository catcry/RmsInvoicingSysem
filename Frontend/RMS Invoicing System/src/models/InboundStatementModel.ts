import {Dayjs} from "dayjs";
import {OverridableStringUnion} from "@mui/types";
import {IconButtonPropsColorOverrides} from "@mui/material/IconButton/IconButton";


export default class InboundStatementModel {

    constructor(values?: any) {
        if (values) {
            this.id = values.id;
            this.outboundId = values.outboundId;
            this.tadig = values.tadig;
            this.country = values.country;
            this.operator = values.operator;
            this.registerDate = values.registerDate;
            this.fromSerial = values.fromSerial;
            this.toSerial = values.toSerial;
            this.excludeSerials = values.excludeSerials;
            this.includeSerials = values.includeSerials;
            this.invoiceSdr = values.invoiceSdr;
            this.tapAmount = values.tapAmount;
            this.lastUpdateBy = values.lastUpdateBy;
            this.diffAmount = values.diffAmount;
            this.status = values.status;
            this.isNew = values.isNew;
            if (values.diffAmount === 0) {
                this.color = 'success';
            } else if (values.diffAmount > 5) {
                this.color = 'error';
            } else {
                this.color = 'warning';
            }
        }
    }

    id?: number;
    outboundId?: number;
    tadig?: string;
    country?: string;
    operator?: string;
    registerDate?: Dayjs | null;
    fromSerial?: string;
    toSerial?: string;
    excludeSerials?: string;
    includeSerials?: string;
    invoiceSdr?: number;
    tapAmount?: number;
    diffAmount?: number;
    lastUpdateBy?: string;
    status?: boolean;
    isNew?:boolean;

    color?:OverridableStringUnion<
        'inherit' | 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning',
        IconButtonPropsColorOverrides
    >;
}