export class UserCustomError extends Error{
  public readonly statusCode:number;
  constructor(statusCode:number,message:string){
    super(message)
    this.statusCode = statusCode
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
};

export class InvalidPassword extends UserCustomError{
  constructor(){
    super(409,"Senha invalida, deve conter 6 ou mais caracteres")
  }
};
export class UnauthorizedUser extends UserCustomError{ 
  constructor(){
      super(401, "Usuário não autorizado")
  }
};

export class UserNotFound extends UserCustomError{ 
  constructor(){
    super(404, "Usuário não encontrado")
  }
};