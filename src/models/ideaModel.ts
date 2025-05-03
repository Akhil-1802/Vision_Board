import mongoose,{Schema,model,models,ObjectId} from "mongoose";
import { IUser } from "./usermodel";


export interface IdeaI {
    _id ?: ObjectId
    title : string
    description : string
    category : string
    image : string
    idea : string
    createdBy : ObjectId
    createdAt ? : Date
    views : number
    user_details? : IUser[]
    likedby ?:Array<string> 
    updatedAt?:Date
}



const IdeaSchema = new Schema<IdeaI>({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String ,
        required : true
    },
    image : {
        type : String,
        required : true
    },
    category : {
        type: String,
        required : true
    },
    idea : {
        type : String ,
        required : true
    },
    views : {
      type : Number,
      default : 0  
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to your User model
        required: true,
      },
      likedby: [{ type: String }],
} , {timestamps : true})


const Idea = models.ideas || model('ideas',IdeaSchema)

export default Idea