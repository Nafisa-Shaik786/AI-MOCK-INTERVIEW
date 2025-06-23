import brackets from "../assets/svg/Brackets";

const TagLine = ({ className = "", children }) => {
  return (
    <div className={`tagline flex items-center text-linkedinBlue-600 font-semibold ${className}`}>
      {brackets("left")}
      <div className="mx-3 text-sm md:text-base">{children}</div>
      {brackets("right")}
    </div>
  );
};

export default TagLine;
