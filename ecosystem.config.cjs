module.exports = {
  apps: [
    {
      name: "nihongo-loop",
      script: "server.js",
      env: {
        HOST: "0.0.0.0",
        PORT: "8787",
        NODE_ENV: "production",
      },
      max_memory_restart: "300M",
      watch: false,
    },
  ],
};
