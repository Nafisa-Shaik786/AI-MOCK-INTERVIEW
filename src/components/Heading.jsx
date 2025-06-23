import TagLine from "./Tagline";

const Heading = ({ className = "", title, text, tag }) => {
  return (
    <div className={`${className} max-w-[50rem] mx-auto mb-12 lg:mb-20 md:text-center`}>
      {tag && (
        <TagLine className="mb-4 md:justify-center text-linkedinBlue-600 font-semibold">
          {tag}
        </TagLine>
      )}
      {title && (
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
          {title}
        </h2>
      )}
      {text && (
        <p className="mt-4 text-gray-600 text-base md:text-lg max-w-xl mx-auto">
          {text}
        </p>
      )}
    </div>
  );
};

export default Heading;
