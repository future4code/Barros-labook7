import { PostRepository } from "../../business/repositorys/PostRepository";
import { BaseDatabase } from "./BaseDatabase";
import { PostDTO } from "../../model/PostTypes";
import { PostCustomError } from "../../customError/PostCustomError";

export class PostDatabase extends BaseDatabase implements PostRepository {
  Table_name = "Labook_posts";

  createPost = async (input:PostDTO) => {
    try{
      const newPost:PostDTO = {
        id:input.id,
        photo:input.photo,
        description:input.description,
        type:input.type,
        created_at:input.created_at,
        author_id:input.author_id
      };

      await PostDatabase.connection.insert(newPost).into(this.Table_name)
    }catch(error:any){
      throw new PostCustomError(error.statusCode, error.message);
    }
  };
  getAllPosts = async ():Promise<PostDTO[]> => {
    try{
      const allPosts = await PostDatabase.connection(this.Table_name).select()
      return allPosts
    }catch(error:any){
      throw new PostCustomError(error.statusCode, error.message);
    };
  };
  getPostById = async (id:string):Promise<PostDTO[]> => {
    try{
      const post = await PostDatabase.connection(this.Table_name).where("id",id)
      return post
    }catch(error:any){
      throw new PostCustomError(error.statusCode, error.message);
    };
  }

};