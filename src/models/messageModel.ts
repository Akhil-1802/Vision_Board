import mongoose,{Schema,ObjectId,model,models, } from "mongoose"



export interface IMessage {
    _id?: ObjectId
    senderId: ObjectId
    recieverId : ObjectId
    messages : Array<{
        sender : ObjectId,
        message : string
    }>
}



const MessageSchema = new Schema<IMessage>({
    senderId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    recieverId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    messages : Array
})

const Message = models.messages || model('messages',MessageSchema)

export default Message