import { PostBusiness } from "../business/PostBusiness";
import { PostT } from "../model/PostTypes";
import {Request, Response} from "express"


export class PostController {
  constructor(private postBusiness: PostBusiness){};

  createPost =async (req:Request, res:Response):Promise<void> => {
    try{
      const { photo, description, type, authorId } = req.body;
      const input:PostT = {
        photo: photo,
        description: description,
        type: type, 
        authorId: authorId
      };
      await this.postBusiness.createPost(input)

      res.status(201).send({ message: "Post criado com sucesso!" })
    }catch(error:any){
      res.status(error.statusCode || 400).send(error.message || error.sqlMessage);
    }
  };
  getAllPosts = async (req:Request, res:Response):Promise<void> => {
    try{
      const allPosts = await this.postBusiness.getAllPosts()
      res.status(200).send(allPosts)
    }catch(error:any){
      res.status(error.statusCode || 400).send(error.message || error.sqlMessage);
    };
  };
  getPostById =async (req:Request, res:Response):Promise<void> => {
    try{
      const id = req.params.id

      const post = await this.postBusiness.getPostById(id)
      res.status(200).send(post)
    }catch(error:any){
      res.status(error.statusCode || 400).send(error.message || error.sqlMessage);
    };
  }

}