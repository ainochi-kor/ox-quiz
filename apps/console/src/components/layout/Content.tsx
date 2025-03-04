import React, { PropsWithChildren } from "react";

const Content: React.FC<PropsWithChildren> = ({ children }) => {
  return <section className="mt-2">{children}</section>;
};

export default Content;
