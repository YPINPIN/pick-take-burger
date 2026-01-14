export type LoginParams = {
  username: string;
  password: string;
};

export type LoginResponse = {
  status: boolean;
  message: string;
  uid: string;
  token: string;
  expired: number;
};

export type LoginCheckResponse = {
  success: boolean;
  uid: string;
};
