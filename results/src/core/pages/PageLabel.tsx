import { getPageLabel } from 'core/helpers/pageHelpers'
import { useI18n } from 'core/i18n/i18nContext'
// import { useTools } from 'core/helpers/toolsContext'

const PageLabel = ({ page, includeWebsite }) => {
    const { getString } = useI18n()
    // const { getToolName } = useTools()

    return getPageLabel({ pageContext: page, getString, options: { includeWebsite } })
}

export default PageLabel