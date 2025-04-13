import type { GatsbyConfig } from 'gatsby';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

const config: GatsbyConfig = {
  siteMetadata: {
    title: `sample-gatsby-site`,
    siteUrl: `https://www.yourdomain.tld`,
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
    {
      resolve: `gatsby-plugin-env-variables`,
      options: {
        allowList: ["GATSBY_RUDDERSTACK_WRITE_KEY", "GATSBY_RUDDERSTACK_DATAPLANE_URL"]
      },
    },
  ],
};

export default config;
