"use client";
import { IUser } from "@/models/usermodel";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

function ChangePassword({ user }: { user: IUser }) {
  const [passwordAvailable, setPasswordAvailable] = useState<boolean>(false);
  const [password , setPassword] = useState<string>('')
  const [confirmPassword , setconfirmPassword] = useState<string>('')
  const handleChangePassword = async() =>{
    try {
      const response = await fetch(`/api/changePassword?id=${user._id}`,{
        method : "POST",
        headers : {'Content-Type':'application/json'},
      })
      if(response.ok){
        toast.success('Password Change Link sent in mail!')
      }
      else{
        toast.error('Link already Sent!')
      }
    } catch (error) {
      console.log(error)
      toast.error("Internal Server Error!")
    }
  }
  const handleSubmit = async () =>{
    try {
        if(password.length <6 || confirmPassword.length < 6){
            toast.error('Password length should be greater than 6!',{
                style :{background : 'red',border :'2px solid red'}
            })
            return ;
        }
        if(password !== confirmPassword){
            toast.error('Confirm Password does not match password',{
                style : {background:'red',border:'2px solid red'}
            });
            return;
        }
        const res = await fetch('/api/setPassword',{
            method : 'PUT',
            headers : {'Content-Type':'application/json'},
            body : JSON.stringify({password , id : user._id})

        })
        if(res.ok){
            toast.success('Password Updated Successfully!',{
                style : {background : 'green',border :'2px solid green'}
            })
            location.reload()
        }
    } catch (error) {
      console.log(error)
        toast.error('Internal Server Error!',{
            style : {background:'red',border:'2px solid red'}
        });
    }
  }
  useEffect(() => {
    if (user.password) {
      setPasswordAvailable(true);
    } else {
      setPasswordAvailable(false);
    }
  }, [user]);
  return (
    <div>
      {passwordAvailable ? (
        <div className="flex flex-col justify-center items-center gap-4 py-10">
        <h1 className="text-3xl text-center font-bold ">Want to Change Password?</h1>
        <h1 onClick={()=>handleChangePassword()} className="text-center py-3 cursor-pointer text-blue-400 underline ">Click on this link to Change your password</h1>
        </div>
      ) : (
        // Set password
        <>
          <div className="flex flex-col gap-3 items-center justify-center container mx-auto">
            <h1 className="text-3xl text-center font-bold mb-4">Set Password</h1>

                <input
                type="password"
                placeholder="Password"
                className="input input-neutral bg-white border-2"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                />
                <input
                type="password"
                placeholder="Confirm Password"
                className="input input-neutral bg-white border-2"
                value={confirmPassword}
                onChange={(e)=>setconfirmPassword(e.target.value)}
                />
                <button onClick={()=>handleSubmit()} className="btn">Confirm</button>
          </div>
        </>
      )}
    </div>
  );
}

export default ChangePassword;
