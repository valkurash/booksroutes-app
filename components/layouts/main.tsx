import { Button, Layout, Menu,Tooltip } from "antd";
import Logo from "../../public/logo-short.svg";
import React from "react";
import { withTranslation, Link } from "../../i18n";
import { WithTranslation } from "next-i18next";
import { InstagramFilled, TwitterCircleFilled, MailFilled } from "@ant-design/icons";

const { Header, Content, Footer } = Layout;

interface Props extends WithTranslation {
  children: React.ReactNode;
}

const MainLayout = ({ children, t }: Props) => {
  return (
    <Layout className="layout">
      <Header style={{display:'flex', alignItems: 'center'}}>
        <Link href="/">
          <a style={{height:'64px'}}>
          <Logo height="60" width="150"/>
          </a>
        </Link>
        <Menu theme="dark" mode="horizontal" style={{flex: '1 1 auto'}}>
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
          <Button type="link" href="//www.instagram.com/books_routes/" target="_blank" icon={<InstagramFilled />} size="large" />
          <Button type="link" href="//twitter.com/booksroutes" target="_blank" icon={<TwitterCircleFilled />} size="large" />
          <Tooltip title="booksroutes.info@gmail.com" placement="bottom">
            <Button type="link" href="mailto:booksroutes.info@gmail.com" icon={<MailFilled />} size="large" />
          </Tooltip>,
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

export default withTranslation()(MainLayout);
