import React from 'react'
import { FeaturesOptions, SimplifiedSentimentOptions } from '@devographics/types'
import { ChartState, ColumnId, CombinedBucket, GroupingOptions, Totals } from './types'
import Tooltip from 'core/components/Tooltip'
import { useI18n } from '@devographics/react-i18n'
import T from 'core/i18n/T'
import { useTheme } from 'styled-components'
import { formatPercentage } from '../horizontalBar2/helpers/labels'
import { useIsWideEnough } from '../horizontalBar2/HorizontalBarCell'
import { CellLabel } from '../common2'

const getExperienceKey = (id: string) => `options.experience.${id}.label.short`
const getSentimentKey = (id: string) => `options.sentiment.${id}.label.short`

export const Cell = ({
    combinedBucket,
    chartState,
    width,
    offset,
    groupedTotals
}: {
    combinedBucket: CombinedBucket
    chartState: ChartState
    width: number
    offset: number
    groupedTotals: Totals
}) => {
    const { ref, isWideEnough: showLabel } = useIsWideEnough()

    const theme = useTheme()
    const { getString } = useI18n()
    const { variable } = chartState
    const { bucket, facetBucket } = combinedBucket

    const value = facetBucket[variable] || 0
    const experienceKey = getExperienceKey(bucket.id)
    const sentimentKey = getSentimentKey(facetBucket.id)

    const values = {
        value,
        experience: getString(experienceKey)?.t || '?',
        sentiment: getString(sentimentKey)?.t || '?'
    }

    const experienceColors = theme.colors.ranges.features
    const sentimentColors = theme.colors.ranges.sentiment

    const style = {
        '--percentageValue': value,
        '--experienceColor1': experienceColors[bucket.id as FeaturesOptions][0],
        '--experienceColor2': experienceColors[bucket.id as FeaturesOptions][0],
        '--sentimentColor1': sentimentColors[facetBucket.id as SimplifiedSentimentOptions][0],
        '--sentimentColor2': sentimentColors[facetBucket.id as SimplifiedSentimentOptions][0],
        '--width': width,
        '--offset': offset
    }

    const isNeutral = facetBucket.id === SimplifiedSentimentOptions.NEUTRAL_SENTIMENT

    return (
        <Tooltip
            trigger={
                <div className="multiexp-cell chart-cell" style={style} ref={ref}>
                    <div className="multiexp-cell-segment multiexp-cell-segment-experience">
                        {showLabel && <CellLabel label={formatPercentage(value)} />}
                    </div>

                    {!isNeutral && (
                        <div className="multiexp-cell-segment multiexp-cell-segment-sentiment"></div>
                    )}
                </div>
            }
            contents={
                <T
                    k={
                        isNeutral
                            ? `charts.multiexp.cell_tooltip_neutral`
                            : `charts.multiexp.cell_tooltip`
                    }
                    values={values}
                    html={true}
                    md={true}
                />
            }
        />
    )
}

export const ColumnTotal = ({
    columnId,
    groupedTotals,
    width,
    offset,
    chartState
}: {
    columnId: ColumnId
    groupedTotals: Totals
    width: number
    offset: number
    chartState: ChartState
}) => {
    const { getString } = useI18n()
    const { grouping } = chartState
    const style = {
        '--width': width,
        '--offset': offset
    }
    const columnTotal = groupedTotals[columnId]
    const answerKey =
        grouping === GroupingOptions.EXPERIENCE
            ? getExperienceKey(columnId)
            : getSentimentKey(columnId)
    const answer = getString(answerKey)?.t
    return (
        <Tooltip
            trigger={
                <div className="multiexp-column-total" style={style}>
                    <div className="multiexp-column-total-border" />
                    {columnTotal > 3 && (
                        <div className="multiexp-column-total-value">{columnTotal}%</div>
                    )}
                </div>
            }
            contents={
                <T
                    k={`charts.multiexp.cell_group_tooltip.${grouping}`}
                    values={{ value: columnTotal, answer }}
                    html={true}
                    md={true}
                />
            }
        />
    )
}
