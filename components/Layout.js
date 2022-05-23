import React, { createRef, useEffect } from "react";
import Headtags from "./Headtags";
import nprogress from "nprogress";
import Router, { useRouter } from "next/router";



function Layout({ children, user }) {
  const contextRef = createRef();
  const router = useRouter();
  const messagesRoute = router.pathname === "/messages";

  Router.onRouteChangeStart = () => nprogress.start();
  Router.onRouteChangeComplete = () => nprogress.done();
  Router.onRouteChangeError = () => nprogress.done();

  return (
    <>
      <Headtags />
      {children}
    </>
  );
}

export default Layout;


