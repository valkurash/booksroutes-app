import fetch from "node-fetch";
import * as React from "react";
import { withTranslation } from "../../../i18n";
import { WithTranslation } from "next-i18next";
import { useRouter } from "next/router";
import Head from "next/head";
import { Alert, Row, Form, Input, Button } from "antd";

export interface Props extends WithTranslation {
  serverUrl: string;
}

enum EReqState {
  INIT = "INIT",
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR"
}
interface ResetReq {
  code: string;
  email: string;
  password: string;
}
const ResetPassword: React.FunctionComponent<Props> = ({
  t
}: Props) => {
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 8 }
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 8 }
  };

  const router = useRouter();
  const [reqState, setReqState] = React.useState(EReqState.INIT);

  const { email = "", code = "" } = router.query;

  const renderContent = () => {
    const onFinish = async ({ password }: Partial<ResetReq>) => {
      setReqState(EReqState.PENDING);
      try {
        const res = await fetch(`/api/user/reset`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email, code, password })
        });
        const response = await res.json();
        const { errorCode = 0 } = response;
        setReqState(
          errorCode && parseInt(errorCode) ? EReqState.ERROR : EReqState.SUCCESS
        );
      } catch (err) {
        setReqState(EReqState.ERROR);
      }
    };

    if (!email || !code)
      return (
        <Row
          style={{
            display: "flex",
            justifyContent: "center"
          }}
        >
          <Alert
            message={t("common:password-reset-error", { email })}
            type="error"
          />
        </Row>
      );
    if (reqState === EReqState.SUCCESS) {
      return (
        <Row
          style={{
            display: "flex",
            justifyContent: "center"
          }}
        >
          <Alert
            message={t("common:password-reset-success", { email })}
            type="success"
          />
        </Row>
      );
    }
    return (
      <>
        <Form {...layout} name="password-reset" onFinish={onFinish}>
          <Form.Item
            label={t("common:password-new-label")}
            name="password"
            rules={[{ required: true, message: t("common:password-msg") }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button
              type="primary"
              htmlType="submit"
              disabled={reqState === EReqState.PENDING}
            >
              {t("common:submit")}
            </Button>
          </Form.Item>
        </Form>
        {reqState === EReqState.ERROR && (
          <Row
            style={{
              display: "flex",
              justifyContent: "center"
            }}
          >
            <Alert
              message={t("common:password-reset-error", { email })}
              type="error"
            />
          </Row>
        )}
      </>
    );
  };

  return (
    <>
      <Head>
        <title>{t("common:password-reset-title")}</title>
        <meta name="description" content={t("common:books-description")} />
        <meta name="keywords" content={t("common:books-keywords")} />
        <meta
          property="og:url"
          content={`https://booksroutes.info${router.asPath}`}
        />
        <meta property="og:title" content={t("common:password-reset-title")} />
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
      <div style={{ marginTop: "150px" }}>{renderContent()}</div>
    </>
  );
};

export default withTranslation("common")(ResetPassword);
