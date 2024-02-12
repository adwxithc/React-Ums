import React from 'react'

function FormContainer({children}) {
  return (
    <div className='w-full md:max-w-[40%] shadow-xl  rounded text-center mx-auto mt-20 md:mt-[10%] p-5'>
      {children}
    </div>
  )
}

export default FormContainer
