"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

function ChangePassword() {
  const router = useRouter()
  const [show, setshow] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setconfirmPassword] = useState<string>("");
  const [passwordError, setpasswordError] = useState<boolean>(false);
  const [ token , settoken] = useState<string>('')
  const [confirmPasswordError, setconfirmPasswordError] = useState<boolean>(false);
  const handleSubmit = async () => {
    if (password.length < 6) {
      setpasswordError(true);
      return;
    }
    if (confirmPassword.length < 6) {
      setconfirmPasswordError(true);
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Password and Confirm Password does not match!")
      return
    }
    try {
      const res = await fetch(`/api/newPassword`,{
        method : "POST",
        headers : {"Content-Type":"application/json"},
        body : JSON.stringify({token,password})
      })
      if(res.ok){
        toast.success('Password Changed Successfully',{
          style :{background : 'green' , border :'green'}
        })
        router.push('/')
      }
    } catch (error) {
      console.log(error)
      toast.error("Internal Server Error!")
    }
  };
  const checkTokenValidity = async (token: string) => {
    const res = await fetch(`/api/passwordtokenvalidity?token=${token}`);
    if (res.ok) {
      setshow(true);
    }
  };
  useEffect(() => {
    const token = window.location.search.split("token=")[1];
    if (token) {
      settoken(token)
      checkTokenValidity(token);
    }
  }, []);

  return (
    <div>
      {show ? (
        <div className="flex items-center justify-center flex-col h-96 mx-auto gap-4">
          <h1 className="text-3xl text-center font-bold mb-4">
            Set New Password
          </h1>
          <input
            type="password"
            placeholder="Password"
            className="input input-neutral bg-white border-2"
            value={password}
            onChange={(e) =>{
              setpasswordError(false)
              setPassword(e.target.value)}}
          />
          {passwordError && (
            <p className="text-red-400  text-sm">
              Password length should be greater than 6
            </p>
          )}
          <input
            type="password"
            placeholder="Confirm Password"
            className="input input-neutral bg-white border-2"
            value={confirmPassword}
            onChange={(e) =>{
              setconfirmPasswordError(false)
              setconfirmPassword(e.target.value)}}
          />
          {confirmPasswordError && (
            <p className="text-red-400 p-1 text-sm">
              Confirm Password length should be greater than 6
            </p>
          )}
          <button
            onClick={() => handleSubmit()}
            className="btn bg-pink-500 border-pink-500"
          >
            Confirm
          </button>
        </div>
      ) : (
        <div>
          <h1 className="text-2xl text-center">Invalid Request</h1>
        </div>
      )}
    </div>
  );
}

export default ChangePassword;
