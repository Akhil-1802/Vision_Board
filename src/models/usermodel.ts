import mongoose,{ ObjectId, Schema} from 'mongoose'


export interface IUser {
    username? : string
    email : string
    _id ?: ObjectId | string
    image  : string
    password ?: string
    updatedAt? : Date
    createdAt? : Date
    changePasswordtoken ?: string
    changePasswordtime? : Date
    contacts ?: Array<IUser>
}


const UserSchema:Schema = new Schema<IUser>({
    username : {
        type: String,
        required : true,
        unique : true
    },
    password : {
        type : String
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    image : {
        type : String,
        default : '/icon.jpg'
    },
    changePasswordtime : Date,
    changePasswordtoken : String,
    contacts : Array
},{timestamps : true})

const User = mongoose.models.users || mongoose.model<IUser>('users',UserSchema)

export default User