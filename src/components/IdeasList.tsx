import React from 'react'
import Card from './Card'
import useSWR from 'swr';
import { fetcher } from '../lib/fetcher';
import { IdeaI } from '@/models/ideaModel';


function IdeasList() {
  const { data } = useSWR('/api/getAllIdeas', fetcher, {
    refreshInterval: 3000, // every 3 seconds
  });
  const Ideas = data?.Ideas || [];
  return (
    <div className="container mx-auto my-6 px-10 ">
            <h1 className="text-xl font-bold text-center  max-xl:text-center">Recommended Ideas</h1>
            <div className="flex flex-wrap gap-4 justify-center">
              {Ideas.length === 0 ?
              <div className='text-center my-4 font-semibold text-xl'>No Ideas</div>
              :
                Ideas.map((idea : IdeaI)=>(
                  <Card key={idea._id?.toString()} idea={idea} />
                ))
              }

            </div>
        </div>
  )
}

export default IdeasList
