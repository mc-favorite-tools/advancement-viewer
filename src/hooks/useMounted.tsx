// The GPL License, Copyright (c) 2023, hans0000
import { useEffect, useRef } from "react";

export default function useMounted(fn: Function) {
    const first = useRef(true)

    useEffect(() => {
        if (first) {
            fn()
        }
    }, [])
}