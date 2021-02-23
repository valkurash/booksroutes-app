import { Button, Layout, PageHeader, Tooltip, Dropdown, Menu } from "antd";
import Logo from "../../public/logobr.svg";
import React, { useEffect } from "react";
import { withTranslation, i18n } from "../../i18n";
import { WithTranslation } from "next-i18next";
import {
  InstagramFilled,
  TwitterCircleFilled,
  MailFilled,
  BookFilled,
  EllipsisOutlined,
  TranslationOutlined
} from "@ant-design/icons";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { InstantSearch } from "react-instantsearch-dom";
import { indexName, searchClient } from "../instantsearch";

const { Header, Content, Footer } = Layout;

interface Props extends WithTranslation {
  children: React.ReactNode;
}

const MainLayout = ({ children, t }: Props) => {
  const router = useRouter();
  const currLang = router.asPath.startsWith("/en") ? "en" : "ru";
  const newLang = currLang === "ru" ? "en" : "ru";
  const nextUrl = router.asPath.replace(/^\/(ru|en)\//, `/${newLang}/`);

  const menuItems = (mobile: boolean = false) => [
    <Button
        key="blog"
      className={mobile ? "mobile-menu" : "pc-menu"}
      type="link"
      href="//blog.booksroutes.info"
      target="_blank"
      icon={<BookFilled />}
      size="large"
    >
      {t("common:blog")}
    </Button>,
    <Button
        key="instagram"
      className={mobile ? "mobile-menu" : "pc-menu"}
      type="link"
      href="//www.instagram.com/books_routes/"
      target="_blank"
      icon={<InstagramFilled />}
      size="large"
    >{mobile ? "Instagram" : ""}</Button>,
    <Button
        key="twitter"
      className={mobile ? "mobile-menu" : "pc-menu"}
      type="link"
      href="//twitter.com/booksroutes"
      target="_blank"
      icon={<TwitterCircleFilled />}
      size="large"
    >{mobile ? "Twitter" : ""}</Button>,
    ...(mobile
      ? [
          <Button
              key="mail"
            className="mobile-menu"
            type="link"
            href="mailto:booksroutes.info@gmail.com"
            icon={<MailFilled />}
            size="large"
          >booksroutes.info@gmail.com</Button>
        ]
      : [
          <Tooltip
              key="tooltip"
            className="pc-menu"
            title="booksroutes.info@gmail.com"
            placement="bottom"
          >
            <Button
              type="link"
              href="mailto:booksroutes.info@gmail.com"
              icon={<MailFilled />}
              size="large"
            />
          </Tooltip>
        ]),
    <Button
        key="lang"
      className={mobile ? "mobile-menu" : "pc-menu"}
      type="link"
      size="large"
      icon={<TranslationOutlined />}
      onClick={() => {
        i18n
          .changeLanguage(newLang)
          .then(() => Router.push(router.pathname, nextUrl));
      }}
    >
      {t("change-locale")}
    </Button>
  ];

  const menu = (
    <Menu>
      {menuItems(true).map((item, i) => (
        <Menu.Item key={i}>{item}</Menu.Item>
      ))}
    </Menu>
  );

  const DropdownMenu = () => {
    return (
      <Dropdown key="more" overlay={menu} className="mobile-menu">
        <Button
          style={{
            marginTop: "10px"
          }}
        >
          <EllipsisOutlined
            style={{
              fontSize: 20,
              verticalAlign: "top"
            }}
          />
        </Button>
      </Dropdown>
    );
  };

  useEffect(() => {
    if (i18n.language !== currLang) {
      i18n.changeLanguage(currLang);
    }
  }, []);

  return (
    <InstantSearch
      indexName={indexName}
      searchClient={searchClient}
      // resultsState={this.props.resultsState}
      // onSearchStateChange={this.props.onSearchStateChange}
      // searchState={this.props.searchState}
    >
      <Layout className="layout">
        <Header style={{ height: "auto" }}>
          <PageHeader
            style={{ padding: 0 }}
            title={
              <Link href="/[lang]/[page]" as={`/${currLang}/1`}>
                <a
                  style={{
                    height: "60px",
                    display: "block",
                    marginTop: "-8px"
                  }}
                >
                  <Logo height="60" width="150" />
                </a>
              </Link>
            }
            // subTitle={<>
            //   <SearchBox />
            //   <Hits />
            // </>}
            extra={[...menuItems(), <DropdownMenu key="mobileMenu" />]}
          />
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
    </InstantSearch>
  );
};

export default withTranslation("common")(MainLayout);
