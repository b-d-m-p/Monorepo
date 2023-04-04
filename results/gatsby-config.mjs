import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)

dotenv.config()

export default {
    siteMetadata: {
        title: `Devographics Survey Results`
    },
    plugins: [
        'gatsby-plugin-pnpm',
        'gatsby-transformer-yaml',
        {
            resolve: 'gatsby-source-filesystem',
            options: {
                name: `data`,
                path: `${__dirname}/src/data/`
            }
        },
        {
            resolve: 'gatsby-source-graphql',
            options: {
                typeName: 'DataAPI',
                fieldName: 'dataAPI',
                url: process.env.DATA_API_URL
            }
        },
        {
            resolve: 'gatsby-source-graphql',
            options: {
                typeName: 'InternalAPI',
                fieldName: 'internalAPI',
                url: process.env.INTERNAL_API_URL
            }
        },
        'gatsby-plugin-react-helmet',
        'gatsby-plugin-sass',
        { resolve: 'gatsby-plugin-netlify', options: {} },
        'gatsby-plugin-styled-components',
        `gatsby-plugin-mdx`,
        'gatsby-plugin-bundle-stats'
        // `gatsby-plugin-perf-budgets`,
        // `gatsby-plugin-webpack-bundle-analyser-v2`
    ]
}