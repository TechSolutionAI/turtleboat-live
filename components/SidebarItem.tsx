import styles from './SidebarItem.module.css'
import { ReactNode } from 'react'

const SidebarItem = ({
  icon,
  label,
  active,
  badge,
  clickFunc
}: {
  icon: ReactNode,
  label: string,
  active?: boolean,
  badge?: number
  clickFunc: Function
}) => {
  return (
    <a
      className={
        `justify-center
          relative
         flex flex-col 
         text-center w-full 
         sm:h-24 sm:py-7 py-5 cursor-pointer
         hover:bg-gray-300 
         ${active ? "bg-white text-tertiary-red border-l-4 border-tertiary-red" : ""}`
      }
      onClick={() => clickFunc()}>
      {icon}
      {
        badge != 0 && (
          <div className="absolute inline-flex items-center justify-center w-4 h-4 text-xs sm:w-6 sm:h-6 sm:text-sm font-bold text-white bg-primary-blue rounded-full top-4 sm:top-3 right-6">{badge}</div>
        )
      }
      <span className="self-center text-sm font-medium mx-4">{label}</span>
    </a>
  );
}

export default SidebarItem