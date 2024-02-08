import Image from 'next/image';
import AttachedUser from '/public/static/images/attached_user.svg'
import IconDocument from '/public/static/images/document.svg'

const Attached = () => {
    return (
        <div className='border-b border-[#6F727A] py-[15px]'>
            <div className='flex items-center gap-x-3'>
                {/* <Image src={attached_user} alt='attached_user' className='w-[33px] h-[33px]' /> */}
                <AttachedUser alt='attached_user' className='w-[33px] h-[33px]' />
                <label className='text-[16px] text-[#333333]'>Attached is my user Journey Map</label>
            </div>
            <div className='flex items-center text-[#2E65F3] pl-[20px] mt-[10px] gap-x-2'>
                {/* <Image src={ico_document} alt='ico_doc' /> */}
                <IconDocument alt='ico_doc' />
                <label className='text-[14px] font-semibold'>Anthony Customer Journey Worksheet</label>
            </div>
        </div>
    )
}
export default Attached;