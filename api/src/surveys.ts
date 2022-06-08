import jsConfig from '../surveys/stateofjs/config.yml'
import js2019Config from '../surveys/stateofjs/2019/config.yml'
import js2020Config from '../surveys/stateofjs/2020/config.yml'
import js2021Config from '../surveys/stateofjs/2021/config.yml'

import cssConfig from '../surveys/stateofcss/config.yml'
import css2020Config from '../surveys/stateofcss/2020/config.yml'
import css2021Config from '../surveys/stateofcss/2021/config.yml'

import graphqlConfig from '../surveys/stateofgraphql/config.yml'
import graphql2022Config from '../surveys/stateofgraphql/2022/config.yml'

const surveys = [
    {
        ...jsConfig,
        editions: [js2019Config, js2020Config, js2021Config]
    },
    {
        ...cssConfig,
        editions: [css2020Config, css2021Config]
    },
    {
        ...graphqlConfig,
        editions: [graphql2022Config]
    }
]

export default surveys
