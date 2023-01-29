import { BaseDatabase } from "./BaseDatabase";
import { UserRepository } from "../../business/repositorys/UserRepository";
import { UserDTO } from "../../model/UserTypes";
import { UserCustomError } from "../../customError/UserCustomError";


export class UserDatabase extends BaseDatabase implements UserRepository{
  Table_name = "Labook_users";
  public createNewUser = async (input:UserDTO):Promise<void> => {
    try{
      const newUser = {
          id: input.id,
          name: input.name,
          email: input.email,
          password: input.password
      };
      await UserDatabase.connection.insert(newUser).into(this.Table_name)

    }catch(error:any){
      throw new UserCustomError(error.statusCode, error.message);
    };
  }; 
  public getUsers = async (): Promise<UserDTO[]> => {
    try{
      const allUsers = await UserDatabase.connection(this.Table_name).select()
      return  allUsers;
    }catch(error:any){
      throw new UserCustomError(error.statusCode, error.message);
    };
  }

}

