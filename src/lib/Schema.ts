import {z} from 'zod'



export const IdeaSchema = z.object({
    title : z.string().min(1,'Title is required'),
    description : z.string().min(50,'Description must contain atleast 50 words'),
    category : z.string().min(1,'Category is required'),
    image : z.string()
    .url()
    .refine(async(url)=>{
        try {
            const res = await fetch(url,{method:'HEAD'})
            const contenttype  = res.headers.get("content-type")

            return contenttype?.startsWith('image/')
        } catch  (error) {
            console.log(error)
            return false
        }
    })
})


export const UserSchema = z.object({
    username : z.string().min(1,'Please Provide Username'),
    email : z.string().min(1,'Please Provide Email'),
    password : z.string().min(6,'Password must contain 6 characters'),
})

export const LoginSchema = z.object({
    email : z.string().min(1,'Please Provide Email'),
    password : z.string().min(6,'Password must contain 6 characters'),
})