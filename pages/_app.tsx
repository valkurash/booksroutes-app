import App from 'next/app';
import React from "react";
import { Router } from 'next/router';
import { initGA, logPageView } from '../utils/analytics';
import MainLayout from '../components/layouts/main';
import { appWithTranslation } from '../i18n';
import "leaflet/dist/leaflet.css";
import "../css/styles.scss";
import '../css/antd.less';

class MyApp extends App<any> {
  componentDidMount() {
    initGA();
    logPageView();
    Router.events.on('routeChangeComplete', logPageView)
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <MainLayout>
          <Component {...pageProps} />
      </MainLayout>
    )
  }
  }
export default appWithTranslation(MyApp)
