import IconList from "../IconList";
import ChangePassword from "./ChangePassword";

const getUser = async (id: string) => {
    const res = await fetch(`http://localhost:3000/api/getUserDetails?id=${id}`, {
      cache: "no-store", // recommended for dynamic SSR
    });
    if (!res.ok) {
      console.error("Failed to fetch user:", res.statusText);
      return
    }
    const data = await res.json();
    return data.user; // assuming response is { user: { ... } }
  };
export default async function Settings({params} : {params:Promise<{id : string}>}){
    const { id } = await params
    const user = await getUser(id)
    return (
        <div >
            {/* Update your profile picture */}
            <div className="flex flex-col container mx-auto my-10 p-2 gap-6">
                <h1 className="text-3xl text-center font-bold ">Update Your Profile</h1>
                <div className="flex flex-col items-center justify-evenly">
                    <IconList user={user}/>
                </div>
            </div>
                <div className="border-dotted border-[0.5px] border-gray-400 w-full h-0 my-4"></div>
                <div className="h-60 my-10 ">
                  <ChangePassword user={user} />
                </div>
        </div>
    )
}