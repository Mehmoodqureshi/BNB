export const createClusterRenderer = (map: google.maps.Map) => {
  if (typeof window === 'undefined' || !window.google) {
    return {
      render: () => null
    };
  }

  return {
    render: (cluster: any, stats: any) => {
      const count = cluster.count;
      const size = count < 10 ? 40 : count < 100 ? 50 : 60;
      
      const svg = `
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
          <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 2}" 
                  fill="#006699" stroke="#ffffff" stroke-width="2"/>
          <text x="${size/2}" y="${size/2 + 4}" 
                text-anchor="middle" fill="white" 
                font-family="Arial, sans-serif" 
                font-size="${count < 10 ? '12' : count < 100 ? '14' : '16'}" 
                font-weight="bold">
            ${count}
          </text>
        </svg>
      `;
      
      return new google.maps.Marker({
        position: cluster.position,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
          scaledSize: new google.maps.Size(size, size),
          anchor: new google.maps.Point(size/2, size/2)
        },
        zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count
      });
    }
  };
};
