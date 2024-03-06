import Image from 'next/image'
import LemonadeSvg from '/public/static/images/lemonade.svg';

const LemonadePanel = () => {

    return (
        <div className="shadow-md rounded-lg px-6 py-5 flex flex-col justify-between">
            <div className='flex flex-col justify-center'>
                <p className='truncate text-lg font-bold font-Inter py-4 flex gap-x-2'>
                    {/* <Image src={lemonade_img} alt={'Coffee Chat Icon'} />Coffee Chat</p> */}
                    <LemonadeSvg alt={'Coffee Chat Icon'} />Coffee Chat</p>
                <div className="flex -space-x-3 items-center py-3">
                    <img className="w-9 h-9 border-2 border-white rounded-full" src={"/user.png"} alt={"ddd"} />
                    <img className="w-9 h-9 border-2 border-white rounded-full" src={"/user.png"} alt={"ddd"} />
                    <img className="w-9 h-9 border-2 border-white rounded-full" src={"/user.png"} alt={"ddd"} />
                    <img className="w-9 h-9 border-2 border-white rounded-full" src={"/user.png"} alt={"ddd"} />
                    <a className="flex items-center justify-center w-9 h-9 text-full font-medium text-white bg-gradient-to-r from-[#B32F1A] to-[#DF897C] border-2 border-white rounded-full" href="#">+5</a>
                    <p className='text-[14px] text-secondary-gray-4 truncate pl-6'>
                        Pros and cons of lidar technology
                    </p>
                </div>
                <div className="flex -space-x-3 items-center py-3">
                    <img className="w-9 h-9 border-2 border-white rounded-full" src={"/user.png"} alt={"ddd"} />
                    <img className="w-9 h-9 border-2 border-white rounded-full" src={"/user.png"} alt={"ddd"} />
                    <img className="w-9 h-9 border-2 border-white rounded-full" src={"/user.png"} alt={"ddd"} />
                    <img className="w-9 h-9 border-2 border-white rounded-full" src={"/user.png"} alt={"ddd"} />
                    <a className="flex items-center justify-center w-9 h-9 text-full font-medium text-white bg-gradient-to-r from-[#B32F1A] to-[#DF897C] border-2 border-white rounded-full" href="#">+5</a>
                    <p className='text-[14px] text-secondary-gray-4 truncate pl-6'>
                        Creating a survey
                    </p>
                </div>
            </div>
            <div className="pt-5 flex justify-end font-Inter">
                <button
                    className="bg-primary-blue text-white active:bg-primary-blue px-6 py-3 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                >
                    New discussion
                </button>
            </div>
        </div>
    )
}

export default LemonadePanel;