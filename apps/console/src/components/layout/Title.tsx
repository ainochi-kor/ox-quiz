import React from "react";

interface TitleProps {
  title: string;
  description: string;
}

const Title: React.FC<TitleProps> = ({ title, description }) => {
  return (
    <header className="flex flex-col justify-center items-start">
      <h1 className="text-4xl font-bold">{title}</h1>
      <p className="text-lg">{description}</p>
    </header>
  );
};

export default Title;
