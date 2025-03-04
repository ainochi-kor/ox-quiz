import React, { PropsWithChildren } from "react";
import { Navigation } from "./Navigation";
import Content from "./Content";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <main>
      <Navigation />
      <Content>{children}</Content>
    </main>
  );
};

export default Layout;
