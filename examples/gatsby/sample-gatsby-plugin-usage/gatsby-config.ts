import type { GatsbyConfig } from 'gatsby';

const config: GatsbyConfig = {
  siteMetadata: {
    title: `sample-using-gatsby-plugin`,
    siteUrl: `https://www.yourdomain.tld`,
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
    {
      resolve: `gatsby-plugin-rudderstack`,
      options: {
        prodKey: '<writeKey>',
        devKey: '<writeKey>',
        dataPlaneUrl: '<dataplaneUrl>',
        trackPage: true,
        useLegacySDK: false,
        loadOptions: {},
      },
    },
  ],
};

export default config;
