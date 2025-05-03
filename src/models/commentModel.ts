import { Schema, model, models, ObjectId } from "mongoose";
import { IUser } from "./usermodel";
import mongoose from "mongoose";

export interface IComments {
  _id?: ObjectId;
  IdeaId: ObjectId;
  UserId: ObjectId;
  comment : string
  UserDetails?: Array<IUser>;
  createdAt?: Date;
  updatedAt?: Date;
}

const CommentSchema = new Schema<IComments>({
  IdeaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Idea",
    required: true,
  },
  comment :{
    type : String,
    required : true
  },
  UserId :{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
},{timestamps : true});

const Comment = models.comments || model('comments',CommentSchema)

export default Comment
