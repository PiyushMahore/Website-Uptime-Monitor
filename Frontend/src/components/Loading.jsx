import React from 'react';
import ReactLoading from 'react-loading';

function Loading() {
    const theme = localStorage.getItem("theme")

    return (
        <div className='h-screen w-screen flex justify-center items-center'>
            <ReactLoading color={`${theme === "dark" ? "#ffffff" : "black"}`} type={'spinningBubbles'} height={50} width={50} />
        </div>
    )
}

export default Loading