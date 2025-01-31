import React from "react";

const SparkleHeading = () => {
  return (
    <>
      <h1
        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 relative"
        style={{
          background: "linear-gradient(90deg, #36A2EB, #87CEFA)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Join Our Team and Build a Future with Us
        <span className="sparkle-container"></span> {/* Sparkle Container */}
      </h1>
    </>
  );
};

export default SparkleHeading;
