"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

interface Place {
  id: number
  name: string
  address: string
  lat: number
  lng: number
  type: "visitado" | "planeado" | "evento"
  date: string
  description: string
}

interface GoogleMapProps {
  places: Place[]
  onPlaceSelect: (lat: number, lng: number, address: string, name: string) => void
  onPlaceAction: (action: string, place: Place) => void
  selectedFilter: string
}

declare global {
  interface Window {
    google: any
    initMap: () => void
  }
}

export default function GoogleMap({ places, onPlaceSelect, onPlaceAction, selectedFilter }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [searchValue, setSearchValue] = useState("")
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number
    lng: number
    address: string
    name: string
  } | null>(null)
  const [markers, setMarkers] = useState<any[]>([])
  const [tempMarker, setTempMarker] = useState<any>(null)
  const [searchInput, setSearchInput] = useState<HTMLInputElement | null>(null)
  const [autocomplete, setAutocomplete] = useState<any>(null)

  const filteredPlaces = places.filter((place) => selectedFilter === "todos" || place.type === selectedFilter)

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) {
        initializeMap()
        return
      }

      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAukvofYF1f1VtbXUMPxePIWzy5okQqkEE&libraries=places&callback=initMap`
      script.async = true
      script.defer = true
      document.head.appendChild(script)

      window.initMap = initializeMap
    }

    const initializeMap = () => {
      if (!mapRef.current) return

      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: { lat: 8.7479, lng: -75.8814 }, // Montería, Córdoba
        zoom: 13,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      })

      setMap(mapInstance)

      // Add click listener to map
      mapInstance.addListener("click", (event: any) => {
        const lat = event.latLng.lat()
        const lng = event.latLng.lng()

        // Remove previous temp marker
        if (tempMarker) {
          tempMarker.setMap(null)
        }

        // Create new temp marker
        const marker = new window.google.maps.Marker({
          position: { lat, lng },
          map: mapInstance,
          icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
          },
        })

        setTempMarker(marker)

        // Reverse geocoding to get address
        const geocoder = new window.google.maps.Geocoder()
        geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
          if (status === "OK" && results[0]) {
            const address = results[0].formatted_address
            const name = results[0].address_components[0]?.long_name || "Lugar seleccionado"
            setSelectedLocation({ lat, lng, address, name })
          }
        })
      })
    }

    loadGoogleMaps()
  }, [])

  useEffect(() => {
    if (map && searchInput) {
      const autocompleteInstance = new window.google.maps.places.Autocomplete(searchInput, {
        fields: ["place_id", "geometry", "name", "formatted_address"],
      })

      autocompleteInstance.addListener("place_changed", () => {
        const place = autocompleteInstance.getPlace()
        if (place.geometry) {
          const lat = place.geometry.location.lat()
          const lng = place.geometry.location.lng()
          map.setCenter({ lat, lng })
          map.setZoom(15)

          // Remove previous temp marker
          if (tempMarker) {
            tempMarker.setMap(null)
          }

          // Create new temp marker
          const marker = new window.google.maps.Marker({
            position: { lat, lng },
            map: map,
            icon: {
              url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
            },
          })

          setTempMarker(marker)
          setSelectedLocation({
            lat,
            lng,
            address: place.formatted_address || "",
            name: place.name || "Lugar seleccionado",
          })
        }
      })

      setAutocomplete(autocompleteInstance)
    }
  }, [map, searchInput])

  useEffect(() => {
    if (!map) return

    // Clear existing markers
    markers.forEach((marker) => marker.setMap(null))

    // Add markers for filtered places
    const newMarkers = filteredPlaces.map((place) => {
      const marker = new window.google.maps.Marker({
        position: { lat: place.lat, lng: place.lng },
        map: map,
        title: place.name,
        icon: {
          url:
            place.type === "visitado"
              ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
              : place.type === "planeado"
                ? "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                : "http://maps.google.com/mapfiles/ms/icons/purple-dot.png",
        },
      })

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h3 class="font-bold text-pink-600">${place.name}</h3>
            <p class="text-sm text-gray-600">${place.date}</p>
            <p class="text-sm">${place.description}</p>
            <div class="mt-2 flex gap-2">
              <button onclick="window.handlePlaceAction('route', ${place.id})" class="text-xs bg-blue-500 text-white px-2 py-1 rounded">Cómo llegar</button>
              <button onclick="window.handlePlaceAction('gallery', ${place.id})" class="text-xs bg-green-500 text-white px-2 py-1 rounded">Galería</button>
            </div>
          </div>
        `,
      })

      marker.addListener("click", () => {
        infoWindow.open(map, marker)
      })

      return marker
    })

    setMarkers(newMarkers)

    // Global function for info window buttons
    window.handlePlaceAction = (action: string, placeId: number) => {
      const place = places.find((p) => p.id === placeId)
      if (place) {
        onPlaceAction(action, place)
      }
    }
  }, [map, filteredPlaces, places, onPlaceAction])

  const clearSearch = () => {
    setSearchValue("")
    if (searchInput) {
      searchInput.value = ""
    }
  }

  const useSelectedLocation = () => {
    if (selectedLocation) {
      onPlaceSelect(selectedLocation.lat, selectedLocation.lng, selectedLocation.address, selectedLocation.name)
      setSelectedLocation(null)
      if (tempMarker) {
        tempMarker.setMap(null)
        setTempMarker(null)
      }
    }
  }

  return (
    <div className="relative">
      {/* Search input */}
      <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            ref={setSearchInput}
            type="text"
            placeholder="Buscar lugares..."
            className="pl-10 pr-10 py-2 w-64 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          {searchValue && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Selection message */}
      {selectedLocation && (
        <div className="absolute top-20 left-4 z-10 bg-white rounded-lg shadow-md p-4 max-w-sm">
          <h3 className="font-medium text-gray-900">{selectedLocation.name}</h3>
          <p className="text-sm text-gray-600 mb-3">{selectedLocation.address}</p>
          <Button onClick={useSelectedLocation} className="bg-pink-600 hover:bg-pink-700 text-white">
            Usar esta ubicación
          </Button>
        </div>
      )}

      {/* Map container */}
      <div ref={mapRef} className="w-full h-96 rounded-lg shadow-md" />
    </div>
  )
}
