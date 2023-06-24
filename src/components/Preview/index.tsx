// The GPL License, Copyright (c) 2023, hans0000
import * as d3 from "d3"
import { useContext, useEffect, useMemo, useRef } from "react"
import useMounted from "../../hooks/useMounted"
import { AppContext } from "../../store"

const nodeSize = 60

function diagonal(o) {
    return `
        M${o.source.y}, ${o.source.x}
        h${nodeSize / 2}
        v${o.target.x - o.source.x}
        h${nodeSize / 2}
    `.trim()
}

function getRoot(source) {
    let tmp = source
    while (tmp.parent) {
        tmp = tmp.parent
    }
    return tmp
}


const tree = d3.tree().nodeSize([nodeSize, nodeSize])
const margin = { top: 40, right: 120, bottom: 40, left: 40 }
const width = 500
const dx = 10
const dy = width / 2


export default function Preview(props: {
    width: number
    height: number
    root: any
    lineColor: string
}) {
    const [state, dispatch] = useContext(AppContext)

    const svgRef = useRef(null)
    const gG = useRef(null)
    const gLinkRef = useRef(null)
    const gNodeRef = useRef(null)

    const v = useMemo(() => state.version.split('.')[1], [state.version])

    function update(event, source) {
        const root = getRoot(source)
        const duration = event?.altKey ? 2500 : 250;
        const nodes = root.descendants().reverse();
        const links = root.links();
    
        tree(root);
    
        let left = root;
        let right = root;
        root.eachBefore(node => {
            if (node.x < left.x) left = node;
            if (node.x > right.x) right = node;
        });
    
        const transition = svgRef.current.transition()
            .duration(duration)
            .attr("viewBox", [-100, -props.height / 2, props.width, props.height])
            // .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"));
    
        const node = gNodeRef.current.selectAll("g")
            .data(nodes, d => d.id);
    
        const nodeEnter = node.enter().append("g")
            // .attr("transform", d => `translate(${source.y0},${source.x0})`)
            .attr("fill-opacity", 0)
            .attr("stroke-opacity", 0)
            .on("dblclick", (event, d) => {
                d.children = d.children ? null : d._children;
                update(event, d);
            })
            .on('mouseenter', (event, d) => {
                dispatch({
                    type: 'UpdateSelected',
                    payload: d.data,
                })
            })
    
        nodeEnter.append("image")
            .attr("width", 40)
            .attr("height", 40)
            .attr("y", -nodeSize / 3)
            .attr("x", -nodeSize / 3)      
            .attr("href", d => {
                return `./${d.data?.display?.frame || 'goal'}.png`
            })

        nodeEnter
            .append('foreignObject')
            .attr('width', 32)
            .attr('height', 32)
            .attr("y", -16)
            .attr("x", -16)  
            .append('xhtml:div')
            .attr('class', d => {
                return `icon-${v} ${d.data.display?.icon?.item?.slice(10)}-${v}`
            })
    
        // nodeEnter.append("text")
        //     .attr("dy", "0.31em")
        //     .attr("x", d => d._children ? -6 : 6)
        //     .attr("text-anchor", d => d._children ? "end" : "start")
        //     .text(d => d.data.name)
        //     .clone(true).lower()
        //     .attr("stroke-linejoin", "round")
        //     .attr("stroke-width", 3)
        //     .attr("stroke", "white");
    
        const nodeUpdate = node.merge(nodeEnter).transition(transition)
            .attr("transform", d => `translate(${d.y},${d.x})`)
            .attr("fill-opacity", 1)
            .attr("stroke-opacity", 1);
    
        const nodeExit = node.exit().transition(transition).remove()
            .attr("transform", d => {
                return `translate(${source.y},${source.x})`
            })
            .attr("fill-opacity", 0)
            .attr("stroke-opacity", 0);
    
        // Update the links…
        const link = gLinkRef.current.selectAll("path")
            .data(links, d => d.target.id);
    
        const linkEnter = link.enter().append("path")
            .attr("stroke", props.lineColor)
            .attr("d", d => {
                const o = { x: source.x0, y: source.y0 };
                return diagonal({ source: o, target: o });
            });
    
        link.merge(linkEnter).transition(transition)
            .attr("d", diagonal);
    
        link.exit().transition(transition).remove()
            .attr("d", d => {
                const o = { x: source.x, y: source.y };
                return diagonal({ source: o, target: o });
            });
    
        root.eachBefore(d => {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    
    }
    
    useMounted(() => {
        svgRef.current = d3.select("#view")
            .append('svg')
            .style("font", "10px sans-serif")
            .style("user-select", "none");

        const zoom = d3.zoom()
            .on('zoom', (e) => gG.current.attr('transform', e.transform))
            
        gG.current = svgRef.current.append('g')
        svgRef.current.call(zoom).on("dblclick.zoom", null)

        gLinkRef.current = gG.current.append("g")
            .attr("fill", "none")
            .attr("stroke", "#345")
            .attr("stroke-opacity", 1)
            .attr("stroke-width", 1.5);

        gNodeRef.current = gG.current.append("g")
            .attr("cursor", "pointer")
            .attr("pointer-events", "all");
    })

    useEffect(() => {
        if (!props.root) {
            return
        }
        const root = props.root
        root.x0 = dy / 2;
        root.y0 = 0;
        root.descendants().forEach((d, i) => {
            d.id = d.data.name;
            d._children = d.children;
            // if (d.depth && d.data.name.length !== 7) d.children = null;
        });
        update(null, root)
    }, [props.root, props.lineColor])

    return (
        <div style={{ position: 'relative' }}>
            <div style={{
                position: 'absolute',
                backgroundColor: '#eee',
                width: 3,
                height: 3,
                right: 0,
                borderRadius: '50%',
                cursor: 'pointer',
                border: '3px solid #007acc',
                margin: 2,
            }} onClick={() => {
                gG.current.attr('transform', '')
            }}>111</div>
            <div id="view"></div>
        </div>
    )
}