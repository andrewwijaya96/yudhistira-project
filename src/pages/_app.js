import "../styles/globals.css";
import "../styles/uploader.css";
import "../styles/fileuploader.css"; // Import CSS file

import Layout from "../components/layout";

export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
