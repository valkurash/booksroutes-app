import fetch from "node-fetch";
import { GetServerSideProps } from "next";
import * as React from "react";
import { withTranslation, i18n } from "../../i18n";
import { WithTranslation } from "next-i18next";
import { Row, Col, Card, Pagination } from "antd";
const { Meta } = Card;
import Link from "next/link";
import Router, { useRouter } from "next/router";
import Head from "next/head";
import { BookEntity } from "./books/[...slug]";

export interface Props extends WithTranslation {
  books: BookEntity[];
  total: number;
  page: number;
  lang: string;
}

const Books: React.FunctionComponent<Props> = ({
  books,
  total,
  page,
  lang,
  t
}: Props) => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>{t("common:books-title", { page })}</title>
        <meta name="description" content={t("common:books-description")} />
        <meta name="keywords" content={t("common:books-keywords")} />
        <meta
          property="og:url"
          content={`https://booksroutes.info${router.asPath}`}
        />
        <meta property="og:title" content={t("common:books-title", { page })} />
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
      <Row gutter={16} style={{ padding: "20px 0" }}>
        {books.map((book: BookEntity) => (
          <Col xs={12} sm={10} md={8} lg={6} xl={4} key={book.id}>
            <Link
              href="/[lang]/books/[...slug]"
              as={`/${lang}/books/${book.id}/${book.routes[0].id}`}
            >
              <a>
                <Card
                  bordered={false}
                  hoverable
                  cover={
                    <div
                      style={{
                        background: "#eee",
                        display: "block",
                        width: "100%",
                        height: "auto",
                        position: "relative",
                        overflow: "hidden",
                        paddingTop: "160%"
                      }}
                    >
                      <img
                        style={{
                          display: "block",
                          width: "100%",
                          height: "100%",
                          position: "absolute",
                          top: 0,
                          bottom: 0,
                          left: 0,
                          right: 0
                        }}
                        alt={book.title}
                        src={book.coverImg.url}
                      />
                    </div>
                  }
                  style={{ marginBottom: 10 }}
                >
                  <Meta
                    title={book.title}
                    description={book.authors.reduce(
                      (acc, item) => `${(acc && acc + ", ") || ""}${item.name}`,
                      ""
                    )}
                  />
                </Card>
              </a>
            </Link>
          </Col>
        ))}
      </Row>
      <Row style={{ display: "flex", justifyContent: "center" }}>
        <Pagination
          current={page}
          onChange={p => Router.push(`/[lang]/[page]`, `/${lang}/${p}`)}
          defaultCurrent={1}
          total={total}
          pageSize={18}
          showSizeChanger={false}
          hideOnSinglePage
        />
      </Row>
    </>
  );
};

// This also gets called at build time
// @ts-ignore
export const getServerSideProps: GetServerSideProps = async ({
  params = {},
  req
}) => {
  const lang = req ? (req as any).language : i18n.language || "ru";
  const res = await fetch(
    `http://booksroutes.info:1400/api/book?join=routes&page=${params.page ||
      1}&limit=18`
  );
  const books = await res.json();
  const { data = [], total = 0, page = 0 } = books.result;
  // Pass post data to the page via props
  return { props: { books: data, total, page, lang } };
};

export default withTranslation("common")(Books);
