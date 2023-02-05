import {FriendListDTO, InputFriendDTO, UserDTO} from "../../model/UserTypes"

export interface UserRepository {
  getUsers():Promise<UserDTO[]>;
  getFriends(userId:string):Promise<FriendListDTO[]>;
  createNewUser(input:UserDTO):Promise<void>;
  addFriend(input:InputFriendDTO):Promise<void>;
  removeFriend(userId:string,friendId:string):Promise<void>;
  login(email:string):Promise<UserDTO>;
}