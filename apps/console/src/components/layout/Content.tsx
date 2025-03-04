import React, { PropsWithChildren } from "react";

const Content: React.FC<PropsWithChildren> = ({ children }) => {
  return <section className="mt-2 flex-1 w-full">{children}</section>;
};

export default Content;
