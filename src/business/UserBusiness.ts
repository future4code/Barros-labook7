import {UserCustomError, InvalidBody, UserTypeIncorrect,InvalidEmail, EmailAlreadyCadasted, UserAlreadyCadasted, InvalidPassword, UnauthorizedUser, UserNotFound } from "../customError/UserCustomError";
import { InputFriend, InputFriendDTO, LoginInput, UserDTO, UserT } from "../model/UserTypes";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { TokenGenerator } from "../services/TokenGenerator";
import { UserRepository } from "./repositorys/UserRepository";

export class UserBusiness {
  private hashManager = new HashManager();
  private tokenGenerate = new TokenGenerator();
  private idGenerator = new IdGenerator();

  constructor(private userDatabase: UserRepository){};

  createNewUser = async (input:UserT):Promise<string> => {
    try {
      const { name, email, password } = input;

      if(!name || !email || !password){
        throw new InvalidBody()
      };
      if(typeof(name) !== "string" ||
        typeof(email) !== "string" || typeof(password) !== "string"){
        throw new UserTypeIncorrect()
      };
      if(!email.includes("@")) {
        throw new InvalidEmail();
      }else if(password.length < 6){
        throw new InvalidPassword()
      }


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

      const id:string = this.idGenerator.generateId();
      const hashPass:string = await this.hashManager.generateHash(password);

      const newUser:UserDTO = {
        id:id,
        name:name, 
        email:email, 
        password:hashPass
      };
      await this.userDatabase.createNewUser(newUser);
      const token = this.tokenGenerate.generateToken(id)

      return token;
    }catch (error:any) {
    throw new UserCustomError(error.statusCode, error.message);
   }
  };
  public addFriend = async (input:InputFriend): Promise<void> => {
    try{
      const {friendId, token} = input;
      if(!friendId){
        throw new UserCustomError(422,"Você precisa passar o id do outro usuário")
      }else if(!token){
        throw new UserCustomError(422,"Você precisa passar o seu token no autorization")
      };
    
      const tokenData = this.tokenGenerate.tokenData(token)
      if(!tokenData.id) {
        throw new UnauthorizedUser()
      };
      
      const users:UserDTO[] = await this.userDatabase.getUsers();
      const findFriend =  users.find( (user:UserDTO) => {
        return user.id === friendId;
      });
      
      if(!findFriend){
        throw new UserCustomError(404,`Usuário não encontrado`)
      }
      
      const friendShip:InputFriendDTO = {
        id: this.idGenerator.generateId(),
        user_id: tokenData.id,
        friend_id: friendId
      };
      
      await this.userDatabase.addFriend(friendShip)
    }catch(error:any){
      throw new UserCustomError(error.statusCode, error.message);
    };
  };

  public login = async (input: LoginInput): Promise<string> => {
    try {
      const { email, password } = input;
    
      if(!email || !password){
        throw new InvalidBody()
      } else if(!email.includes("@")){
        throw new InvalidEmail();
      };

      const user:UserDTO = await this.userDatabase.login(email);
      const users:UserDTO[] = await this.userDatabase.getUsers();

      if(users.length < 1 && !user){
        throw new UserCustomError(400,"Você não possui uma conta! Faça uma")
      }else if(!user){
        throw new UserNotFound()
      };
      

      const comparPassword:boolean = await this.hashManager.compareHash(password,user.password);
      if(!comparPassword){ 
        throw new InvalidPassword()
      };

      const token = this.tokenGenerate.generateToken(user.id)
     
      return token
    } catch (error: any) {
      throw new UserCustomError(error.statusCode, error.message);
    }
  };
  getUsers = async ():Promise<UserDTO[] | string> => {
    try{
      const allUsers = await this.userDatabase.getUsers()
      if(allUsers.length < 1){
        return "Nenhum usuário cadastrado"
      }else{
        return allUsers
      };
    }catch (error:any) {
      throw new UserCustomError(error.statusCode, error.message);
    }
  };
}