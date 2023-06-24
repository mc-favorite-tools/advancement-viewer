// The GPL License, Copyright (c) 2023, hans0000
import { useEffect, useRef, useState } from "react"
import * as d3 from 'd3'
import Preview from "./components/Preview"
import jszip from 'jszip'
import Panel from "./components/Panel"
import { AppContext, useAppReducer } from "./store"
import Header from "./components/Header"
import Footer from "./components/Footer"
import './index.less'
import { Spin } from "antd"
import Board from "./components/Board"

function getBg(str: string) {
    const arr = str.split('/')
    return arr[arr.length - 1]
}

const lineColorArray = ['#345', '#345', '#f6f6f6', '#f6f6f6', '#f6f6f6']

export default function App() {
    const [state, dispatch] = useAppReducer()

    const [active, setActive] = useState(-1)
    const [activeNode, setActiveNode] = useState(null)
    const [tabs, setTabs] = useState([])
    const rootRef = useRef(null)

    useEffect(() => {
        fetch(`https://unpkg.com/@wikijs/mc-langs/dist/${state.version}.json`)
            .then(res => res.json())
            .then(res => {
                dispatch({
                    type: 'UpdateLang',
                    payload: res
                })
            })
    }, [state.version])

    useEffect(() => {
        dispatch({
            type: 'UpdateLoading',
            payload: true,
        })
        fetch(`https://unpkg.com/@wikijs/mc-advancements/dist/${state.version}.zip`)
            .then(res => res.blob())
            .then(res => jszip.loadAsync(res))
            .then(res => {
                return Promise.all(
                    res.filter((_, file) => !file.dir)
                        .map(
                            (file) => file.async('string').then(res => {
                                try {
                                    return {
                                        ...JSON.parse(res),
                                        name: 'minecraft:' + file.name.slice(0, -5),
                                    }
                                } catch (error) {
                                    return {
                                        name: '$',
                                    }
                                }
                            })
                        )
                )
            })
            .then(res => {
                const data = []
                data.push({ name: '$', })
                res.forEach(item => {
                    if (item.display) {
                        data.push(item)
                    }
                })
                rootRef.current = d3.stratify()
                    .id((d: any) => d.name)
                    .parentId((d: any) => d.name !== '$' ? (d.parent || '$') : undefined)
                    (data)
                const children = rootRef.current.children
                setActive(0)
                const actNode = children[0].copy()
                setActiveNode(actNode)
                dispatch({
                    type: 'UpdateBg',
                    payload: getBg(actNode.data.display.background),
                })
                setTabs(children.map(node => node.data))
            }).catch(() => {
                alert('资源加载失败')
            }).finally(() => {
                dispatch({
                    type: 'UpdateLoading',
                    payload: false,
                })
            })
    }, [state.version])

    return (
        <AppContext.Provider value={[state, dispatch]}>
            <Spin spinning={state.loading}>
                <div style={{ height: '100vh' }}>
                    <Header />
                    <div style={{ margin: '50px auto 240px', display: 'flex', justifyContent: 'center' }} className="div">
                        <Panel tabs={tabs} actIndex={active} onTabChange={(index) => {
                            setActive(index)
                            const actNode = rootRef.current.children[index].copy()
                            setActiveNode(actNode)
                            dispatch({
                                type: 'UpdateBg',
                                payload: getBg(actNode.data.display.background),
                            })
                        }}>
                            <Preview lineColor={lineColorArray[active]} width={240} height={116} root={activeNode}/>
                        </Panel>
                    </div>
                    <Board />
                    <Footer />
                </div>
            </Spin>
        </AppContext.Provider>
    )
}