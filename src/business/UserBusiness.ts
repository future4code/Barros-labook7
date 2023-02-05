import {UserCustomError, InvalidBody, UserTypeIncorrect,InvalidEmail, EmailAlreadyCadasted, UserAlreadyCadasted, InvalidPassword, UnauthorizedUser, UserNotFound } from "../customError/UserCustomError";
import { FriendListDTO, InputFriend, InputFriendDTO, LoginInput, UserDTO, UserT } from "../model/UserTypes";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { TokenGenerator } from "../services/TokenGenerator";
import { UserRepository } from "./repositorys/UserRepository";

export class UserBusiness {
  private hashManager = new HashManager();
  private tokenGenerate = new TokenGenerator();
  private idGenerator = new IdGenerator();

  constructor(private userDatabase: UserRepository){};

  public createNewUser = async (input:UserT):Promise<string> => {
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

      //lista de todos usuários, ultilizo aqui somente para verificações
      const users:UserDTO[] = await this.userDatabase.getUsers();
      const findUser = users.find( (user:UserDTO) => {
        return user.name === name || user.email === email
      });
      // verifica se ja existe o usuário cadastrado
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
  //  ------ ------- ----- ---- ---- -- ---- -//
  public  addFriend = async (input:InputFriend): Promise<void> => {
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
      
      //lista de todos usuários, ultilizo aqui somente para verificações
      const users:UserDTO[] = await this.userDatabase.getUsers();
      const findFriend =  users.find( (user:UserDTO) => {
        return user.id === friendId;
      });
      
      if(!findFriend){
        throw new UserCustomError(404,`**invalid friendId** Usuário não encontrado`)
      }else if(friendId === tokenData.id){
        throw new UserCustomError(409, "Você não pode fazer amizade consigo mesmo!")
      }
      // lista de amigos do usuário logado, ultilizo aqui somente para verificações
      const listFriends = await this.userDatabase.getFriends(tokenData.id);
      
      for(let i = 0; i < listFriends.length; i++){
        if(listFriends[i].id === friendId){
          throw new UserCustomError(409,"Você já é amigo dessa pessoa!")
        }
      };

      const friendShip1:InputFriendDTO = {
        id: this.idGenerator.generateId(),
        user_id: tokenData.id,
        friend_id: friendId
      };
      const friendShip2:InputFriendDTO = {
        id: this.idGenerator.generateId(),
        user_id: friendId,
        friend_id: tokenData.id
      }
      
      // estou fazendo duas insercao no banco de dados ao mesmo tempo abaixo
      // porque eu estou usando so uma tabela de amigos mas quando eu adicionava um amigo
      // ele era meu amigo mas eu nao ficava sendo dele entao eu fiz a dessa forma para tentar mudar isso
      // no codigo e na minha cabeça esta funcionando certo, ao menos da forma que eu queria
      await this.userDatabase.addFriend(friendShip1) 
      await this.userDatabase.addFriend(friendShip2)
    }catch(error:any){
      throw new UserCustomError(error.statusCode, error.message);
    };
  };
  //  ------ ------- ----- ---- ---- -- ---- -//
  public removeFriend = async (input:InputFriend):Promise<void> => {
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

      //lista de todos usuários, ultilizo aqui somente para verificações
      const users:UserDTO[] = await this.userDatabase.getUsers();
      const searchUser:UserDTO | undefined =  users.find( (user:UserDTO) => {
        return user.id === friendId;
      });
      if(!searchUser){
        throw new UserCustomError(404,"**invalid friendId** Usuário não encontrado!")
      };

      // lista de amigos do usuário logado, ultilizo aqui somente para verificações
      const listFriends:FriendListDTO[] = await this.userDatabase.getFriends(tokenData.id);
      const findFriend:FriendListDTO | undefined= listFriends.find((user) => {
        return user.id === friendId;
      })
      if(!findFriend){
        throw new UserCustomError(404,"Você não tem amizade com essa pessoa")
      };

      await this.userDatabase.removeFriend(tokenData.id,friendId);
  };
  //  ------ ------- ----- ---- ---- -- ---- -//
  public login = async (input: LoginInput): Promise<string> => {
    try {
      const { email, password } = input;
    
      if(!email || !password){
        throw new InvalidBody()
      } else if(!email.includes("@")){
        throw new InvalidEmail();
      };

      const user:UserDTO = await this.userDatabase.login(email);
      // lista de usuários, ultilizo aqui somente para verificações
      const users:UserDTO[] = await this.userDatabase.getUsers();

      if(users.length < 1 && !user){
        throw new UserCustomError(400,"Você não possui uma conta ainda")
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
  //  ------ ------- ----- ---- ---- -- ---- -//
  public getUsers = async ():Promise<UserDTO[] | string> => {
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
  //  ------ ------- ----- ---- ---- -- ---- -//
  public getFriends = async (token:string):Promise<FriendListDTO[] | string> => {
    try{
      const tokenData = this.tokenGenerate.tokenData(token);
      const friends:FriendListDTO[] = await this.userDatabase.getFriends(tokenData.id);
      if(friends.length < 1){
        return "Você ainda não tem nenhum amigo :("
      }else{
        return friends
      };
    }catch (error:any) {
      throw new UserCustomError(error.statusCode, error.message);
    }
  };
}