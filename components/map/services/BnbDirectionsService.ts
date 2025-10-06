export default class BnbDirectionsService {
  private directionsService: google.maps.DirectionsService;
  private directionsRenderer: google.maps.DirectionsRenderer;

  constructor() {
    if (typeof window !== 'undefined' && window.google) {
      this.directionsService = new google.maps.DirectionsService();
      this.directionsRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: '#006699',
          strokeOpacity: 0.8,
          strokeWeight: 4
        }
      });
    }
  }

  async getDirections(origin: google.maps.LatLng, destination: google.maps.LatLng) {
    if (!this.directionsService) {
      return {
        success: false,
        error: 'Directions service not initialized'
      };
    }
    
    try {
      const result = await this.directionsService.route({
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC
      });

      return {
        success: true,
        result: result,
        distance: result.routes[0]?.legs[0]?.distance?.text || 'Unknown',
        duration: result.routes[0]?.legs[0]?.duration?.text || 'Unknown'
      };
    } catch (error) {
      console.error('Directions error:', error);
      return {
        success: false,
        error: error
      };
    }
  }

  setMap(map: google.maps.Map) {
    this.directionsRenderer.setMap(map);
  }

  setDirections(result: google.maps.DirectionsResult) {
    this.directionsRenderer.setDirections(result);
  }

  clearDirections() {
    this.directionsRenderer.setDirections({ routes: [] });
  }
}
