import * as jwt from "jsonwebtoken";
import { AuthenticationToken } from "../model/Authentication";

export class TokenGenerator {
  private jwt_key = process.env.JWT_KEY as string;

  public generateToken = (id:string) => {
    const token = jwt.sign(
      {id},
      this.jwt_key,
      {expiresIn: "5h"}
    );
    return token
  };

  public tokenData = (token: string): AuthenticationToken => {
    const payload = jwt.verify(
      token,
      this.jwt_key,
    ) as jwt.JwtPayload
    return {id:payload.id as string}
  }

};