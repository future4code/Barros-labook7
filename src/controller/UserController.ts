import { Request, Response } from "express";
import { UserBusiness } from "../business/UserBusiness";
import { UserDTO, UserT } from "../model/UserTypes";

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
      await this.userBusines.createNewUser(input);

      res.status(201).send({ message: "Usuário criado!" });
    }catch(error:any){
      res.status(error.statusCode || 400).send(error.message || error.sqlMessage);
    }
  };
  getUsers = async (req:Request, res:Response):Promise<void> => {
    try{
      const allUsers:UserDTO[] = await this.userBusines.getUsers();

      res.status(200).send(allUsers);
    }catch(error:any){
      res.status(error.statusCode || 400).send(error.message || error.sqlMessage);
    }
  };

}