/*
 * The AGPL License (AGPL)
 * Copyright (c) 2023 hans000
 */

import { useContext } from "react"
import { AppContext } from "../../store"


export default function Header() {
    const [state, dispatch] = useContext(AppContext)
    return (
        <header>
            <h1 className="logo">
                <span className="mobile">MAV</span>
                <span className="pc">MC Advancement Viewer</span>
            </h1>
            <div className='right'>
                <select style={{ border: 'none', backgroundColor: '#000', color: '#fff' }} value={state.version} onChange={(v) => {
                    dispatch({
                        type: 'UpdateVersion',
                        payload: v.target.value,
                    })
                }}>
                    {
                         state.versionList.map(v => {
                            return (
                                <option key={v} value={v}>v{v}</option>
                            )
                        })
                    }
                </select>
                <a style={{ marginLeft: 24, textDecoration: 'none' }} href="https://github.com/hans000/mc-advancement-viewer/issues" target='_blank'>问题反馈</a>
            </div>
        </header>
    )
}