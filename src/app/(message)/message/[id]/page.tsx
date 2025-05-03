import React from 'react'
import SideBar from '../SideBar'


async function Message({params}:{params:Promise<{id : string}>}) {
   const {id} = await params
    return (
    <div className='flex w-full'>
        

      {/* Peoples section */}
      <SideBar id = {id}/>
    </div>
  )
}

export default Message
