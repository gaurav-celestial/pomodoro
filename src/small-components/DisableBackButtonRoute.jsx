const DisableBackButtonRoute = ({ children }) => {
  history.pushState(null, null, location.href);
  window.onpopstate = function () {
    history.go(1);
  };

  return children;
};

export default DisableBackButtonRoute;
