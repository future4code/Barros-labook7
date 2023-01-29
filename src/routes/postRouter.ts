import express from "express";
import { PostBusiness } from "../business/PostBusiness";
import { PostController } from "../controller/PostController";
import { PostDatabase } from "../data/mySQL/PostDatabase";

export const postRouter = express.Router();

const postDatabase = new PostDatabase();
const postBusiness = new PostBusiness(postDatabase);
const postController = new PostController(postBusiness);

postRouter.get("/all",(req,res) => postController.getAllPosts(req,res));
postRouter.get("/:id",(req,res) => postController.getPostById(req,res));
postRouter.post("/create",(req,res) => postController.createPost(req,res));
