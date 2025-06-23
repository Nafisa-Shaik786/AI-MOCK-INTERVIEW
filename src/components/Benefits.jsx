import { benefits } from "../constants";
import Heading from "./Heading";
import Section from "./Section";
import { GradientLight } from "./design/Benefits";
import ClipPath from "../assets/svg/ClipPath";

const Benefits = () => {
  return (
    <Section id="features">
      <div className="container relative z-20">
        <Heading
          className="md:max-w-md lg:max-w-2xl"
          title="Ace Your Interview with MockAI"
          text="Get tailored insights, practice smartly, and build confidence to land your dream job."
        />

        <div className="flex flex-wrap gap-10 mb-10">
          {benefits.map((item) => (
            <div
              className="block relative p-0.5 bg-no-repeat bg-[length:100%_100%] md:max-w-[24rem]"
              style={{
                backgroundImage: `url(${item.backgroundUrl})`,
              }}
              key={item.id}
            >
              <div className="relative z-20 flex flex-col p-[2rem] pointer-events-none">
                <h5 className="h5 mb-5 via-white">{item.title}</h5>
                <p className="body-2 mb-6 fill-white">{item.text}</p>
              </div>

              {item.light && <GradientLight />}

              <div
                className="absolute inset-0. bg from-white"
                style={{ clipPath: "url(#benefits)" }}
              >
                <div className="absolute inset-0 opacity-0 transition-opacity hover:opacity-10">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      width={380}
                      height={362}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>

              <ClipPath />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Benefits;
