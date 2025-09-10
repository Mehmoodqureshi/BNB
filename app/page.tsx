import { Suspense } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HomePage from '@/components/HomePage'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<div className="h-16 bg-white dark:bg-airbnb-dark-bg" />}>
        <Header />
      </Suspense>
      <Suspense fallback={<div className="h-screen bg-white dark:bg-airbnb-dark-bg" />}>
        <HomePage />
      </Suspense>
      <Suspense fallback={<div className="h-32 bg-white dark:bg-airbnb-dark-bg" />}>
        <Footer />
      </Suspense>
    </div>
  )
}
