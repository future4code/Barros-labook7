export class UserCustomError extends Error{
  constructor(statusCode:number,message:string){
    super(message)
  }
};

export class InvalidBody extends UserCustomError {
  constructor(){
    super(422,"Parâmetro faltando no body!")
  }
};

export class UserTypeIncorrect extends UserCustomError {
  constructor(){
    super(409,"Todos os parametro do body devem ser uma string")
  };
};

export class InvalidEmail extends UserCustomError {
  constructor(){
    super(409,"Email inválido")
  }
};

export class UserAlreadyCadasted extends UserCustomError{
  constructor(){
    super(422,"Usuario ja casdastrado")
  }
};

export class EmailAlreadyCadasted extends UserCustomError{
  constructor(){
    super(422,"Email já cadastrado")
  }
}