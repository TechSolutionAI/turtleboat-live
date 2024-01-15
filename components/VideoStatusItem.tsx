const VideoStatusItem = ({
    value,
}: {
    value: string,
}) => {
    return (
        <div
            className={
                `justify-center flex flex-col text-center px-4 sm:py-2 py-1 rounded-full w-fit
                ${
                    value == 'public' ? "bg-tertiary-green text-secondary-green border-l-1 border-tertiary-green" : 
                    value == 'private' ? "bg-secondary-gray-2 text-secondary-gray-4 border-l-1 border-secondary-gray" : "bg-secondary-red-1 text-tertiary-red border-l-1 border-secondary-red-1" 
                }`
            }
        >
            <span className="self-center text-sm font-medium">{value.charAt(0).toUpperCase() + value.slice(1)}</span>
        </div>
    );
}
  
export default VideoStatusItem