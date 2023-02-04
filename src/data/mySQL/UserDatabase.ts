import { BaseDatabase } from "./BaseDatabase";
import { UserRepository } from "../../business/repositorys/UserRepository";
import { InputFriendDTO, LoginInput, UserDTO } from "../../model/UserTypes";
import { UserCustomError } from "../../customError/UserCustomError";
import { InvalidBody } from "../../customError/PostCustomError";


export class UserDatabase extends BaseDatabase implements UserRepository{
  private Table_users = "Labook_users";
  private Table_frinds = "Labook_friends";

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
  public addFriend = async (input:InputFriendDTO): Promise<void> => {
    try{
      const createFriendship: InputFriendDTO = {
        id: input.id,
        user_id: input.user_id,
        friend_id: input.friend_id
      }
      await UserDatabase.connection().insert(createFriendship).into(this.Table_frinds)
      
    }catch(error:any){
      throw new UserCustomError(error.statusCode, error.message);
    };
  };

  public login = async (email:string): Promise<UserDTO> => {
    try {
      const result = await UserDatabase.connection(this.Table_users)
      .select().where({email});
      return result[0];
    } catch (error: any) {
      throw new UserCustomError(400, error.message);
    }
  };

  public getUsers = async (): Promise<UserDTO[]> => {
    try{
      const allUsers = await UserDatabase.connection(this.Table_users).select()
      return  allUsers;
    }catch(error:any){
      throw new UserCustomError(error.statusCode, error.message);
    };
  };
}

