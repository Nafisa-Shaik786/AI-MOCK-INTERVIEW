import SectionSvg from "../assets/svg/SectionSvg";

const Section = ({
  className,
  id,
  crosses,
  crossesOffset,
  customPaddings,
  children,
}) => {
  return (
    <div
      id={id}
      className={`relative ${
        customPaddings ??
        `py-10 lg:py-16 xl:py-20 ${crosses ? "lg:py-32 xl:py-40" : ""}`
      } ${className || ""}`}
    >
      {children}

      {/* Left vertical line */}
      <div
        aria-hidden="true"
        className="hidden absolute top-0 left-5 w-px h-full bg-gray-300 pointer-events-none md:block lg:left-8 xl:left-10"
      />

      {/* Right vertical line */}
      <div
        aria-hidden="true"
        className="hidden absolute top-0 right-5 w-px h-full bg-gray-300 pointer-events-none md:block lg:right-8 xl:right-10"
      />

      {crosses && (
        <>
          {/* Horizontal line */}
          <div
            aria-hidden="true"
            className={`hidden absolute top-0 left-8 right-8 h-px bg-gray-300 ${
              crossesOffset || ""
            } pointer-events-none lg:block xl:left-10 xl:right-10`}
          />
          <SectionSvg crossesOffset={crossesOffset} />
        </>
      )}
    </div>
  );
};

export default Section;
