import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-airbnb-dark-bg">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-airbnb-red mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-airbnb-text dark:text-white mb-2">
            Page not found
          </h2>
          <p className="text-airbnb-text-light dark:text-gray-400">
            Sorry, we couldn't find the page you're looking for.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link href="/">
            <Button variant="primary" size="lg" className="w-full">
              <Home className="h-4 w-4 mr-2" />
              Go back home
            </Button>
          </Link>
          
          <Link href="/">
            <Button variant="outline" size="lg" className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to previous page
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

