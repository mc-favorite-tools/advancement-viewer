/*
 * The AGPL License (AGPL)
 * Copyright (c) 2023 hans000
 */
import { useContext, useEffect, useMemo, useState } from "react"
import { AppContext } from "../../store"

export default function Board() {
    const [state] = useContext(AppContext)
    const [config, setConfig] = useState({})

    const description = useMemo(() => {
        if (config) {
            const name = state.selected.name?.replace(/^minecraft:/, '')
            return config[name]
        }
        return '-'
    }, [config, state.selected])

    useEffect(() => {
        fetch('./config.json')
            .then(res => res.json())
            .then(res => setConfig(res))
    }, [])

    if (!state.selected.display) {
        return null
    }

    return (
        <div style={{
            width: '100%',
            maxWidth: 640,
            margin: '0 auto',
        }}>
            <div style={{
                fontSize: 20,
                border: '2px solid #212121',
                backgroundColor: '#b98f2c',
                padding: 4,
                color: '#fff',
            }} className="title">{state.lang[state.selected.display?.title?.translate] || state.selected.display?.title?.translate}</div>
            <div style={{
                fontSize: 18,
                border: '2px solid #555555',
                backgroundColor: '#212121',
                padding: 4,
                color: '#54fc54',
            }} className="description">{state.lang[state.selected.display?.description?.translate] || state.selected.display?.description?.translate}</div>
            <div style={{
                fontSize: 18,
                border: '2px solid #555555',
                backgroundColor: '#8e8e8e',
                padding: 4,
                color: '#fff',
            }} className="description">{description}</div>
            <div style={{ marginBottom: 24 }}>
                <details>
                    <summary style={{ cursor: 'pointer' }}>数据包（展开 / 折叠）</summary>
                    <textarea value={JSON.stringify(state.selected, null, 2)} readOnly rows={30} style={{ boxSizing: 'border-box', outline: 'none', border: 'none', backgroundColor: '#eee', width: '100%' }}></textarea>
                </details>
            </div>
        </div>
    )
}