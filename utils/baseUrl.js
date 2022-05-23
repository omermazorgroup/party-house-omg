const baseUrl =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:3000"
    : "https://party-house-omg.herokuapp.com";

export default baseUrl;
