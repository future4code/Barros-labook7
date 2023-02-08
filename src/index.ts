import {app} from "./app";
import { postRouter } from "./routes/postRouter";
import { userRouter } from "./routes/userRouter";



app.use("/user",userRouter);
app.use("/post",postRouter);
