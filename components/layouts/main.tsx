import { Button, Layout, Menu, Tooltip } from "antd";
import Logo from "../../public/logobr.svg";
import React, { useEffect } from "react";
import { withTranslation, i18n } from "../../i18n";
import { WithTranslation } from "next-i18next";
import {
  InstagramFilled,
  TwitterCircleFilled,
  MailFilled
} from "@ant-design/icons";
import Link from "next/link";
import Router, { useRouter } from "next/router";

const { Header, Content, Footer } = Layout;

interface Props extends WithTranslation {
  children: React.ReactNode;
}

const MainLayout = ({ children, t }: Props) => {
  const router = useRouter();
  const currLang = router.asPath.startsWith("/en") ? "en" : "ru";
  const newLang = currLang === "ru" ? "en" : "ru";
  const nextUrl = router.asPath.replace(/^\/(ru|en)\//, `/${newLang}/`);
  useEffect(() => {
    if (i18n.language !== currLang) {
      i18n.changeLanguage(currLang);
    }

  }, []);
  return (
    <Layout className="layout">
      <Header style={{ display: "flex", alignItems: "center" }}>
        <Link href="/[lang]/[page]" as={`/${currLang}/1`}>
          <a style={{ height: "64px" }}>
            <Logo height="60" width="150" />
          </a>
        </Link>
        <Menu theme="dark" mode="horizontal" style={{ flex: "1 1 auto" }}>
          <Menu.Item key="blog">
            <a
              href="//blog.booksroutes.info"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("common:blog")}
            </a>
          </Menu.Item>
        </Menu>
        <div>
          <Button
            type="link"
            size="small"
            onClick={() => {
              i18n
                .changeLanguage(newLang)
                .then(() => Router.push(router.pathname, nextUrl));
            }}
          >
            {t("change-locale")}
          </Button>
          <Button
            type="link"
            href="//www.instagram.com/books_routes/"
            target="_blank"
            icon={<InstagramFilled />}
            size="large"
          />
          <Button
            type="link"
            href="//twitter.com/booksroutes"
            target="_blank"
            icon={<TwitterCircleFilled />}
            size="large"
          />
          <Tooltip title="booksroutes.info@gmail.com" placement="bottom">
            <Button
              type="link"
              href="mailto:booksroutes.info@gmail.com"
              icon={<MailFilled />}
              size="large"
            />
          </Tooltip>
        </div>
      </Header>
      <Content style={{ padding: "0 50px" }}>{children}</Content>
      <Footer style={{ textAlign: "center" }}>
        Made with ♥ by{" "}
        <a
          href="http://ideas-band.space"
          rel="noopener noreferrer"
          target="_blank"
        >
          Ideas Band LLC
        </a>{" "}
        © 2018 - {new Date().getFullYear()}
      </Footer>
    </Layout>
  );
};

export default withTranslation("common")(MainLayout);
