import React from "react";

interface Props {
  title: string;
  color?: string;
}

const PageTitle: React.FC<Props> = ({ title, color }) => {
  // let date = new Date().toUTCString().slice(5, 16);

  return (
    <>
      <div className="flex w-full mx-auto mb-6">
        <h1 className={`text-3xl font-medium text-gray-900`}>{title}</h1>
        {/* <p className="text-sm text-dark-1/80 font-medium">{date} </p> */}
      </div>
    </>
  );
};

export default PageTitle;
