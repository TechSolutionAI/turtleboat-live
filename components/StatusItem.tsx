const StatusItem = ({
  label,
  active,
}: {
  label: string,
  active?: boolean,
}) => {
  return (
    <div
      className={
        `justify-center
         flex flex-col 
         text-center
         px-4
         sm:py-3 py-4
         rounded-full
         min-w-fit
         ${active ? "bg-tertiary-green text-secondary-green border-l-1 border-tertiary-green" : "bg-secondary-gray-2 text-secondary-gray-4 border-l-1 border-secondary-gray"}`
      }
      >
      <span className="self-center text-sm font-medium">{label}</span>
    </div>
  );
}

export default StatusItem