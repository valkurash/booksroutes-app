import { Button, Layout, PageHeader, Tooltip } from 'antd';
import Logo from "../../public/logobr.svg";
import React, { useEffect } from "react";
import { withTranslation, i18n } from "../../i18n";
import { WithTranslation } from "next-i18next";
import {
  InstagramFilled,
  TwitterCircleFilled,
  MailFilled,
  BookFilled
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
        <Header style={{ height: "auto"}}>
          <PageHeader style={{padding:0}}
            title={<Link href="/[lang]/[page]" as={`/${currLang}/1`}>
              <a style={{ height: "60px",display:'block', marginTop:'-8px' }}>
                <Logo height="60" width="150" />
              </a>
            </Link>}
            // subTitle={<>
            //   <SearchBox />
            //   <Hits />
            // </>}
            extra={[
              <Button
                type="link"
                href="//blog.booksroutes.info"
                target="_blank"
                icon={<BookFilled />}
                size="large"
              > {t("common:blog")}</Button>,
                <Button
              type="link"
              href="//www.instagram.com/books_routes/"
              target="_blank"
              icon={<InstagramFilled />}
              size="large"
              />,
              <Button
              type="link"
              href="//twitter.com/booksroutes"
              target="_blank"
              icon={<TwitterCircleFilled />}
              size="large"
              />,
              <Tooltip title="booksroutes.info@gmail.com" placement="bottom">
              <Button
              type="link"
              href="mailto:booksroutes.info@gmail.com"
              icon={<MailFilled />}
              size="large"
              />
              </Tooltip>,
              <Button
                type="link"
                size="large"
                onClick={() => {
                  i18n
                    .changeLanguage(newLang)
                    .then(() => Router.push(router.pathname, nextUrl));
                }}
              >
                {t("change-locale")}
              </Button>
            ]}
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
