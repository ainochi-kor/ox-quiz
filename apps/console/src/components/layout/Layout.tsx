import React, { PropsWithChildren, Suspense } from "react";
import { Navigation } from "./Navigation";
import Content from "./Content";
import PageLoading from "../loading/PageLoading";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <main className="flex flex-col flex-1 w-full">
      <Navigation />

      <Content>
        <Suspense fallback={<PageLoading />}>{children}</Suspense>
      </Content>
    </main>
  );
};

export default Layout;
