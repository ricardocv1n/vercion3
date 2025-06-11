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
  images?: string[]
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
    handlePlaceAction: (action: string, placeId: number) => void; // Declaración global para la función
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
  const [currentInfoWindow, setCurrentInfoWindow] = useState<any>(null); // Estado para la InfoWindow actualmente abierta

  // Filtra los lugares basándose en el filtro seleccionado
  const filteredPlaces = places.filter((place) => selectedFilter === "todos" || place.type === selectedFilter)

  // useEffect para cargar la API de Google Maps e inicializar el mapa
  useEffect(() => {
    const loadGoogleMaps = () => {
      // Si la API de Google Maps ya está cargada, inicializar el mapa directamente
      if (window.google) {
        initializeMap()
        return
      }

      // Crear y añadir el script de la API de Google Maps
      const script = document.createElement("script")
      // NOTA: La clave API se asume que ha sido resuelta por el usuario (ej. via NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`
      script.async = true
      script.defer = true
      document.head.appendChild(script)

      // Asignar la función de inicialización del mapa a window para que la API la llame
      window.initMap = initializeMap
    }

    const initializeMap = () => {
      if (!mapRef.current) return

      // Crear una nueva instancia del mapa
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: { lat: 8.7479, lng: -75.8814 }, // Centro inicial del mapa (Montería, Córdoba)
        zoom: 13,
        styles: [
          {
            featureType: "poi", // Desactivar puntos de interés
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      })

      setMap(mapInstance)

      // Añadir un listener de clic al mapa para permitir la selección de ubicaciones
      mapInstance.addListener("click", (event: any) => {
        const lat = event.latLng.lat()
        const lng = event.latLng.lng()

        // Eliminar el marcador temporal anterior si existe
        if (tempMarker) {
          tempMarker.setMap(null)
        }
        // Cerrar cualquier InfoWindow abierta al hacer clic en el mapa
        if (currentInfoWindow) {
          currentInfoWindow.close();
          setCurrentInfoWindow(null);
        }

        // Crear un nuevo marcador temporal para la ubicación seleccionada
        const marker = new window.google.maps.Marker({
          position: { lat, lng },
          map: mapInstance,
          icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png", // Icono de marcador temporal
          },
        })

        setTempMarker(marker)

        // Realizar geocodificación inversa para obtener la dirección del punto clicado
        const geocoder = new window.google.maps.Geocoder()
        geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
          if (status === "OK" && results[0]) {
            const address = results[0].formatted_address
            // Intentar obtener un nombre más específico, si no, usar "Lugar seleccionado"
            const name = results[0].address_components[0]?.long_name || results[0].address_components.find((comp: any) => comp.types.includes('locality'))?.long_name || "Lugar seleccionado"
            setSelectedLocation({ lat, lng, address, name })
          } else {
            setSelectedLocation({ lat, lng, address: "Dirección desconocida", name: "Lugar seleccionado" });
          }
        })
      })
    }

    loadGoogleMaps()
  }, []) // Se ejecuta solo una vez al montar el componente

  // useEffect para inicializar el Autocomplete de lugares
  useEffect(() => {
    if (map && searchInput && !autocomplete) { // Solo inicializar una vez
      const autocompleteInstance = new window.google.maps.places.Autocomplete(searchInput, {
        fields: ["place_id", "geometry", "name", "formatted_address"], // Campos a solicitar
      })

      // Listener para cuando se selecciona un lugar del autocompletado
      autocompleteInstance.addListener("place_changed", () => {
        const place = autocompleteInstance.getPlace()
        if (place.geometry) {
          const lat = place.geometry.location.lat()
          const lng = place.geometry.location.lng()
          map.setCenter({ lat, lng }) // Centrar el mapa en el lugar seleccionado
          map.setZoom(15) // Zoom in para el lugar seleccionado

          // Eliminar el marcador temporal anterior si existe
          if (tempMarker) {
            tempMarker.setMap(null)
          }
          // Cerrar cualquier InfoWindow abierta
          if (currentInfoWindow) {
            currentInfoWindow.close();
            setCurrentInfoWindow(null);
          }

          // Crear un nuevo marcador temporal
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
          setSearchValue(place.name || ""); // Actualizar el valor del input de búsqueda
        } else {
          // Si el lugar no tiene geometría (ej. solo texto de búsqueda)
          console.warn("No se encontraron detalles de geometría para el lugar seleccionado.");
        }
      })

      setAutocomplete(autocompleteInstance)
    }
  }, [map, searchInput, tempMarker, autocomplete, currentInfoWindow]) // Dependencias

  // useEffect para actualizar los marcadores de los lugares guardados
  useEffect(() => {
    if (!map) return

    // Limpiar marcadores existentes antes de añadir los nuevos
    markers.forEach((marker) => marker.setMap(null))
    // Cerrar cualquier InfoWindow abierta al recargar marcadores
    if (currentInfoWindow) {
      currentInfoWindow.close();
      setCurrentInfoWindow(null);
    }

    // Añadir marcadores para los lugares filtrados
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

      // Contenido HTML para la ventana de información del marcador
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

      // Listener de clic para abrir la InfoWindow
      marker.addListener("click", () => {
        // Cierra la InfoWindow previamente abierta si existe
        if (currentInfoWindow) {
          currentInfoWindow.close();
        }
        infoWindow.open(map, marker)
        setCurrentInfoWindow(infoWindow); // Guarda la InfoWindow actual
      })

      return marker
    })

    setMarkers(newMarkers)

    // Definir la función global para ser accesible desde el HTML de la InfoWindow
    window.handlePlaceAction = (action: string, placeId: number) => {
      const place = places.find((p) => p.id === placeId)
      if (place) {
        onPlaceAction(action, place)
      }
    }
  }, [map, filteredPlaces, places, onPlaceAction, currentInfoWindow]) // Añadir currentInfoWindow a las dependencias

  // Limpia el valor de búsqueda
  const clearSearch = () => {
    setSearchValue("")
    if (searchInput) {
      searchInput.value = "" // Limpiar el input directamente
      // Si el autocomplete está activo, también podría necesitar resetearse para borrar sugerencias
      if (autocomplete) {
        // No hay un método directo para "resetear" el Autocomplete sin recrearlo
        // Simplemente borrar el valor es suficiente para la UX en este caso
      }
    }
    setSelectedLocation(null); // Borrar selección de lugar si se limpia la búsqueda
    if (tempMarker) {
      tempMarker.setMap(null); // Eliminar marcador temporal
      setTempMarker(null);
    }
  }

  // Utiliza la ubicación seleccionada para el formulario de nuevo lugar
  const useSelectedLocation = () => {
    if (selectedLocation) {
      onPlaceSelect(selectedLocation.lat, selectedLocation.lng, selectedLocation.address, selectedLocation.name)
      setSelectedLocation(null) // Limpiar la selección después de usarla
      if (tempMarker) {
        tempMarker.setMap(null) // Eliminar el marcador temporal
        setTempMarker(null)
      }
    }
  }

  return (
    <div className="relative">
      {/* Campo de búsqueda */}
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

      {/* Mensaje de selección de ubicación */}
      {selectedLocation && (
        <div className="absolute top-20 left-4 z-10 bg-white rounded-lg shadow-md p-4 max-w-sm">
          <h3 className="font-medium text-gray-900">{selectedLocation.name}</h3>
          <p className="text-sm text-gray-600 mb-3">{selectedLocation.address}</p>
          <Button onClick={useSelectedLocation} className="bg-pink-600 hover:bg-pink-700 text-white">
            Usar esta ubicación
          </Button>
        </div>
      )}

      {/* Contenedor del mapa */}
      <div ref={mapRef} className="w-full h-96 rounded-lg shadow-md" />
    </div>
  )
}
