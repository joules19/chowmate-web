// import { clsx, type ClassValue } from "clsx";
// import { twMerge } from "tailwind-merge";
// import { FC } from "react";

// // Utility Function: Merge Tailwind classes
// function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs));
// }

// type ButtonMode = "black" | "solid" | "outline" | "outline-neutral" | "google";

// interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
//   disabled?: boolean;
//   buttonText: string;
//   rightImageIcon?: any;
//   leftImageIcon?: any;
//   loading?: boolean;
//   defaultColor?: string;
//   hoverColor?: string;
//   mode: ButtonMode;
// }

// export const Button: FC<ButtonProps> = ({
//   className,
//   buttonText,
//   disabled,
//   rightImageIcon,
//   leftImageIcon,
//   loading,
//   defaultColor = "primary",
//   hoverColor = "primary/90",
//   mode,
//   ...props
// }) => {
//   // Define mode-specific styles
//   const baseButtonStyles = cn(
//     "flex flex-1 justify-center items-center gap-2 rounded-[5px] w-full h-full transition-all duration-300 ease-in-out transform active:scale-95 cursor-pointer"
//   );

//   const buttonStyles = {
//     black: cn(
//       baseButtonStyles,
//       "outline bg-dark-1 text-white text-sm hover:bg-dark-1/90 hover:shadow-lg disabled:cursor-not-allowed"
//     ),
//     solid: cn(
//       baseButtonStyles,
//       "outline",
//       `bg-${defaultColor} text-white text-sm hover:bg-${hoverColor} disabled:cursor-not-allowed`
//     ),
//     outline: cn(
//       baseButtonStyles,
//       "border-2 bg-transparent",
//       `border-primary-1 text-${hoverColor} hover:bg-${hoverColor} hover:border-[0px] hover:text-white disabled:cursor-not-allowed`
//     ),
//     "outline-neutral": cn(
//       baseButtonStyles,
//       "border bg-transparent",
//       `border-dark-1 text-dark-1 hover:bg-${hoverColor} hover:text-dark-1 disabled:cursor-not-allowed`
//     ),
//     google: cn(
//       baseButtonStyles,
//       "border bg-transparent",
//       `border-dark-3 text-dark-1 hover:bg-${hoverColor} hover:text-dark-1 disabled:cursor-not-allowed`
//     ),
//   };

//   // Render the button with appropriate styles and content
//   return (
//     <button
//       type="button"
//       disabled={loading || disabled}
//       className={cn(buttonStyles[mode], className)}
//       {...props}
//     >
//       {leftImageIcon && mode === "google" && (
//         <img
//           className="w-[24px] h-[24px] bg-cover mr-2"
//           src={leftImageIcon}
//           alt="icon"
//         />
//       )}
//       {leftImageIcon && mode !== "google" && (
//         <div className="mr-2">{leftImageIcon}</div>
//       )}
//       {/* {loading ? <Spinner /> : buttonText} */}
//       {rightImageIcon && <div className="ml-2">{rightImageIcon}</div>}
//     </button>
//   );
// };
