/* eslint-disable @typescript-eslint/no-var-requires */

const withLess = require("next-with-less");

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = withLess(config);
