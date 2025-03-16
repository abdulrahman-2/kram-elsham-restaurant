const liveServer = require("live-server");

const params = {
  port: 5500, // Set the port you're using
  root: ".", // Root directory of your project
  open: false, // Don't open the browser automatically
  file: "index.html", // Always serve index.html for any route
  wait: 1000, // Wait time for the server to start
};

liveServer.start(params);
