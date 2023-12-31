/*
 * The AGPL License (AGPL)
 * Copyright (c) 2023 hans000
 */

export default function Footer() {
    return (
        <footer>
            <span>Copyright © {new Date().getFullYear()} by </span>
            <a style={{ textDecoration: 'none' }} href="https://github.com/mc-favorite-tools/advancement-viewer" target="_blank">hans000</a>
            <span style={{ marginLeft: 12 }}>QQ: 2112717288</span>
            <img style={{ transform: 'scale(.8)', transformOrigin: 'bottom' }} src="https://badges.toozhao.com/badges/01H6FNF5Z802Z9SC7YVXQPP69S/green.svg" />
        </footer>
    )
}