
import { PostDTO, PostT, POST_TYPES } from "../model/PostTypes";
import { InvalidBody, InvalidPhotoLength, InvalidTypePost, PostCustomError, PostTypeIncorrect } from "../customError/PostCustomError";
import { PostDatabase } from "../data/mySQL/PostDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { TokenGenerator } from "../services/TokenGenerator";
import { UnauthorizedUser } from "../customError/UserCustomError";

export class PostBusiness {
  constructor(private postDatabase: PostDatabase){};
  private idGenerator = new IdGenerator() 
  private tokenGenerate = new TokenGenerator();

  public createPost =async (input:PostT):Promise<void> => {
    try{
      const { photo, description, type, authorId } = input;
      if(!photo || !description || !type || !authorId){
        throw new InvalidBody
      }else if(type !== POST_TYPES.EVENT && type !== POST_TYPES.NORMAL){
        throw new InvalidTypePost
      }else if(typeof(photo) !== "string" ||typeof(description) !== "string" ||
      typeof(authorId) !== "string"){
        throw new PostTypeIncorrect
      };
      if(photo.length > 255){
        throw new InvalidPhotoLength
      }

      const postId = this.idGenerator.generateId();
      const localDateTime = new Date();
      const newPost:PostDTO = {
        id:postId,
        photo:input.photo,
        description:input.description,
        type:type,
        created_at:localDateTime,
        author_id:input.authorId
      };
      await this.postDatabase.createPost(newPost)

    }catch(error:any){
      throw new PostCustomError(error.statusCode, error.message);
    }
  };
  //  ------ ------- ----- ---- ---- -- ---- -//
  public getAllPosts = async ():Promise<PostDTO[]> => {
    try{
      const allPosts = await this.postDatabase.getAllPosts()
      return allPosts
    }catch(error:any){
      throw new PostCustomError(error.statusCode, error.message);
    };
  };
  //  ------ ------- ----- ---- ---- -- ---- -//
  public getPostById = async (id:string):Promise<PostDTO[]> => {
    try{
      if(!id || id === ":id"){
        throw new PostCustomError(422,"Insira um id")    
      };
      const post = await this.postDatabase.getPostById(id)

      if(post.length < 1 ){
        throw new PostCustomError(404,"Post não encontrado! Verifique o id")
      }
      return post
    }catch(error:any){
      throw new PostCustomError(error.statusCode, error.message);
    };
  };
  //  ------ ------- ----- ---- ---- -- ---- -//
  public getFriendPosts = async (token:string):Promise<PostDTO[]> => {
    try{
      if(!token){
        throw new PostCustomError(422,"É esparado o token do usuário logado")
      };
      
      const tokenData = this.tokenGenerate.tokenData(token)
      
      if(!tokenData.id) {
        throw new UnauthorizedUser()
      };

      const listFriendsPosts = await this.postDatabase.getFriendPosts(tokenData.id);
      return listFriendsPosts;
    }catch(error:any){
      throw new PostCustomError(error.statusCode, error.message);
    };
  };
}   