import App from "next/app";
import "../styles/tailwind-index.css";
import axios from "axios";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { parseCookies, destroyCookie } from "nookies";
import baseUrl from "../utils/baseUrl";
import { redirectUser } from "../utils/authUser";
import Layout from "../components/Layout";
import "react-toastify/dist/ReactToastify.css";
import "semantic-ui-css/semantic.min.css";

function MyApp({ Component, pageProps }) {
  return (
    <Layout {...pageProps}>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </Layout>
  );
}

MyApp.getInitialProps = async ({ Component, ctx }) => {


  const { token } = parseCookies(ctx);

  let pageProps = {};

  const protectedRoutes =
    ctx.pathname === "/" ||
    ctx.pathname === "/[username]" ||
    ctx.pathname === "/user/[userId]/following" ||
    ctx.pathname === "/user/[userId]/followers" ||
    ctx.pathname === "/post/[postId]" ||
    ctx.pathname === "/notifications" ||
    ctx.pathname === "/chats" ||
    ctx.pathname === "/settings";

  if (!token) {
    console.log(ctx.pathname);

    protectedRoutes && redirectUser(ctx, "/login");

  } else {

    if (Component.getInitialProps) {

      pageProps = await Component.getInitialProps(ctx);

    }

    try {
      const res = await axios.get(`${baseUrl}/api/auth`, {
        headers: { Authorization: token },
      });
      const { user, userFollowStats } = res.data;

      if (user) !protectedRoutes && redirectUser(ctx, "/");

      pageProps.user = user;


      pageProps.userFollowStats = userFollowStats;
    } catch (error) {
      destroyCookie(ctx, "token");
      redirectUser(ctx, "/login");
    }
  }
  return { pageProps };

};

export default MyApp;
