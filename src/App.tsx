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
import { Spin, Upload } from "antd"
import Board from "./components/Board"

function getBg(str: string) {
    const arr = str.split('/')
    return arr[arr.length - 1]
}

const lineColorArray = ['#345', '#345', '#f6f6f6', '#f6f6f6', '#f6f6f6']

function formatFile(file: jszip.JSZipObject) {
    return file.async('string').then(res => {
        try {
            const isMatch = /^data\/(.+)\/advancements/.test(file.name)
            return {
                ...JSON.parse(res),
                name: isMatch ? file.name.replace(/^data\/(.+)\/advancements\//, '$1:').replace(/\.json$/, '') : 'minecraft:' + file.name.replace(/\.json$/, '')
            }
        } catch (error) {
            return {
                name: '$',
            }
        }
    })
}

function buildData(res: any[]) {
    const data = []
    data.push({ name: '$', })
    res.forEach(item => {
        if (item.display) {
            data.push(item)
        }
    })
    return d3.stratify()
        .id((d: any) => d.name)
        .parentId((d: any) => d.name !== '$' ? (d.parent || '$') : undefined)
        (data)
}

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
        dispatch({ type: 'UpdateLoading', payload: true })
        fetch(`https://unpkg.com/@wikijs/mc-advancements/dist/${state.version}.zip`)
            .then(res => res.blob())
            .then(res => jszip.loadAsync(res))
            .then(res => Promise.all(res.filter((_, file) => !file.dir).map(formatFile)))
            .then(update)
            .catch(() => {
                alert('资源加载失败')
            }).finally(() => {
                dispatch({ type: 'UpdateLoading', payload: false })
            })
    }, [state.version])

    function update(res) {
        rootRef.current = buildData(res)
        const children = rootRef.current.children
        setActive(0)
        const actNode = children[0].copy()
        setActiveNode(actNode)
        dispatch({ type: 'UpdateBg', payload: getBg(actNode.data.display.background) })
        setTabs(children.map(node => node.data))
    }

    return (
        <AppContext.Provider value={[state, dispatch]}>
            <Spin spinning={state.loading}>
                <div style={{ height: '100vh' }}>
                    <Header />
                    <div style={{ margin: `32px auto ${tabs.length > 8 ? '48px' : 0}`, display: 'flex', justifyContent: 'center' }}>
                        <Panel style={{ marginBottom: 32 }} tabs={tabs} actIndex={active} onTabChange={(index) => {
                            setActive(index)
                            const actNode = rootRef.current.children[index].copy()
                            setActiveNode(actNode)
                            dispatch({
                                type: 'UpdateBg',
                                payload: getBg(actNode.data.display.background),
                            })
                        }}>
                            <Preview lineColor={lineColorArray[active]} width={570} height={318} root={activeNode}/>
                        </Panel>
                    </div>
                    <Board />
                    <div style={{ maxWidth: 640, margin: '32px auto' }}>
                        <Upload.Dragger fileList={[]} style={{ marginBottom: 32 }}
                            beforeUpload={(rcfile) => {
                                dispatch({ type: 'UpdateLoading', payload: true })
                                const handleFilter = (file: jszip.JSZipObject) => !file.dir && /^data\/.+\/advancements/.test(file.name)
                                jszip.loadAsync(rcfile.arrayBuffer())
                                    .then(res => Promise.all(res.filter((_, file) => handleFilter(file)).map(formatFile)))
                                    .then(update)
                                    .catch((err) => {
                                        console.log(err)
                                        alert('资源加载失败')
                                    }).finally(() => {
                                        dispatch({ type: 'UpdateLoading', payload: false })
                                    })
                                return false
                            }}>
                            <span>使用离线数据（上传versions目录的jar包或者数据包）</span>
                        </Upload.Dragger>
                    </div>
                    <Footer />
                </div>
            </Spin>
        </AppContext.Provider>
    )
}