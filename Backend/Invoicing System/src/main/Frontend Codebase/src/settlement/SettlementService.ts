import {Settlement, SettlementResponse} from '../types';
import {AxiosRequestConfig} from 'axios';
import InboundStatementModel from "../models/InboundStatementModel";
import api from "../base/Api";

const getAxiosConfig = (): AxiosRequestConfig => {
    const token = sessionStorage.getItem("jwt");
    return {
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
        },
    };
};

export const getSettlements = async (): Promise<SettlementResponse[]> => {
    const response = await api.get(`/api/settlements`, getAxiosConfig());
    return response.data;
}
export const deleteSettlement = async (settlement: Settlement): Promise<SettlementResponse> => {
    return api.delete(`/api/settlements` + '/' + settlement.id, getAxiosConfig()).then(response => response.data);
}

export const addSettlement = async (settlement: Settlement): Promise<SettlementResponse> => {
    return api.post(`/api/settlements`, settlement, getAxiosConfig()).then(response => response.data);
}

export const updateSettlement = async (settlement: InboundStatementModel): Promise<SettlementResponse> => {
    const response = await api.put(`/api/settlements`, settlement, getAxiosConfig());
    return response.data;
}