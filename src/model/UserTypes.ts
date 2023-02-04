export interface UserDTO {
  id: string,
  name: string,
  email: string,
  password: string
};

export type UserT = {
  name: string,
  email: string,
  password: string
};


export type InputFriend = {
  token: string,
  friendId: string
};

export interface InputFriendDTO {
  id:string,
  user_id:string,
  friend_id:string
};

export type LoginInput = {
  email: string,
  password: string
};
