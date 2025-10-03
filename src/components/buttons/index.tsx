import { FC, ReactNode } from "react";

interface ButtonTheme {
  primary: string;
  secondary: string;
  third: string;
  category: string;
  arrow: string;
  add: string;
  cta: string;
  cta2: string;
}

const Theme: ButtonTheme = {
  primary:
    "bg-primary text-black hover:text-primary border-primary hover:bg-opacity-0 px-[2.94rem] py-[1.19rem] rounded-[0.94rem]",
  secondary:
    "bg-[rgba(249,_249,_249,_0.20)] border-[rgba(249,_249,_249,_0.20)] text-white hover:bg-black/[.5] hover:border-white px-[1.5rem] lg:px-[2.94rem] py-[1.19rem] rounded-[0.94rem]",
  third:
    "bg-primary text-black hover:text-primary border-primary hover:bg-opacity-0 px-[2rem] h-[3.13rem] rounded-[0.94rem]",
  category:
    "bg-primary text-black hover:text-primary border-primary hover:bg-opacity-0 px-[2rem] h-[3.13rem] rounded-[0.5rem]",
  cta: "bg-primary text-black hover:text-primary border-primary hover:bg-opacity-0 px-[2.94rem] py-[1.19rem] rounded-[0.94rem] w-full md:w-fit",
  cta2: "bg-[rgba(249,_249,_249,_0.20)] border-[rgba(249,_249,_249,_0.20)] text-white hover:bg-black/[.5] hover:border-white px-[1.5rem] lg:px-[2.94rem] py-[1.19rem] rounded-[0.94rem] w-full md:w-fit",
  arrow:
    "bg-[rgba(249,_249,_249,_0.20)] text-white border-[rgba(249,_249,_249,_0.20)] hover:bg-black/[.5] hover:border-white h-[3.13rem] w-[3.13rem] rounded-[0.94rem]",
  add: "bg-[rgba(249,_249,_249,_0.20)] text-white border-[rgba(249,_249,_249,_0.20)] hover:bg-black/[.5] hover:border-white h-[3.13rem] w-[3.13rem] rounded-[0.5rem]",
};

// 1. UPDATED: Added 'className' to BtnProps
interface BtnProps {
  type: string;
  children: ReactNode;
  height?: string;
  width?: string;
  onClick?: () => void;
  className?: string; // 👈 FIX: Allow external classes to be passed in
}


// 2. UPDATED: Accepted 'className' as a prop
const Btn: FC<BtnProps> = ({ type, children, onClick, className }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      // 3. UPDATED: Append the passed-in 'className' to the existing classes
      className={`${
        Theme[type as keyof ButtonTheme]
      } text-[1.125rem] font-lato font-bold border-2 flex justify-center items-center ${className || ''}`}
    >
      {children}
    </button>
  );
};

export default Btn;
