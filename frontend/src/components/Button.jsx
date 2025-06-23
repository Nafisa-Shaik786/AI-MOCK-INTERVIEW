// src/components/Button.jsx
const Button = ({
  className = "",
  href,
  onClick,
  children,
  px = "px-7",
}) => {
  const buttonClasses = `
    relative inline-flex items-center justify-center h-11 rounded-md 
    ${px} bg-white border border-linkedinBlue-600
    hover:text-linkedinBlue-700 hover:bg-linkedinBlue-100
    transition duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-linkedinBlue-400
    active:bg-linkedinBlue-700 active:text-white
    font-semibold z-10
    ${className}
  `;

  const content = (
    <span className="z-10">{children}</span>
  );

  if (href) {
    return (
      <a href={href} onClick={onClick} className={buttonClasses}>
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={buttonClasses}>
      {content}
    </button>
  );
};

export default Button;
