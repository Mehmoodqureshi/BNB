'use client'
import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useMediaQuery } from 'react-responsive'
import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api'
import {
    MarkerClusterer,
    SuperClusterAlgorithm,
} from '@googlemaps/markerclusterer'
import LoadingResult from '../LoadingResult'
import { motion, AnimatePresence } from 'framer-motion'

// Import refactored components
import BnbPropertyCard from './popups/BnbPropertyCard'
import BnbHoverCard from './popups/BnbHoverCard'
import BnbMarker from './markers/BnbMarker'
import RoutePolyline from './RoutePolyline'

// Import utility functions and services
import {
    processFeatures,
    formatPrice,
    getDistanceFromLatLonInKm,
} from './markers/BnbMarkerUtils'
import { createClusterRenderer } from './markers/BnbClusterRenderer'
import BnbDirectionsService from './services/BnbDirectionsService'
import { AgenciesApi } from './services/AgenciesApi'

interface BnbGoogleMapComponentProps {
    allProperties: any[];
    setSelectedBox: (data: any) => void;
    bbox?: any;
}

const BnbGoogleMapComponent: React.FC<BnbGoogleMapComponentProps> = ({
    allProperties,
    setSelectedBox,
    bbox = false,
}) => {
    const [map, setMap] = useState<google.maps.Map | null>(null)
    const [isMapLoaded, setIsMapLoaded] = useState(false)
    const [clusterer, setClusterer] = useState<MarkerClusterer | null>(null)
    const [markers, setMarkers] = useState<google.maps.Marker[]>([])
    const mapRef = useRef<HTMLDivElement | null>(null)
    const isMobile = useMediaQuery({ maxWidth: 991 })
    const router = useRouter()
    const [isZooming, setIsZooming] = useState(false)
    const zoomTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const [clickedProperty, setClickedProperty] = useState<any>(null)
    const [hoverCard, setHoverCard] = useState<any>(null)
    const [distance, setDistance] = useState<string | null>(null)
    const [loadingDirection, setLoadingDirection] = useState(false)
    const [directionError, setDirectionError] = useState<string | null>(null)
    const [routePath, setRoutePath] = useState<any>(null)

    const directionsService = useMemo(() => new BnbDirectionsService(), [])

    console.log('allPropertiesallProperties', allProperties)

    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        mapIds: ['c770d64aaa7c461c'],
    })

    // Group properties by agency and sort by price
    const groupedPropertiesByAgency = useMemo(() => {
        if (!allProperties || !Array.isArray(allProperties)) return {}
        
        const agencyGroups: Record<string, any[]> = {}
        
        allProperties.forEach((property: any) => {
            const agencyId = property.agency_id || 'unknown'
            const rent = parseFloat(property.rent) || 0
            
            if (!agencyGroups[agencyId]) {
                agencyGroups[agencyId] = []
            }
            
            agencyGroups[agencyId].push(property)
        })
        
        // Sort properties within each agency by price (lowest first)
        Object.keys(agencyGroups).forEach((agencyId: string) => {
            agencyGroups[agencyId].sort((a: any, b: any) => {
                const rentA = parseFloat(a.rent) || 0
                const rentB = parseFloat(b.rent) || 0
                return rentA - rentB
            })
        })
        
        return agencyGroups
    }, [allProperties])

    // Initialize map
    useEffect(() => {
        if (!isLoaded || !window.google) return

        const mapOptions = {
            zoom: 12,
            center: { lat: 25.1932, lng: 55.4144 }, // Safari Park
            minZoom: 11,
            maxZoom: 22,
            styles: [
                {
                    featureType: 'water',
                    elementType: 'geometry',
                    stylers: [{ color: '#e3e8fe' }],
                },
            ],
            zoomControl: false,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: true,
            rotateControl: false,
            fullscreenControl: false,
            gestureHandling: 'greedy',
            disableDoubleClickZoom: false,
            scrollwheel: true,
            mapId: 'c770d64aaa7c461c',
        }

        const newMap = new window.google.maps.Map(
            document.getElementById('map-container'),
            mapOptions
        )

        // Add CSS styles
        const css = `
            #map-container {
                height: 120vh;
                width: 100%;
            }
            
            @keyframes markerFadeIn {
                from { opacity: 0; transform: translate3d(0, -10px, 0); }
                to { opacity: 1; transform: translate3d(0, 0, 0); }
            }
            
            @keyframes markerFadeOut {
                from { opacity: 1; transform: translate3d(0, 0, 0); }
                to { opacity: 0; transform: translate3d(0, 10px, 0); }
            }
            
            .marker-enter {
                animation: markerFadeIn 0.3s ease-out forwards;
                will-change: transform, opacity;
            }
            
            .marker-exit {
                animation: markerFadeOut 0.3s ease-in forwards;
                will-change: transform, opacity;
            }
            
            .opacity-animated {
                transition: opacity 0.3s ease;
                will-change: opacity;
            }
            
            .hardware-accelerated {
                transform: translateZ(0);
                backface-visibility: hidden;
                perspective: 1000px;
                will-change: transform;
            }
        `

        const style = document.createElement('style')
        style.appendChild(document.createTextNode(css))
        document.head.appendChild(style)

        // Initialize clusterer with custom renderer
        const renderer = createClusterRenderer(newMap) as any
        const newClusterer = new MarkerClusterer({
            map: newMap,
            markers: [],
            renderer: renderer,
            algorithm: new SuperClusterAlgorithm({
                maxZoom: 17,
                radius: 40, // Increased radius for better agency grouping
                minPoints: 1, // Changed to 1 to allow single properties to show
                extent: 256,
                nodeSize: 64,
            }),
            onClusterClick: (event: any, cluster: any, map: google.maps.Map) => {
                const markers = cluster.markers
                if (markers.length > 0) {
                    // Group markers by agency and sort by price
                    const agencyGroups: Record<string, any[]> = {}
                    
                    markers.forEach((marker: any) => {
                        const markerData = marker.get('featureData')
                        if (markerData) {
                            const agencyId = markerData.agency_id || 'unknown'
                            if (!agencyGroups[agencyId]) {
                                agencyGroups[agencyId] = []
                            }
                            agencyGroups[agencyId].push(markerData)
                        }
                    })
                    
                    // Sort properties within each agency by price (lowest first)
                    const sortedPropertyData: any[] = []
                    Object.keys(agencyGroups).forEach((agencyId: string) => {
                        const sortedAgencyProperties = agencyGroups[agencyId].sort((a: any, b: any) => {
                            const rentA = parseFloat(a.rent) || 0
                            const rentB = parseFloat(b.rent) || 0
                            return rentA - rentB
                        })
                        
                        sortedAgencyProperties.forEach((property: any) => {
                            const data: any = { properties: { data: property } }
                            sortedPropertyData.push(data)
                        })
                    })

                    if (sortedPropertyData.length > 0) {
                        setSelectedBox(sortedPropertyData)
                    }

                    const bounds = new google.maps.LatLngBounds()
                    markers.forEach((marker: any) =>
                        bounds.extend(marker.getPosition())
                    )

                    map.fitBounds(bounds, 50)
                }
                return false
            },
        })

        setMap(newMap)
        setClusterer(newClusterer)

        // Prevent auto-zoom on mobile
        if (isMobile) {
            const mapClickListener = newMap.addListener('click', (e: any) => {
                // Prevent any automatic zoom behavior on mobile
                if (e.stop) e.stop()
            })

            return () => {
                if (newMap && mapClickListener) {
                    google.maps.event.removeListener(mapClickListener)
                }
            }
        }

        return () => {
            if (newMap) {
                // Cleanup
            }
        }
    }, [isLoaded])

    // Process features from grouped properties data
    const processedFeatures = useMemo(() => {
        const features: any[] = []
        
        Object.keys(groupedPropertiesByAgency).forEach((agencyId: string) => {
            const agencyProperties = groupedPropertiesByAgency[agencyId]
            
            // Process all properties for this agency (already sorted by price)
            agencyProperties.forEach((property: any) => {
                if (property.location) {
                    const locationParts = property.location.split(',')
                    if (locationParts.length >= 2) {
                        const lat = parseFloat(locationParts[0].trim())
                        const lng = parseFloat(locationParts[1].trim())
                        
                        if (!isNaN(lat) && !isNaN(lng)) {
                            features.push({
                                position: { lat, lng },
                                data: {
                                    ...property,
                                    agency_id: agencyId
                                }
                            })
                        }
                    }
                }
            })
        })
        
        return features
    }, [groupedPropertiesByAgency])

    // Handle markers creation and updates
    useEffect(() => {
        if (!map || !processedFeatures.length) return

        // Handle bounding box if provided
        if (bbox && Array.isArray(bbox)) {
            const bounds = new google.maps.LatLngBounds(
                new google.maps.LatLng(bbox[0][1], bbox[0][0]), // southwest
                new google.maps.LatLng(bbox[1][1], bbox[1][0]) // northeast
            )

            map.fitBounds(bounds, 50)

            // Limit maximum zoom level for location searches
            const listener = map.addListener('idle', () => {
                const zoom = map.getZoom()
                if (zoom && zoom > 15) {
                    map.setZoom(15)
                }
                google.maps.event.removeListener(listener)
            })
        }

        // Clear existing markers efficiently
        if (markers.length > 0) {
            markers.forEach((marker) => marker.setMap(null))
        }

        // Create new markers with agency priority
        const newMarkers = processedFeatures.map((feature) => {
            const marker = new google.maps.Marker({
                position: feature.position,
                map: map,
                clickable: true,
                // Prevent automatic zoom on mobile
                optimized: false,
            })

            // Store feature data in marker
            marker.set('featureData', feature.data)

            return marker
        })

        // Add markers to clusterer in batch
        if (newMarkers.length > 0) {
            setMarkers(newMarkers)
        }

        setIsMapLoaded(true)
    }, [map, processedFeatures, bbox])

    // Handle marker styling and interactions
    useEffect(() => {
        if (!map || !markers.length) return

        markers.forEach((marker) => {
            const markerData = marker.get('featureData')
            const isHovered = hoverCard?.property?.id === markerData?.id
            const isSelected = clickedProperty?.id === markerData?.id

            // Check if this is the lowest price for its agency
            const agencyId = markerData?.agency_id
            const agencyProperties = groupedPropertiesByAgency[agencyId] || []
            const isLowestPrice = agencyProperties.length > 0 && agencyProperties[0]?.id === markerData?.id

            // Generate SVG using BnbMarker styling logic
            const rentText = markerData?.rent ?? ''
            const formattedPrice = formatPrice(Number(rentText))

            // Use different styling for lowest price properties
            const bgColor = isSelected || isHovered ? '#006699' : (isLowestPrice ? '#00cc66' : '#fff')
            const textColor = isSelected  ? 'white' : '#202124'
            const iconColor = isSelected  ? 'white' : '#006699'
            const borderColor = isLowestPrice ? '#5e5e5e87' : '#5e5e5e87'
            const shadowColor = 'rgba(60,64,67,0.15)'
            const pillFill = isSelected ? '#006699' : (isLowestPrice ? '#f8f9fa' : '#f8f9fa')
            const homeIconBg = isSelected ? '#fff' : '#f8f9fa'

            // Calculate dynamic width based on text length
            const textLength = formattedPrice.length
            const baseWidth = 80
            const textWidth = textLength * 7
            const dynamicWidth = Math.max(baseWidth, textWidth + 62)
            const centerX = dynamicWidth / 2

         const rentSvg = `
<svg width="${dynamicWidth}" height="42" viewBox="0 0 ${dynamicWidth} 42" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="gray" flood-opacity="0.1" />
    </filter>
  </defs>

  <g filter="url(#shadow)">
    <!-- Tail -->
    <path d="M${centerX} 42 L${centerX - 6} 32 L${centerX + 6} 32 Z"
          fill="${pillFill}"
          stroke="${borderColor}"
          stroke-width="1" />

    <!-- Pill Body -->
    <rect x="4" y="3" width="${dynamicWidth - 8}" height="30" rx="15"
          fill="${pillFill}"
          stroke="${borderColor}"
          stroke-width="1" />

    <!-- Home icon -->
    <g transform="translate(10, 9) scale(0.7)">
      <path
        d="M12 2L2 9v13h20V9l-10-7zM9 22V14h6v8H9z"
        fill="${iconColor}"
        stroke-linejoin="round" />
    </g>

    <!-- Price text -->
 <text
  x="34"
  y="20"
  font-size="13"
  font-family="Roboto, Arial, sans-serif"
  font-weight="700"
  fill="${textColor}"
  dominant-baseline="middle"
  letter-spacing="-0.5px">
  ${formattedPrice}
</text>
  </g>
</svg>
`

            marker.setIcon({
                url:
                    'data:image/svg+xml;charset=UTF-8,' +
                    encodeURIComponent(rentSvg),
                scaledSize: new google.maps.Size(dynamicWidth, 42),
                anchor: new google.maps.Point(centerX, 42),
            })

            // Set higher z-index for selected marker and lowest price markers
            if (isSelected) {
                marker.setZIndex(1000)
            } else if (isLowestPrice) {
                marker.setZIndex(500)
            } else {
                marker.setZIndex(undefined)
            }

            // Clear existing listeners
            google.maps.event.clearInstanceListeners(marker)

            // Add hover event listeners
            marker.addListener('mouseover', () => {
                const projection = map.getProjection()
                const position = marker.getPosition()
                if (projection && position) {
                    const bounds = map.getBounds()
                    if (!bounds) return
                    
                    const point = projection.fromLatLngToPoint(position)
                    if (!point) return
                    
                    const zoom = map.getZoom()
                    if (!zoom) return
                    
                    const scale = Math.pow(2, zoom)
                    const topRight = projection.fromLatLngToPoint(bounds.getNorthEast())
                    const bottomLeft = projection.fromLatLngToPoint(bounds.getSouthWest())
                    
                    if (!topRight || !bottomLeft) return
                    
                    const worldPoint = new window.google.maps.Point(
                        (point.x - bottomLeft.x) * scale,
                        (point.y - topRight.y) * scale
                    )
                    setHoverCard({
                        property: markerData,
                        position: {
                            left: worldPoint.x - 120,
                            top: worldPoint.y - 210,
                        },
                    })
                }
            })

            marker.addListener('mouseout', () => {
                setHoverCard(null)
            })

            marker.addListener('click', (e: any) => {
                // Prevent default zoom behavior on mobile
                if (isMobile && e.stop) {
                    e.stop()
                }

                setClickedProperty(markerData)
                // Calculate distance automatically when property is clicked using Dubai center
                const dubaiLat = 25.276987
                const dubaiLng = 55.296249

                // Parse location field which contains coordinates as "lat,lng"
                let propertyLat, propertyLng
                if (markerData.location) {
                    const locationParts = markerData.location.split(',')
                    if (locationParts.length >= 2) {
                        propertyLat = parseFloat(locationParts[0].trim())
                        propertyLng = parseFloat(locationParts[1].trim())
                    }
                }

                if (
                    propertyLat &&
                    propertyLng &&
                    !isNaN(propertyLat) &&
                    !isNaN(propertyLng)
                ) {
                    const dist = getDistanceFromLatLonInKm(
                        dubaiLat,
                        dubaiLng,
                        propertyLat,
                        propertyLng
                    )
                    setDistance(dist.toFixed(2))
                } else {
                    setDistance(null)
                }
            })
        })
    }, [map, markers, hoverCard, clickedProperty, groupedPropertiesByAgency])

    // Handle zoom changes
    const handleZoomEnd = useCallback(() => {
        document.querySelectorAll('.marketElement').forEach((el) => {
            el.classList.add('opacity-animated')
            el.classList.add('hardware-accelerated')
        })
        setIsZooming(false)
    }, [])

    useEffect(() => {
        if (map && clusterer) {
            const addZoomingClass = () => {
                document.body.classList.add('map-zooming')
            }

            const removeZoomingClass = () => {
                document.body.classList.remove('map-zooming')
            }

            const zoomStartListener = map.addListener('zoom_changed', () => {
                if (!isZooming) {
                    addZoomingClass()
                    setIsZooming(true)
                }

                if (zoomTimeoutRef.current) {
                    clearTimeout(zoomTimeoutRef.current)
                }

                zoomTimeoutRef.current = setTimeout(() => {
                    handleZoomEnd()
                    removeZoomingClass()
                }, 250)
            })

            const flickerPreventionStyle = document.createElement('style')
            flickerPreventionStyle.textContent = `
                .map-zooming .gm-style img,
                .map-zooming .gm-style-default-marker,
                .map-zooming .gm-style > div > div > div > div > div > img {
                    transition: transform 0.3s ease-out !important;
                    transform: translateZ(0) !important;
                    backface-visibility: hidden !important;
                    perspective: 1000px !important;
                    will-change: transform !important;
                }
                
                .map-zooming .cluster-marker,
                .map-zooming .marker-icon-custom {
                    opacity: 1 !important;
                    visibility: visible !important;
                }
            `
            document.head.appendChild(flickerPreventionStyle)

            return () => {
                if (zoomStartListener) {
                    google.maps.event.removeListener(zoomStartListener)
                }

                if (flickerPreventionStyle.parentNode) {
                    flickerPreventionStyle.parentNode.removeChild(
                        flickerPreventionStyle
                    )
                }

                if (zoomTimeoutRef.current) {
                    clearTimeout(zoomTimeoutRef.current)
                }

                removeZoomingClass()
            }
        }
    }, [map, clusterer, handleZoomEnd, isZooming])

    // Optimize marker rendering
    useEffect(() => {
        if (map) {
            const optimizeMarkers = () => {
                const markerImages = document.querySelectorAll('.gm-style img')
                markerImages.forEach((img) => {
                    const element = img as HTMLElement
                    element.style.willChange = 'transform'
                    element.style.transform = 'translateZ(0)'
                })
            }

            const idleListener = map.addListener('idle', optimizeMarkers)

            if (markers.length > 0) {
                requestAnimationFrame(optimizeMarkers)
            }

            return () => {
                if (idleListener) {
                    google.maps.event.removeListener(idleListener)
                }
            }
        }
    }, [map, markers.length])

    // Handle directions click
    const handleDirectionsClick = () => {
        // Directions functionality would be implemented here
        console.log('Directions clicked for', clickedProperty)
    }

    if (loadError) {
        return (
            <div className="flex items-center justify-center w-full h-full mx-auto">
                <div className="text-center">
                    <div className="text-red-500 mb-2">Failed to load Google Maps</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        Please check your API key configuration
                    </div>
                </div>
            </div>
        );
    }

    if (!isLoaded || !window.google)
        return (
            <div className="flex items-center justify-center w-full h-full mx-auto">
                <LoadingResult />
            </div>
        )

    return (
        <>
            <div
                id="map-container"
                className="relative"
                style={{ width: '100vw', height: '100vh' }}
            />

            {/* Hover Card */}
            {hoverCard && !clickedProperty && !isMobile && (
                <div
                    onMouseEnter={() => setHoverCard(hoverCard)}
                    onMouseLeave={() => setHoverCard(null)}
                    style={{
                        position: 'absolute',
                        top: hoverCard.position.top,
                        left: hoverCard.position.left,
                        zIndex: 9999,
                    }}
                    className="w-[280px]"
                >
                    <BnbHoverCard
                        property={hoverCard.property}
                        onClose={() => setHoverCard(null)}
                    />
                </div>
            )}

            {/* Property Card */}
            {clickedProperty && (
                <AnimatePresence>
                    <motion.div
                        initial={{
                            y: -40,
                            opacity: 0,
                        }}
                        animate={{
                            y: 0,
                            opacity: 1,
                            transition: {
                                type: 'spring',
                                duration: 0.5,
                                bounce: 0.2,
                            },
                        }}
                        exit={{
                            y: -40,
                            opacity: 0,
                            transition: {
                                duration: 0.3,
                            },
                        }}
                        className={
                            isMobile
                                ? 'fixed inset-0 z-[9999] flex items-end'
                                : ''
                        }
                    >
                        {/* Mobile overlay background */}
                        {isMobile && (
                            <div
                                className="absolute inset-0 bg-black/50"
                                onClick={() => setClickedProperty(null)}
                            />
                        )}
                        <BnbPropertyCard
                            property={clickedProperty}
                            onClose={() => setClickedProperty(null)}
                            onSelect={() => router.push(`/property/${clickedProperty.slug || clickedProperty.id}`)}
                        />
                    </motion.div>
                </AnimatePresence>
            )}

        </>
    )
}

export default BnbGoogleMapComponent