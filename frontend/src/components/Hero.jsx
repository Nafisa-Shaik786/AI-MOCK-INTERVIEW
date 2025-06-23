
const Hero = ({ userName, onGetStarted }) => {
  return (
    <section className="relative flex items-center justify-center h-[90vh] bg-gradient-to-br from-blue-100 to-white px-6">
      <div className="text-center max-w-4xl">
        <h1 className="text-5xl font-bold text-blue-900 mb-6 leading-tight">
          Hello, {userName}
        </h1>
        <p className="text-lg text-gray-700 mb-10">
          Get your personalized interview experience with AI. Upload your resume
          and get started now!
        </p>
        <button
          onClick={onGetStarted}
          className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg hover:bg-blue-700 transition-all"
        >
          Get Started
        </button>
      </div>

      <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
        <img src={robotImage} alt="Robot" className="w-40 h-auto" />
      </div>
    </section>
  );
};

export default Hero;
