import React from "react";
import IconSection from "./IconSection";
import SparkleHeading from "../SparklingHeading";

const CareersHero: React.FC = () => {
  return (
    <section className="bg-primary- flex flex-col ">
      <div className="max-w-4xl text-center">
        <SparkleHeading />
        <p className="text-lg text-gray-600 mb-16">
          We’re always looking for passionate, talented individuals to help us
          grow and deliver the best products to our customers.
        </p>
        <IconSection />
        <button
          style={{
            background: "linear-gradient(90deg, #36A2EB, #87CEFA)",
          }}
          className="bg-[#36A2EB] text-white px-8 py-4 rounded-md text-lg font-semibold hover:bg-primary-2 transition duration-300 ease-in-out"
        >
          Explore Careers
        </button>
      </div>
    </section>
  );
};

export default CareersHero;
