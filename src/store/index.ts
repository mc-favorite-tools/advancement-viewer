/*
 * The AGPL License (AGPL)
 * Copyright (c) 2023 hans000
 */

import { createContext, useReducer } from "react";

interface IStore {
    versionList: string[]
    bg: string
    version: string
    loading: boolean
    selected: any
    lang: Record<string, string>
}

type IAction =
| { type: 'UpdateVersion', payload: string }
| { type: 'UpdateBg', payload: string }
| { type: 'UpdateLoading', payload: boolean }
| { type: 'UpdateLang', payload: Record<string, string> }
| { type: 'UpdateSelected', payload: any }

const defaultStore: IStore = {
    versionList: ['1.13', '1.14', '1.15', '1.16', '1.17', '1.18', '1.19', '1.20'],
    version: '1.20',
    bg: '',
    lang: {},
    selected: {},
    loading: false,
}

export const AppContext = createContext<[IStore, React.Dispatch<IAction>]>([null, null])

function reducer(state: IStore, action: IAction) {
    switch (action.type) {
        case 'UpdateVersion':
            return {
                ...state,
                version: action.payload,
            }
        case 'UpdateLoading':
            return {
                ...state,
                loading: action.payload,
            }
        case 'UpdateLang':
            return {
                ...state,
                lang: action.payload,
            }
        case 'UpdateSelected':
            return {
                ...state,
                selected: action.payload,
            }
        case 'UpdateBg':
            return {
                ...state,
                bg: action.payload,
            }
        default:
            return state;
    }
}

export function useAppReducer() {
    return useReducer(reducer, defaultStore)
}