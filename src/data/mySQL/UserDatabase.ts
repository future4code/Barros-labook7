import { BaseDatabase } from "./BaseDatabase";
import { UserRepository } from "../../business/repositorys/UserRepository";
import { FriendListDTO, InputFriendDTO, LoginInput, UserDTO } from "../../model/UserTypes";
import { UserCustomError } from "../../customError/UserCustomError";
import { InvalidBody } from "../../customError/PostCustomError";


export class UserDatabase extends BaseDatabase implements UserRepository{
  private Table_users = "Labook_users";
  private Table_friends = "Labook_friends";

  public createNewUser = async (input:UserDTO):Promise<void> => {
    try{
      const newUser = {
          id: input.id,
          name: input.name,
          email: input.email,
          password: input.password
      };
      await UserDatabase.connection.insert(newUser).into(this.Table_users)

    }catch(error:any){
      throw new UserCustomError(error.statusCode, error.message);
    };
  }; 
  //  ------ ------- ----- ---- ---- -- ---- -//
  public addFriend = async (input:InputFriendDTO): Promise<void> => {
    try{
      const createFriendship: InputFriendDTO = {
        id: input.id,
        user_id: input.user_id,
        friend_id: input.friend_id
      }
      await UserDatabase.connection().insert(createFriendship).into(this.Table_friends)
      
    }catch(error:any){
      throw new UserCustomError(error.statusCode, error.message);
    };
  };
  //  ------ ------- ----- ---- ---- -- ---- -//
  public removeFriend = async (userId:string,friendId:string): Promise<void> => {
    try{
      //PS:fiz ultilizando o metodo raw porque não encontrei um metodo builder que fizesse da mesma forma 
      await UserDatabase.connection.raw(`
        DELETE FROM Labook_friends WHERE "${userId}" = user_id and "${friendId}" = friend_id;
        DELETE FROM Labook_friends WHERE "${friendId}" = user_id and "${userId}" = friend_id;
      `);

    }catch(error:any){
      throw new UserCustomError(error.statusCode, error.message);
    };
  }
  //  ------ ------- ----- ---- ---- -- ---- -//
  public login = async (email:string): Promise<UserDTO> => {
    try {
      const result = await UserDatabase.connection(this.Table_users)
      .select().where({email});
      return result[0];
    } catch (error: any) {
      throw new UserCustomError(400, error.message);
    }
  };
  //  ------ ------- ----- ---- ---- -- ---- -//
  public getUsers = async (): Promise<UserDTO[]> => {
    try{
      const allUsers = await UserDatabase.connection(this.Table_users).select()
      return  allUsers;
    }catch(error:any){
      throw new UserCustomError(error.statusCode, error.message);
    };
  };
  //  ------ ------- ----- ---- ---- -- ---- -//
  public getFriends = async (userId:string): Promise<FriendListDTO[]> => {
    try{
      const list = await UserDatabase.connection.select("Labook_users.id ","name","email").from(this.Table_users)
      .innerJoin("Labook_friends"," Labook_users.id","friend_id")
      .where("user_id",userId);
      return list
    }catch(error:any){
      throw new UserCustomError(error.statusCode, error.message);
    };
  }
}

