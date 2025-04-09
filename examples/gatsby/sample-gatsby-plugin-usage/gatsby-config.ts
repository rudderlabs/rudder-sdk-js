import type { GatsbyConfig } from 'gatsby';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

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
        prodKey: process.env.GATSBY_RUDDERSTACK_WRITE_KEY,
        devKey: process.env.GATSBY_RUDDERSTACK_WRITE_KEY,
        dataPlaneUrl: process.env.GATSBY_RUDDERSTACK_DATAPLANE_URL,
        trackPage: true,
        loadOptions: {},
      },
    },
  ],
};

export default config;
