// The GPL License, Copyright (c) 2023, hans0000
import clsx from 'clsx'
import { useContext, useEffect, useMemo, useState } from 'react'
import { AppContext } from '../../store'

export default function Panel(props: {
    className?: string
    style?: React.CSSProperties
    children: React.ReactNode
    onTabChange?: (index: number) => void
    tabs: any[]
    actIndex?: number
}) {
    const [state] = useContext(AppContext)
    const [actIndex, setActIndex] = useState(-1)
    const v = useMemo(() => state.version.split('.')[1], [state.version])

    useEffect(() => {
        setActIndex(props.actIndex)
    }, [props.actIndex])

    return (
        <div style={props.style} className={clsx('panel', props.className)}>
            <div className="tab-bar top">
                {
                    props.tabs.map((tab, index) => (
                        <span key={index} className={clsx('tab-item', {
                            'tl': index === 0,
                            'tc': index !== 0,
                            'active': actIndex === index,
                        })} onClick={() => {
                            props.onTabChange?.(index)
                        }}>
                            <div style={{
                                transform: 'scale(.5)',
                                marginLeft: -2,
                                marginTop: 2,
                            }} className={`icon-${v} ${tab.display.icon.item.slice(10)}-${v}`}></div>
                        </span>
                    ))
                }
            </div>
            <div className="tab-bar right">
                {/* <span className='tab-item rt'></span>
                <span className='tab-item rt'></span>
                <span className='tab-item rt'></span>
                <span className='tab-item rt'></span> */}
            </div>
            <div className="tab-bar bottom">
                {/* <span className='tab-item bl'></span>
                <span className='tab-item bc'></span>
                <span className='tab-item bc'></span>
                <span className='tab-item bc'></span>
                <span className='tab-item bc'></span>
                <span className='tab-item bc'></span>
                <span className='tab-item bc'></span> */}
            </div>
            <div className="tab-bar left">
                {/* <span className='tab-item lt'></span>
                <span className='tab-item lt'></span>
                <span className='tab-item lt'></span>
                <span className='tab-item lt'></span> */}
            </div>
            <div className='main'>
                <div className='inner' style={{
                    backgroundImage: `url(./backgrounds/${state.bg})`,
                }}>{props.children}</div>
            </div>
        </div>
    )
}