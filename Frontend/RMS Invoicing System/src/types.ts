import {Dayjs} from "dayjs";

export type SettlementResponse = {
  id: number;
  tadig: string;
  registerDate: Dayjs| null;
  fromSerial: string;
  toSerial: string;
  excludeSerials: string;
  includeSerials: string;
  invoiceSdr: number;
  tapAmount: number;
  diffAmount: number;
  status: boolean;
  _links: {
    self: {
      href: string;
    },
    settlement: {
      href: string;
    },
    owner: {
      href: string;
    }
  };
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export type Settlement = {
  id?: number;
  tadig: string;
  registerDate?: Dayjs| null;
  serial?: string;
  fromSerial?: string;
  toSerial?: string;
  excludeSerials?: string;
  includeSerials?: string;
  invoiceSdr: number;
  tapAmount?: number;
  diffAmount?: number;
  status?: boolean;
}

export type SettlementEntry = {
  settlement: Settlement;
  url: string;
}