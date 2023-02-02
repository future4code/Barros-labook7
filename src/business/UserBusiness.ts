import {UserCustomError, InvalidBody, UserTypeIncorrect,InvalidEmail, EmailAlreadyCadasted, UserAlreadyCadasted } from "../customError/UserCustomError";
import { UserDTO, UserT } from "../model/UserTypes";
import { UserRepository } from "./repositorys/UserRepository";

export class UserBusiness {
  constructor(private userDatabase: UserRepository){};

  createNewUser = async (input:UserT):Promise<void> => {
    try {
      const { name, email, password } = input;

      if(!name || !email || !password){
        throw new InvalidBody()
      };
      if(typeof(name) !== "string" ||
        typeof(email) !== "string" || typeof(password) !== "string"){
        throw new UserTypeIncorrect()
      };
      if (!email.includes("@")) {
        throw new InvalidEmail();
      };
      const users:UserDTO[] = await this.userDatabase.getUsers();
      const findUser = users.find( (user:UserDTO) => {
        return user.name === name || user.email === email
      });
      
      if(findUser && findUser !== undefined){
        if(findUser.name === name && findUser.email === email){
          throw new UserAlreadyCadasted()
        }else if(findUser.email === email){
          throw new EmailAlreadyCadasted()
        }
      };

      const id: string = Date.now().toString();
      const newUser:UserDTO = {
        id, name, email, password
      };
      await this.userDatabase.createNewUser(newUser);

    }catch (error:any) {
    throw new UserCustomError(error.statusCode, error.message);
   }
  };

  getUsers =async ():Promise<UserDTO[]> => {
    try{
      return await this.userDatabase.getUsers()
    }catch (error:any) {
      throw new UserCustomError(error.statusCode, error.message);
    }
  };
}