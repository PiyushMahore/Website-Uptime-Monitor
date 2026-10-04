import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import PropTypes from 'prop-types'

const METRICS = [
    { key: 'totalTime', label: 'Total response', color: '#5d72e8' },
    { key: 'nameLookupTime', label: 'Name lookup', color: '#19a77a' },
    { key: 'connectionTime', label: 'Connection', color: '#e39a3b' },
    { key: 'tlsHandshakeTime', label: 'TLS handshake', color: '#9b67cf' },
    { key: 'dataTransferTime', label: 'Data transfer', color: '#e16a76' },
]

const TimingChart = ({ data }) => {
    const svgRef = useRef(null)
    const frameRef = useRef(null)
    const [viewType, setViewType] = useState('line')
    const [metricKey, setMetricKey] = useState('totalTime')
    const [tooltip, setTooltip] = useState(null)
    const metric = METRICS.find((item) => item.key === metricKey) || METRICS[0]

    useEffect(() => {
        const svgNode = svgRef.current
        const frameNode = frameRef.current
        if (!svgNode || !frameNode || !data.length) return undefined

        const draw = () => {
            const width = Math.max(frameNode.clientWidth, 320)
            const height = width < 520 ? 270 : 330
            const margin = { top: 18, right: 18, bottom: 45, left: 54 }
            const plotWidth = width - margin.left - margin.right
            const plotHeight = height - margin.top - margin.bottom
            const parsed = data.map((item, index) => ({
                ...item,
                _index: index,
                _date: item.date ? new Date(item.date) : null,
                _value: Number(item[metricKey]) || 0,
            }))
            const maxValue = d3.max(parsed, (item) => viewType === 'multi' ? d3.max(METRICS, (series) => Number(item[series.key]) || 0) : item._value) || 1
            const x = d3.scalePoint().domain(parsed.map((item) => item._index)).range([0, plotWidth]).padding(0.35)
            const y = d3.scaleLinear().domain([0, maxValue * 1.15]).nice().range([plotHeight, 0])
            const svg = d3.select(svgNode)
            svg.selectAll('*').remove()
            svg.attr('viewBox', `0 0 ${width} ${height}`).attr('preserveAspectRatio', 'none')
            const plot = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

            plot.append('g').call(d3.axisLeft(y).ticks(5).tickFormat((value) => `${value} ms`))
                .call((axis) => axis.select('.domain').remove())
                .call((axis) => axis.selectAll('.tick line').attr('x2', plotWidth).attr('stroke', 'var(--line)'))
                .call((axis) => axis.selectAll('text').attr('fill', 'var(--muted)').attr('font-size', 10))

            const xAxis = d3.axisBottom(x).tickValues(parsed.filter((_, index) => index % Math.max(1, Math.ceil(parsed.length / 5)) === 0).map((item) => item._index))
                .tickFormat((index) => {
                    const point = parsed[index]
                    return point?._date && !Number.isNaN(point._date.valueOf()) ? d3.timeFormat('%b %d · %H:%M')(point._date) : `Check ${Number(index) + 1}`
                })
            plot.append('g').attr('transform', `translate(0,${plotHeight})`).call(xAxis)
                .call((axis) => axis.select('.domain').attr('stroke', 'var(--line)'))
                .call((axis) => axis.selectAll('text').attr('fill', 'var(--muted)').attr('font-size', 9).attr('transform', 'rotate(-20)').attr('text-anchor', 'end'))

            const color = metric.color
            if (viewType === 'multi') {
                METRICS.forEach((series) => {
                    const seriesLine = d3.line().x((item) => x(item._index) || 0).y((item) => y(Number(item[series.key]) || 0)).curve(d3.curveMonotoneX)
                    plot.append('path').datum(parsed).attr('fill', series.color).attr('opacity', 0.08)
                        .attr('d', d3.area().x((item) => x(item._index) || 0).y0(plotHeight).y1((item) => y(Number(item[series.key]) || 0)).curve(d3.curveMonotoneX))
                    plot.append('path').datum(parsed).attr('fill', 'none').attr('stroke', series.color).attr('stroke-width', 2).attr('d', seriesLine)
                    plot.selectAll(`.point-${series.key}`).data(parsed).join('circle').attr('class', `point-${series.key}`)
                        .attr('cx', (item) => x(item._index) || 0).attr('cy', (item) => y(Number(item[series.key]) || 0))
                        .attr('r', parsed.length > 45 ? 1.8 : 2.7).attr('fill', series.color)
                })
            } else if (viewType === 'bar') {
                const band = Math.min(26, plotWidth / Math.max(parsed.length, 1) * 0.65)
                plot.selectAll('.timing-bar').data(parsed).join('rect').attr('class', 'timing-bar')
                    .attr('x', (item) => (x(item._index) || 0) - band / 2).attr('width', band)
                    .attr('y', (item) => y(item._value)).attr('height', (item) => Math.max(0, plotHeight - y(item._value)))
                    .attr('rx', 3).attr('fill', color).attr('opacity', 0.82)
            } else {
                const line = d3.line().x((item) => x(item._index) || 0).y((item) => y(item._value)).curve(d3.curveMonotoneX)
                if (viewType === 'area') {
                    plot.append('path').datum(parsed).attr('fill', color).attr('opacity', 0.14)
                        .attr('d', d3.area().x((item) => x(item._index) || 0).y0(plotHeight).y1((item) => y(item._value)).curve(d3.curveMonotoneX))
                }
                plot.append('path').datum(parsed).attr('fill', 'none').attr('stroke', color).attr('stroke-width', 2.5).attr('d', line)
                plot.selectAll('.timing-point').data(parsed).join('circle').attr('class', 'timing-point')
                    .attr('cx', (item) => x(item._index) || 0).attr('cy', (item) => y(item._value)).attr('r', parsed.length > 45 ? 2.2 : 3.5)
                    .attr('fill', 'var(--surface)').attr('stroke', color).attr('stroke-width', 2)
            }

            const focus = plot.append('g').style('display', 'none').attr('pointer-events', 'none')
            focus.append('line').attr('y1', 0).attr('y2', plotHeight).attr('stroke', color).attr('stroke-dasharray', '4 4').attr('opacity', 0.55)
            const overlay = plot.append('rect').attr('width', plotWidth).attr('height', plotHeight).attr('fill', 'transparent').style('cursor', 'default')
            overlay.on('pointermove', (event) => {
                const [pointerX] = d3.pointer(event, plot.node())
                const selected = d3.least(parsed, (item) => Math.abs((x(item._index) || 0) - pointerX))
                if (!selected) return
                const pointX = x(selected._index) || 0
                focus.style('display', null).attr('transform', `translate(${pointX},0)`)
                const rect = frameNode.getBoundingClientRect()
                const clientX = event.clientX - rect.left
                const clientY = event.clientY - rect.top
                setTooltip({ item: selected, left: Math.max(8, Math.min(clientX + 14, rect.width - 212)), top: Math.max(8, Math.min(clientY + 14, rect.height - 150)) })
            }).on('pointerleave', () => { focus.style('display', 'none'); setTooltip(null) })
        }

        draw()
        const observer = new ResizeObserver(draw)
        observer.observe(frameNode)
        return () => observer.disconnect()
    }, [data, metric.color, metricKey, viewType])

    return (
        <div className="timing-chart-shell">
            <div className="timing-chart-controls">
                <label>Metric<select value={metricKey} onChange={(event) => setMetricKey(event.target.value)}>{METRICS.map((item) => <option value={item.key} key={item.key}>{item.label}</option>)}</select></label>
                <div className="timing-view-switch" role="group" aria-label="Chart view type">{[['multi', 'All lines'], ['line', 'Line'], ['area', 'Area'], ['bar', 'Bars']].map(([key, label]) => <button type="button" key={key} className={viewType === key ? 'selected' : ''} aria-pressed={viewType === key} onClick={() => setViewType(key)}>{label}</button>)}</div>
            </div>
            <div className="timing-chart-frame" ref={frameRef} onPointerLeave={() => setTooltip(null)}>
                <svg ref={svgRef} role="img" aria-label={`${metric.label} ${viewType} chart`} />
                {tooltip && <div className="timing-chart-tooltip" style={{ left: tooltip.left, top: tooltip.top }}><strong>{viewType === 'multi' ? 'Timing breakdown' : `${metric.label}: ${tooltip.item._value.toFixed(2)} ms`}</strong><span>{tooltip.item._date && !Number.isNaN(tooltip.item._date.valueOf()) ? tooltip.item._date.toLocaleString() : `Check ${tooltip.item._index + 1}`}</span><hr />{METRICS.map((item) => <span key={item.key}>{item.label}: {Number(tooltip.item[item.key] || 0).toFixed(2)} ms</span>)}</div>}
            </div>
            <div className="timing-chart-legend">{(viewType === 'multi' ? METRICS : [metric]).map((item) => <span className="timing-legend-item" key={item.key}><i style={{ background: item.color }} />{item.label}</span>)}<span>·</span>{data.length} checks</div>
        </div>
    )
}

TimingChart.propTypes = { data: PropTypes.arrayOf(PropTypes.shape({
    nameLookupTime: PropTypes.number, connectionTime: PropTypes.number,
    tlsHandshakeTime: PropTypes.number, dataTransferTime: PropTypes.number,
    totalTime: PropTypes.number,
    date: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
})).isRequired }

export default TimingChart
