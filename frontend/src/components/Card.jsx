import React from 'react'
import { Badge } from "@/components/ui/badge"

const Card = () => {
  return (
    <div className='grid grid-cols-8 gap-7 m-4 p-3'>
      {/* left section */}
      <div className='text-right flex flex-col items-end'>
        <h2 className='text-2xl text-white font-bold font-sans '>24</h2>
        <h2 className='text-2xl text-white font-bold font-sans '>May</h2>
        <div className='mt-2 mb-4'>
          <p className='text-white -rotate-90 origin-right'>@saayush615</p>
        </div>
      </div>

      {/* right section */}
      <div className='col-span-7'>
        <div className='text-2xl mb-5 font-sans font-bold'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </div>
        <div className='text-white my-2'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore, pariatur. Fugit sapiente eligendi iure beatae tempora illum quaerat veritatis exercitationem consequatur dicta omnis debitis alias obcaecati ipsum cupiditate autem voluptatibus sequi quasi consectetur, tenetur rem. Non doloremque totam nesciunt ut, laboriosam ullam error repudiandae quas maiores praesentium vero harum dignissimos voluptatem beatae dolorum, nulla, laborum ratione possimus animi natus facilis itaque amet! Illum impedit praesentium, ab repellendus temporibus a facilis veritatis similique iure consectetur deleniti iste, non minus tenetur perspiciatis!
        </div>
        <div>
          <Badge variant="default" className='text-white bg-blue-500 m-2'>Tech</Badge>
          <Badge variant="default" className='text-white bg-red-500 m-2'>Begginers</Badge>
          <Badge variant="default" className='text-white bg-green-500 m-2'>Linux</Badge>
        </div>
      </div>
      
    </div>
  )
}

export default Card
