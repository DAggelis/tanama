'use client'

import { NextStudio } from 'next-sanity/studio'
import dynamic from 'next/dynamic'
import config from '../../../../sanity.config' 

// Χρησιμοποιούμε dynamic import για να αποφύγουμε το σφάλμα "window is not defined"
const StudioPage = dynamic(
  () => import('next-sanity/studio').then((mod) => mod.NextStudio),
  { ssr: false }
)

export default function Page() {
  return <NextStudio config={config} />
}