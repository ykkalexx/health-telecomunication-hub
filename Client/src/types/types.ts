export interface Login {
  email: string;
  password: string;
}

export interface Register {
  username: string;
  email: string;
  password: string;
}

export interface ProccesedData {
  userId: string;
  processedDataKey: string;
  processedData: any[];
}
