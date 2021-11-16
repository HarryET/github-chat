import withLess from "next-with-less";

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = withLess(config);
