import { Request, Response } from "express";
import { UserBusiness } from "../business/UserBusiness";
import { InputFriend, LoginInput, UserDTO, UserT } from "../model/UserTypes";

export class UserController {
  constructor(private userBusines: UserBusiness){}

  createNewUser = async (req:Request, res:Response):Promise<void> => {
    try{
      const {name, email, password} = req.body;

      const input:UserT = {
        name: name,
        email: email,
        password: password
      };
      const token:string = await this.userBusines.createNewUser(input);

      res.status(201).send({ message: "Usuário criado!", token});
    }catch(error:any){
      res.status(error.statusCode || 400).send(error.message || error.sqlMessage);
    }
  };
  addFriend = async (req:Request, res:Response):Promise<void> => {
    try{
      const token:string = req.headers.authorization as string
      const users:InputFriend = {
        token:token,
        friendId: req.body.friendId
      }
      await this.userBusines.addFriend(users);

      res.status(201).send({ message: "Você fez uma nova amizade!"});
    }catch(error:any){
      res.status(error.statusCode || 400).send(error.message || error.sqlMessage);
    }
  };
  login = async (req:Request, res:Response):Promise<void> => {
    try{
      const inputLogin:LoginInput = {
        email: req.body.email,
        password:req.body.password
      };

      const token:string = await this.userBusines.login(inputLogin);

      res.status(200).send({message: "Online", token});
    }catch(error:any){
      res.status(error.statusCode || 400).send(error.message || error.sqlMessage);
    }
  };

  getUsers = async (req:Request, res:Response):Promise<void> => {
    try{
      const allUsers:UserDTO[] | string = await this.userBusines.getUsers();

      res.status(200).send(allUsers);
    }catch(error:any){
      res.status(error.statusCode || 400).send(error.message || error.sqlMessage);
    }
  };
}