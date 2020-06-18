import fetch from "node-fetch";
import { GetServerSideProps } from "next";
import { Layout, Menu, Breadcrumb, Collapse, Divider } from "antd";
import * as React from "react";
import { i18n, withTranslation } from "../../../i18n";
import { WithTranslation } from "next-i18next";
import Link from "next/link";
import ReactDOM from "react-dom";
import { useRouter } from "next/router";

import dynamic from "next/dynamic";
import Head from "next/dist/next-server/lib/head";

const RouteMap = dynamic(() => import("../../../components/map"), {
  ssr: false
});
const { Panel } = Collapse;
const { Content, Sider } = Layout;

interface Route {
  id: number;
  name: string;
  countries: string[];
  languages: string[];
}
export interface BookEntity {
  id: number;
  isbn: string;
  title: string;
  coverImg: { id: number; url: string; name: string };
  description: string;
  authors: Array<{
    id: number;
    avatar: string;
    name: string;
  }>;
  routes: Route[];
}
export interface Shape {
  id: number;
  name: string;
  points: Point[];
  googlemymap?: string;
}
export interface Point {
  id: number;
  name: string;
  order: number;
  description: string;
  shape: { type: "Point" | "Polygon" | "LineString"; coordinates: any[] };
}
export interface Props extends WithTranslation {
  book: BookEntity;
  bookId: string;
  routeId: string;
  lang: string;
  shape: Shape;
}

const Book: React.FunctionComponent<Props> = ({
  book = {} as BookEntity,
  bookId,
  lang,
  t,
  routeId,
  shape
}: Props) => {
  const route =
    book.routes.find(route => routeId === route.id.toString()) || ({} as Route);
  const { points = [] } = shape || {};
  const [selectedPoint, setSelectedPoint] = React.useState<Point>();
  const siderRef = React.useRef<any>();
  const refs = points.reduce((acc: any, value) => {
    acc[value.id] = React.useRef<any>(null);
    return acc;
  }, {});

  React.useEffect(() => {
    if (selectedPoint) {
      const sider = ReactDOM.findDOMNode(siderRef.current);
      const node = ReactDOM.findDOMNode(refs[selectedPoint.id].current);
      console.log(refs[selectedPoint.id].current, node);
      (sider as HTMLElement).scrollTop = (node as HTMLElement).offsetTop;
      // (node as HTMLElement).scrollIntoView({
      //   behavior: "smooth",
      //   block: "start"
      // });
    }
  }, [selectedPoint]);
  const router = useRouter();
  return (
    <>
      <Head>
        <title>{t("common:book-route-title", { title: book.title })}</title>
        <meta
          name="description"
          content={t("common:book-route-description", { title: book.title })}
        />
        <meta
          name="keywords"
          content={t("common:book-route-keywords", { title: book.title })}
        />
        <meta
          property="og:url"
          content={`https://booksroutes.info${router.asPath}`}
        />
        <meta
          property="og:title"
          content={t("common:book-route-title", { title: book.title })}
        />
        <meta
          property="og:description"
          content={t("common:book-route-description", { title: book.title })}
        />
        <meta property="og:type" content="book" />
        <meta property="og:image" content={book.coverImg.url} />
      </Head>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>
          <Link href="/[lang]/[page]" as={`/${lang}/1`}>
            <a>{t("common:home")}</a>
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{`${book.title} — ${route.name}`}</Breadcrumb.Item>
      </Breadcrumb>
      <Layout
        className="site-layout-background"
        style={{ padding: "24px 0", height: "calc(100vh - 112px)" }}
      >
        <Sider
          className="site-layout-background"
          width={400}
          ref={siderRef}
          style={{
            backgroundColor: "#fff",
            overflowY: "scroll",
            height: "calc(100vh - 112px)"
          }}
        >
          <Divider>{t("common:routes-title")}</Divider>
          <Menu
            mode="inline"
            defaultSelectedKeys={[routeId]}
            selectedKeys={[routeId]}
          >
            {book.routes
              .sort((a, b) => (a.id > b.id ? 1 : -1))
              .map(route => (
                <Menu.Item key={route.id}>
                  <Link
                    href="/[lang]/books/[...slug]"
                    as={`/${lang}/books/${bookId}/${route.id}`}
                  >
                    <a>{route.name}</a>
                  </Link>
                </Menu.Item>
              ))}
          </Menu>
          <Divider>{t("common:points-title")}</Divider>
          <Collapse
            accordion
            activeKey={selectedPoint && selectedPoint.id}
            onChange={(item: any) =>
              setSelectedPoint(points.find(
                p => p.id.toString() === item
              ) as Point)
            }
          >
            {points.map(item => (
              <Panel
                header={item.name}
                key={item.id}
                ref={refs[item.id]}
                forceRender
              >
                <p>{item.description}</p>
              </Panel>
            ))}
          </Collapse>
        </Sider>

        <Content style={{ padding: "0 24px", minHeight: 280 }}>
          <RouteMap
            routeContent={points}
            selectShape={setSelectedPoint}
            selected={selectedPoint}
          />
        </Content>
      </Layout>
    </>
  );
};

// This also gets called at build time
export const getServerSideProps: GetServerSideProps = async ({
  params = { slug: [] },
  req
}) => {
  const slug = params.slug || [];
  const lang = req ? (req as any).language : i18n.language || "ru";
  // @ts-ignore
  const res = await fetch(
    `http://booksroutes.info:1400/api/book/${
      slug[0]
    }?join=routes&join=routes.points`
  );
  const book = await res.json();
  const pointsRes = await fetch(
    `/api/route/${slug[1]}?join=points`
  );
  const points = await pointsRes.json();
  // Pass post data to the page via props
  return {
    props: {
      book: book.result,
      bookId: slug[0],
      routeId: slug[1],
      shape: points.result,
      lang
    }
  };
};
export default withTranslation("common")(Book);
