import ReactGA from 'react-ga';

export const initGA = () => {
  ReactGA.initialize('UA-116041442-1');
  ReactGA.ga((tracker:any) => {
    ReactGA.set({ dimension1: tracker.get('clientId') });
  });
};

export const logPageView = () => {
  console.log(`Logging pageview for ${window.location.pathname}`)
  ReactGA.set({ page: window.location.pathname })
  ReactGA.pageview(window.location.pathname)
};
