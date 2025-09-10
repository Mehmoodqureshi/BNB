import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import PropertyDetails from '@/components/property/PropertyDetails'
import Header from '@/components/layout/Header'
import Footer from '../../../components/layout/Footer'

// Mock data - in a real app, this would come from a database or API
const properties = [
  {
    id: '1',
    title: 'Luxury Apartment in Downtown Dubai',
    location: 'Downtown Dubai, Dubai',
    price: 450,
    rating: 4.8,
    reviewCount: 124,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop'
    ],
    isSuperhost: true,
    type: 'Apartment',
    beds: 2,
    baths: 2,
    guests: 4,
    slug: 'luxury-apartment-downtown-dubai',
    description: 'Experience the vibrant energy of downtown Dubai in this beautifully designed modern apartment. Located in the heart of Dubai, this space offers stunning city views and easy access to all major attractions including the Burj Khalifa and Dubai Mall.',
    amenities: ['WiFi', 'Kitchen', 'Washer', 'Dryer', 'Air conditioning', 'Heating', 'TV', 'Hair dryer', 'Iron', 'Laptop friendly workspace', 'Pool', 'Gym'],
    host: {
      name: 'Ahmed Al-Rashid',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      joinedDate: 'March 2018',
      responseRate: '100%',
      responseTime: 'within an hour'
    },
    houseRules: [
      'No smoking',
      'No pets',
      'No parties or events',
      'Check-in: 3:00 PM - 11:00 PM',
      'Check-out: 11:00 AM'
    ],
    cancellationPolicy: 'Free cancellation for 48 hours. After that, cancel before 3:00 PM on Nov 27 for a partial refund.'
  },
  {
    id: '2',
    title: 'Beachfront Villa on Palm Jumeirah',
    location: 'Palm Jumeirah, Dubai',
    price: 1200,
    rating: 4.9,
    reviewCount: 89,
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-14b1e0d0f905?w=1200&h=800&fit=crop'
    ],
    isSuperhost: false,
    type: 'Villa',
    beds: 4,
    baths: 3,
    guests: 8,
    slug: 'beachfront-villa-palm-jumeirah',
    description: 'Wake up to the sound of waves at this stunning beachfront villa on Palm Jumeirah. This luxurious property offers direct beach access and breathtaking ocean views from every room.',
    amenities: ['WiFi', 'Kitchen', 'Washer', 'Dryer', 'Air conditioning', 'Heating', 'TV', 'Hair dryer', 'Iron', 'Beach access', 'Pool', 'Hot tub', 'Private beach'],
    host: {
      name: 'Fatima Al-Zahra',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      joinedDate: 'January 2019',
      responseRate: '95%',
      responseTime: 'within 2 hours'
    },
    houseRules: [
      'No smoking',
      'Pets allowed',
      'No parties or events',
      'Check-in: 4:00 PM - 10:00 PM',
      'Check-out: 11:00 AM'
    ],
    cancellationPolicy: 'Free cancellation for 48 hours. After that, cancel before 4:00 PM on Nov 28 for a partial refund.'
  },
  {
    id: '3',
    title: 'Modern Penthouse in Dubai Marina',
    location: 'Dubai Marina, Dubai',
    price: 800,
    rating: 4.7,
    reviewCount: 156,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop'
    ],
    isSuperhost: true,
    type: 'Penthouse',
    beds: 3,
    baths: 2,
    guests: 6,
    slug: 'modern-penthouse-dubai-marina',
    description: 'Luxurious penthouse with panoramic views of Dubai Marina and the Arabian Gulf. This modern space features floor-to-ceiling windows and premium finishes throughout.',
    amenities: ['WiFi', 'Kitchen', 'Washer', 'Dryer', 'Air conditioning', 'Heating', 'TV', 'Hair dryer', 'Iron', 'Laptop friendly workspace', 'Pool', 'Gym', 'Concierge'],
    host: {
      name: 'Omar Hassan',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      joinedDate: 'June 2020',
      responseRate: '98%',
      responseTime: 'within 30 minutes'
    },
    houseRules: [
      'No smoking',
      'No pets',
      'No parties or events',
      'Check-in: 2:00 PM - 10:00 PM',
      'Check-out: 11:00 AM'
    ],
    cancellationPolicy: 'Free cancellation for 48 hours. After that, cancel before 2:00 PM on Nov 29 for a partial refund.'
  },
  {
    id: '4',
    title: 'Cozy Apartment in JBR',
    location: 'Jumeirah Beach Residence, Dubai',
    price: 350,
    rating: 4.6,
    reviewCount: 78,
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-14b1e0d0f905?w=1200&h=800&fit=crop'
    ],
    isSuperhost: false,
    type: 'Apartment',
    beds: 1,
    baths: 1,
    guests: 2,
    slug: 'cozy-apartment-jbr-dubai',
    description: 'Perfect for couples, this cozy apartment in JBR offers easy access to the beach and The Walk. Modern amenities and comfortable living space.',
    amenities: ['WiFi', 'Kitchen', 'Washer', 'Dryer', 'Air conditioning', 'Heating', 'TV', 'Hair dryer', 'Iron', 'Beach access'],
    host: {
      name: 'Layla Mohammed',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      joinedDate: 'September 2019',
      responseRate: '92%',
      responseTime: 'within 2 hours'
    },
    houseRules: [
      'No smoking',
      'No pets',
      'No parties or events',
      'Check-in: 3:00 PM - 11:00 PM',
      'Check-out: 11:00 AM'
    ],
    cancellationPolicy: 'Free cancellation for 48 hours. After that, cancel before 3:00 PM on Nov 30 for a partial refund.'
  },
  {
    id: '5',
    title: 'Luxury Villa on Saadiyat Island',
    location: 'Saadiyat Island, Abu Dhabi',
    price: 900,
    rating: 4.9,
    reviewCount: 67,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop'
    ],
    isSuperhost: true,
    type: 'Villa',
    beds: 5,
    baths: 4,
    guests: 10,
    slug: 'luxury-villa-saadiyat-island',
    description: 'Exclusive luxury villa on Saadiyat Island with private beach access. Close to cultural attractions including the Louvre Abu Dhabi and Guggenheim Museum.',
    amenities: ['WiFi', 'Kitchen', 'Washer', 'Dryer', 'Air conditioning', 'Heating', 'TV', 'Hair dryer', 'Iron', 'Beach access', 'Pool', 'Hot tub', 'Private beach', 'Gym'],
    host: {
      name: 'Khalid Al-Mansouri',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      joinedDate: 'February 2018',
      responseRate: '100%',
      responseTime: 'within an hour'
    },
    houseRules: [
      'No smoking',
      'Pets allowed',
      'No parties or events',
      'Check-in: 4:00 PM - 10:00 PM',
      'Check-out: 11:00 AM'
    ],
    cancellationPolicy: 'Free cancellation for 48 hours. After that, cancel before 4:00 PM on Dec 1 for a partial refund.'
  },
  {
    id: '6',
    title: 'Modern Apartment on Corniche',
    location: 'Corniche, Abu Dhabi',
    price: 400,
    rating: 4.5,
    reviewCount: 92,
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-14b1e0d0f905?w=1200&h=800&fit=crop'
    ],
    isSuperhost: false,
    type: 'Apartment',
    beds: 2,
    baths: 2,
    guests: 4,
    slug: 'modern-apartment-corniche-abu-dhabi',
    description: 'Beautiful modern apartment overlooking the Corniche waterfront in Abu Dhabi. Perfect location for business travelers and tourists alike.',
    amenities: ['WiFi', 'Kitchen', 'Washer', 'Dryer', 'Air conditioning', 'Heating', 'TV', 'Hair dryer', 'Iron', 'Laptop friendly workspace', 'Pool', 'Gym'],
    host: {
      name: 'Mariam Al-Zahra',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      joinedDate: 'April 2021',
      responseRate: '96%',
      responseTime: 'within 1 hour'
    },
    houseRules: [
      'No smoking',
      'No pets',
      'No parties or events',
      'Check-in: 3:00 PM - 11:00 PM',
      'Check-out: 11:00 AM'
    ],
    cancellationPolicy: 'Free cancellation for 48 hours. After that, cancel before 3:00 PM on Dec 2 for a partial refund.'
  }
]

interface PropertyPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const { slug } = await params
  const property = properties.find(p => p.slug === slug)
  
  if (!property) {
    return {
      title: 'Property Not Found',
      description: 'The property you are looking for could not be found.'
    }
  }

  return {
    title: property.title,
    description: property.description,
    openGraph: {
      title: property.title,
      description: property.description,
      images: property.images.slice(0, 4),
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: property.title,
      description: property.description,
      images: [property.images[0]],
    },
  }
}

export async function generateStaticParams() {
  return properties.map((property) => ({
    slug: property.slug,
  }))
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { slug } = await params
  const property = properties.find(p => p.slug === slug)

  if (!property) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <Header />
      <PropertyDetails property={property} />
      <Footer />
    </div>
  )
}
