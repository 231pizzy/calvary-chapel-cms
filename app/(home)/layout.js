/* 'use client' */

import { metadataObject } from '@/utils/metadata'
import LandingLayout from './LandingLayout'

import '../globals.css'


export const metadata = {
    title: metadataObject?.home?.title,
    description: metadataObject?.home?.description,
}

export default function RootLayout({ children }) {
    return (
        <html  >
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700&display=swap"
                    rel="stylesheet" />
            </head>
            <body style={{ padding: 0, margin: 0 }}>
                <LandingLayout>{children}</LandingLayout>
            </body>
        </html>
    )
}
