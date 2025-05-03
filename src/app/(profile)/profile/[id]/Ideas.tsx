'use client'
import { Card } from '@/components'
import RowOfRectangleLoaders from '@/components/CardLoader'
import { IdeaI } from '@/models/ideaModel'
import React, { useEffect, useState } from 'react'

function Ideas({id} : {id : string}) {
    const [ ideas , setIdeas ] = useState<Array<IdeaI>>()
    const [ loading , setloading ] = useState<boolean>()
    

    useEffect(()=>{
        const getIdeas = async() =>{
            setloading(true)        
             try {
                   const res = await fetch(`/api/getMyIdeas?id=${id}`)
                   const data = await res.json()
               if(res.ok){
                   setIdeas(data.ideas)
                   setloading(false)
               }
               else{
                setIdeas([])
            }
        } catch (error) {
                 setIdeas([])
                setloading(false)
                console.log(error)
             }
            
            
        }
        getIdeas()
    },[id])
  return (
    <div className='flex flex-wrap gap-3'>
        {
            loading && <RowOfRectangleLoaders/>
        }
        {
            (ideas?.length === 0 && !loading) && <h1 className='text-center text-2xl'>You have not published any Idea</h1>
        }
        {
            ideas?.map((idea:IdeaI) =>(
                <Card key={idea._id?.toString()} idea={idea} />
            ))
        }
    </div>
  )
}

export default Ideas
