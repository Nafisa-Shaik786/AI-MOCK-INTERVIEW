import React from "react";
import Section from "./Section";

const Footer = () => {
  return (
    <Section crosses className="!px-0 !py-10 bg-linkedinBlue-900 text-white">
      <div className="container flex sm:justify-between justify-center items-center gap-10 max-sm:flex-col">
        <p className="caption text-linkedinBlue-200 lg:block text-sm">
          © {new Date().getFullYear()} MockAI. All rights reserved.
        </p>
      </div>
    </Section>
  );
};

export default Footer;
