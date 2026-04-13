export interface IAddress {
  _id: string;
  name: string;
  details: string;
  phone: string;
  city: string;
}

export type IAddressPayload = Omit<IAddress, '_id'>;
