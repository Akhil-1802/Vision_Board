
import { CreateIdea } from '@/components/CreateIdea'

async function Page({
    params,
  }: 
      {params:Promise<{id : string}>}
  ) {
    const { id } = await params
  return (
    <div>
        <div className='bg-pink-500 py-10'>
            <div className='p-4 bg-black text-white w-[480px] mx-auto text-center max-sm:w-68 '>
                <h1 className='text-4xl font-bold py-2 max-sm:text-2xl max-sm:py-1'>SUBMIT YOUR IDEA</h1>
            </div>
        </div>
            {/* Create Idea */}
        <CreateIdea id={id}/>  
      
    </div>
  )
}

export default Page
