import { IoRocketOutline } from "react-icons/io5";
import { BiSolidShoppingBags } from "react-icons/bi";
import { MdBusinessCenter } from "react-icons/md";
import { FaTools } from "react-icons/fa";

function Services() {
    return (
        <div className='mt-8 services pt-12 flex flex-col items-center justify-center gap-12'>
            <h1 className='text-4xl font-semibold'>Made for you —</h1>
            <div className='flex flex-wrap w-full justify-center gap-4'>
                <div className='hover:scale-110 transition-all ease-in-out duration-500 dark:bg-[#131117] flex flex-col justify-center items-center p-8 gap-2 w-[20%] rounded-lg'>
                    <IoRocketOutline color="green" size={30} />
                    <h4 className="text-xl font-semibold">Startups</h4>
                    <p className="text-center">You’ve just launched your project, and want to minimise risk of downtime</p>
                </div>
                <div className='hover:scale-110 transition-all ease-in-out duration-500 dark:bg-[#131117] flex flex-col justify-center items-center p-8 gap-2 w-[20%] rounded-lg'>
                    <MdBusinessCenter color="green" size={30} />
                    <h4 className="text-xl font-semibold">Business</h4>
                    <p className="text-center">You need to avoid lost revenue from a website outage</p>
                </div>
                <div className='hover:scale-110 transition-all ease-in-out duration-500 dark:bg-[#131117] flex flex-col justify-center items-center p-8 gap-2 w-[20%] rounded-lg'>
                    <BiSolidShoppingBags color="green" size={30} />
                    <h4 className="text-xl font-semibold">E-Commerce</h4>
                    <p className="text-center">You need to keep your online retail business running 24/7</p>
                </div>
                <div className='hover:scale-110 transition-all ease-in-out duration-500 dark:bg-[#131117] flex flex-col justify-center items-center p-8 gap-2 w-[20%] rounded-lg'>
                    <FaTools color="green" size={30} />
                    <h4 className="text-xl font-semibold">Developers</h4>
                    <p className="text-center">You need advanced settings to set up requests and responses</p>
                </div>
            </div>
        </div>
    )
}

export default Services