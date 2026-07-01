import {Settlement, SettlementResponse} from '../types';
import InboundStatementModel from "../models/InboundStatementModel";
import api from "../base/Api";

export const getSettlements = async (): Promise<SettlementResponse[]> => {
    const response = await api.get(`/api/settlements`);
    return response.data;
}
export const deleteSettlement = async (settlement: Settlement): Promise<SettlementResponse> => {
    return api.delete(`/api/settlements` + '/' + settlement.id).then(response => response.data);
}

export const addSettlement = async (settlement: Settlement): Promise<SettlementResponse> => {
    return api.post(`/api/settlements`, settlement).then(response => response.data);
}

export const updateSettlement = async (settlement: InboundStatementModel): Promise<SettlementResponse> => {
    const response = await api.put(`/api/settlements`, settlement);
    return response.data;
}
