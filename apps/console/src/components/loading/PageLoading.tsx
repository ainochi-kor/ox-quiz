import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const PageLoading: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <AiOutlineLoading3Quarters size={40} />
    </div>
  );
};

export default PageLoading;
