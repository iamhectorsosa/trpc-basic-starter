import type { AppType } from "next/app";
import { trpc } from "../utils/trpc";

const MyApp: AppType = ({ Component, pageProps }) => {
    return (
        <>
            <Component {...pageProps} />
            <style jsx>{styles}</style>
        </>
    );
};

export default trpc.withTRPC(MyApp);

// CODE BELOW IS NOT PART OF tRPC SETUP

const styles = `
  div {
    font-family: 'system-ui';
    width: 90vw;
    margin-inline: auto;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  h1, h2, p, a {
    margin-block: 0.5rem;
  }
  p {
    line-height: 1.5;
  }
  a {
    text-decoration: none;
  }
  form {
    display: grid;
    grid-template-columns: 1fr 6fr;
    gap: 1rem;
    margin-block: 1rem;
  }
`;
