/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // trailingSlash: true

  // except for webpack, other parts are left as generated
  // webpack: (config, context) => {
  //   config.watchOptions = {
  //     poll: 1000,
  //     aggregateTimeout: 300,
  //   };
  //   return config;
  // },
};

module.exports = nextConfig;

// module.exports = {
//   reactStrictMode: true,
//   swcMinify: true,

//   webpackDevMiddleware: config => {
//     config.watchOptions = {
//       poll: 800,
//       aggregateTimeout: 300,
//     };
//     return config;
//   },
// };
