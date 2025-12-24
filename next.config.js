module.exports = {
  async headers() {
    return [
      {
        source: "/(.*)", // Match all files
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0", // Disable caching
          },
        ],
      },
    ];
  },
};