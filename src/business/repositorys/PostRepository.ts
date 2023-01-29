import { PostDTO } from "../../model/PostTypes";


export interface PostRepository {
  createPost(input:PostDTO):Promise<void>;
  getAllPosts():Promise<PostDTO[]>;
  getPostById(input:string):Promise<PostDTO[]>;
}