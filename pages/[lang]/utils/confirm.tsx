import fetch from "node-fetch";
import { GetServerSideProps } from "next";
import * as React from "react";
import { withTranslation } from "../../../i18n";
import { WithTranslation } from "next-i18next";
import { Row } from "antd";
import { Alert } from "antd";
import { useRouter } from "next/router";
import Head from "next/head";

export interface Props extends WithTranslation {
  email: string;
  errorCode: number;
}

const Confirm: React.FunctionComponent<Props> = ({
  email,
  errorCode,
  t
}: Props) => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>{t("common:confirm-title")}</title>
        <meta name="description" content={t("common:books-description")} />
        <meta name="keywords" content={t("common:books-keywords")} />
        <meta
          property="og:url"
          content={`https://booksroutes.info${router.asPath}`}
        />
        <meta property="og:title" content={t("common:confirm-title")} />
        <meta
          property="og:description"
          content={t("common:books-description")}
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://booksroutes.info/images/og-image.jpg"
        />
      </Head>
      <Row
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: "150px"
        }}
      >
        {!errorCode ? (
          <Alert
            message={t("common:confirm-success", { email })}
            type="success"
          />
        ) : (
          <Alert message={t("common:confirm-error", { email })} type="error" />
        )}
      </Row>
    </>
  );
};

// This also gets called at build time
// @ts-ignore
export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { email = "", code = "" } = query;
  if (!email || !code) {
    return { props: { errorCode: 404, email } };
  }
  const res = await fetch(`${process.env.SERVER_URL}/api/user/confirm`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, code })
  });
  const response = await res.json();
  const { errorCode = 0 } = response;
  // Pass post data to the page via props
  return { props: { errorCode: parseInt(errorCode), email } };
};

export default withTranslation("common")(Confirm);
