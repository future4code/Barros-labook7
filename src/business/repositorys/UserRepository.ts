import {InputFriendDTO, UserDTO} from "../../model/UserTypes"

export interface UserRepository {
  createNewUser(input:UserDTO):Promise<void>;
  getUsers():Promise<UserDTO[]>;
  addFriend(input:InputFriendDTO):Promise<void>;
  login(email:string):Promise<UserDTO>;
}