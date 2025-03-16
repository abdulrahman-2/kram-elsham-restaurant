const route = (e) => {
  e = e || window.event;
  e.preventDefault();
  const target = e.currentTarget;
  window.history.pushState({}, "", target.href);
  handleLocation();
};

const routes = {
  404: "/pages/404.html",
  "/": "/pages/index.html",
  "/about": "/pages/about.html",
  "/contact": "/pages/contact.html",
  "/menu": "/pages/menu.html",
};

const handleLocation = async () => {
  const path = window.location.pathname;
  const route = routes[path] || routes[404];
  const html = await fetch(route).then((data) => data.text());
  document.getElementById("main").innerHTML = html;
};

// Expose route function globally
window.onpopstate = handleLocation;
window.route = route;

handleLocation();
