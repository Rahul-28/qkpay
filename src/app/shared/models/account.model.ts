export interface IAccount {
  _id: string;
  name: string;
  email: string;
  password: String;
}

export interface IAccountData {
  _id: string;
  name: string;
  email: string;
}

export interface ILogin {
  email: string;
  password: String;
}

export interface LoggedIn {
  success: boolean;
  message: string;
  data: {
    token: string;
    loggedAccount: IAccount;
  };
}
