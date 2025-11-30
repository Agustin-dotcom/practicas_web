interface CartItemProps{
    qty: number
}
export default function AddSubtractQuantityOrDeleteItemButtons({qty}:CartItemProps)
{
  return(
    <div className='grid grid-cols-4'>
      <div>
        <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300">
          -
        </button>
      </div>
      <div className='text-black'>
        {qty}
      </div>
      <div>
        <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300">
          +
      </button>
      </div>
        <div>
          <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-3 md: h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
    </div>
  );
}