export interface IUser {
  id: string;
  name: string;
  email: string;
  address: string;
  city: string;
  province: string;
  phonenumber: string;
  bankName: string;
  bankOwnerName: string;
  bankAccountNumber: string;
  avatarImage: string;
  coverImage: string;
  createdOnUtc: string;
  modifiedOnUtc: string;
}
export interface IAdmin {
  email: string;
  username: string;
  firstname: string;
  lastname: string;
  phonenumber: string;
  createdOnUtc: string;
}
