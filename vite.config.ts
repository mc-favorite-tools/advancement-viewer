import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cdnImport from 'vite-plugin-cdn-import'

// https://vitejs.dev/config/
export default defineConfig({
    base: './',
    css: {
        preprocessorOptions: {
            less: { javascriptEnabled: true }
        }
    },
    build: {
        assetsDir: './',
    },
    plugins: [
        react(),
        // cdnImport({
        //     modules: [
        //         {
        //             name: 'react',
        //             var: 'React',
        //             path: 'https://unpkg.com/react@18.2.0/umd/react.production.min.js',
        //         },
        //         {
        //             name: 'react-dom',
        //             var: 'ReactDOM',
        //             path: 'https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js',
        //         },
        //         {
        //             name: 'jszip',
        //             var: 'JSZip',
        //             path: 'https://unpkg.com/jszip@3.10.1/dist/jszip.min.js',
        //         },
        //         {
        //             name: 'd3',
        //             var: 'd3',
        //             path: 'https://unpkg.com/d3@7.8.5/dist/d3.min.js',
        //         },
        //         {
        //             name: 'clsx',
        //             var: 'clsx',
        //             path: 'https://unpkg.com/clsx@1.2.1/dist/clsx.min.js',
        //         },
        //     ]
        // }),
    ],
})
