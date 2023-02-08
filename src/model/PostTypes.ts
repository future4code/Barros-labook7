export enum POST_TYPES {
  NORMAL = "normal",
  EVENT = "event"
}

export type PostT = {
  photo: string,
  description: string,
  type: POST_TYPES,
  authorId: string
};

export interface PostDTO {
  id: string,
  photo: string,
  description: string,
  type: POST_TYPES,
  created_at?: Date,
  author_id: string
}