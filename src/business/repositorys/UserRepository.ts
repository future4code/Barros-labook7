import {UserDTO} from "../../model/UserTypes"

export interface UserRepository {
  createNewUser(input:UserDTO):Promise<void>;
  getUsers():Promise<UserDTO[]>;
}