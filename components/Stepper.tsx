const Stepper = ({
  currentStep,
  setCurrentStep,
}: {
  currentStep: number,
  setCurrentStep: Function
}) => {
  return (
    <ol
      className={
        `flex items-center justify-center w-full p-3 space-x-2 
        text-sm font-bold text-center text-gray-500 bg-white border 
        border-gray-200 rounded-lg shadow-sm md:text-base md:p-4 md:space-x-4`
      }
    >
      <li
        // onClick={() => setCurrentStep(0)}
        className={`flex items-center cursor-pointer ${currentStep == 0 ? "text-primary-blue" : ""}`}>
        <span
          className={
            `font-Inter flex items-center justify-center w-5 h-5 mr-2 text-xs border 
            ${currentStep == 0
              ? "border-primary-blue rounded-full shrink-0"
              : "border-gray-500 rounded-full shrink-0"}`}>
          1
        </span>
        <h1 className="font-Inter hidden sm:inline-flex sm:ml-2">Personal Info</h1>
        <svg
          aria-hidden="true"
          className="w-4 h-4 ml-2 sm:ml-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 5l7 7-7 7M5 5l7 7-7 7"
          ></path>
        </svg>
      </li>
      <li
        // onClick={() => setCurrentStep(1)}
        className={`flex items-center cursor-pointer ${currentStep == 1 ? "text-primary-blue" : ""}`}>
        <span
          className={
            `font-Inter flex items-center justify-center w-5 h-5 mr-2 text-xs border 
            ${currentStep == 1
              ? "border-primary-blue rounded-full shrink-0"
              : "border-gray-500 rounded-full shrink-0"}`}>
          2
        </span>
        <h2 className="font-Inter hidden sm:inline-flex sm:ml-2">Account Info</h2>
        {/* <svg
          aria-hidden="true"
          className="w-4 h-4 ml-2 sm:ml-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 5l7 7-7 7M5 5l7 7-7 7"
          ></path>
        </svg> */}
      </li>
      {/* <li
        // onClick={() => setCurrentStep(2)}
        className={`flex items-center cursor-pointer ${currentStep == 2 ? "text-primary-blue" : ""}`}>
        <span
          className={
            `flex items-center justify-center w-5 h-5 mr-2 text-xs border 
            ${currentStep == 2
              ? "border-primary-blue rounded-full shrink-0"
              : "border-gray-500 rounded-full shrink-0"}`}>
          3
        </span>
        Review
      </li> */}
    </ol>
  );
};

export default Stepper;
