import { IUser } from "@/models/usermodel";
import Ideas from "./Ideas";
import Image from "next/image";
const getUser = async (id: string) => {
  const res = await fetch(`https://vision-board-cyan.vercel.app/api/getUserDetails?id=${id}`, {
    cache: "no-store", // recommended for dynamic SSR
  });
  if (!res.ok) {
    console.error("Failed to fetch user:", res.statusText);
    return
  }
  const data = await res.json();
  return data.user; // assuming response is { user: { ... } }
};


export default async function Profile({
  params,
}: {params:Promise<{id : string}>}) {
  const { id } = await params;
  const user: IUser = await getUser(id);

  return (
    <div className="flex max-md:flex-col max-md:justify-center max-md:items-center my-10 container mx-auto gap-6">
      <div className="relative mt-4">
        <div className="border-2 border-t-5 border-r-5 border-black absolute right-10 px-6 py-3 rounded-lg -top-4 z-10 bg-white text-black font-bold  w-44 text-center text-xl ">{user.username}</div>
        <div className="border-3 rounded-2xl border-b-8 border-r-6 bg-pink-600 border-black w-68 h-[350px] flex items-center justify-center flex-col gap-2 ">
            <div className="border-black border-2 rounded-full bg-white w-[140px] h-[140px] flex items-center justify-center">
                <Image width={140} height={140}  src={user.image ? user.image.toString():'/profile.png'} className="w-full h-full bg-cover " alt="" />
            </div>
          <h3 className="text-white font-bold">@{user.username?.toLocaleUpperCase()}</h3>
        </div>
      </div>

      
      <Ideas id={id} />
     
    </div>
  );
}
