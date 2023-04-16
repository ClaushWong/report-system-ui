import "antd/dist/reset.css";
import "@/styles/globals.less";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Provider } from "react-redux";
import { store, persistor } from "@/stores/index";
import { App } from "@/app/index";

import { PersistGate } from "redux-persist/integration/react";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <Provider store={store}>
            <Head>
                <title>Report System</title>
                <meta name="description" content="Report System" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <PersistGate loading={null} persistor={persistor}>
                <App>
                    <Component {...pageProps} />
                </App>
            </PersistGate>
        </Provider>
    );
}

export default MyApp;
