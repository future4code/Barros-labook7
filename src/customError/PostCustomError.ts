export class PostCustomError extends Error{
  constructor(statusCode:number,message:string){
    super(message)
  }
};

export class InvalidBody extends PostCustomError {
  constructor(){
    super(422,"Parâmetro faltando no body!")
  }
};
export class InvalidTypePost extends PostCustomError{
  constructor(){
    super(409,"Coloque o tipo de post correto! ex:NORMAL, EVENT")
  }
};
export class PostTypeIncorrect extends PostCustomError {
  constructor(){
    super(409,"Todos os parametro do body devem ser uma string")
  };
};
export class InvalidPhotoLength extends PostCustomError {
  constructor(){
    super(409,"Coloque um link de imagem menor")
  }
};

