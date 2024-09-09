import React from 'react'
import { MDBSpinner } from 'mdb-react-ui-kit';

function Loading() {
    return (
        <div className='h-screen flex justify-center items-center bg-[#0B0C14] text-gray-200'>
            <MDBSpinner>
            </MDBSpinner>
        </div>
    )
}

export default Loading