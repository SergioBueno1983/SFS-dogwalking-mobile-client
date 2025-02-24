import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useUserLog } from '../contexts/UserLogContext';
import { useWebSocket } from '../contexts/WebSocketContext';
import { getToken } from '../utils/authStorage';
import globalConstants from '../const/globalConstants';

const OpenStreetMapComponent = ({ serviceId }) => {

  const { userLog } = useUserLog();
  const socket = useWebSocket();
  const [joinedRoom, setJoinedRoom] = useState(false);
  const [walkerLocation, setWalkerLocation] = useState([]);
  const [currentService, setCurrentService] = useState({});
  const [htmlContent, setHtmlContent] = useState(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mapa con Leaflet y OpenStreetMap</title>
        <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
        <style>
            #map {
                height: 500px;
                width: 100%;
            }
        </style>
    </head>
    <body>
        <h1>Mapa con Leaflet y OpenStreetMap</h1>
        <div id="map"></div>
        
        <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
        <script>
            var map = L.map('map').setView([-34.9011, -56.1645], 13); // Coordenadas de Montevideo
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            
            var marker = L.marker([-34.9011, -56.1645]).addTo(map); // Marcador en Montevideo
            marker.bindPopup("<b>¡Hola Montevideo!</b>").openPopup();
        </script>
    </body>
    </html>
  `);

  // marcar la ubicación del paseador en el mapa cada vez que cambie
  useEffect(() => { 
    console.log('walkerLocation', walkerLocation);
    if (walkerLocation.length === 0) return;
    setHtmlContent(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mapa con Leaflet y OpenStreetMap</title>
        <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
        <style>
            #map {
                height: 500px;
                width: 100%;
            }
        </style>
    </head>
    <body>
        <h1>Mapa con Leaflet y OpenStreetMap</h1>
        <div id="map"></div>
        
        <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
        <script>
            var map = L.map('map').setView(${walkerLocation}, 13); // Coordenadas de ejemplo (Nueva York)
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            
            var marker = L.marker(${walkerLocation}).addTo(map); // Agrega un marcador en las coordenadas especificadas
            marker.bindPopup("<b>Paseador</b>").openPopup();
        </script>
    </body>
    </html>
    `)
  }, [walkerLocation]);

  //traigo los datos del servicio
  useEffect(() => {
    const fetchService = async () => {
      const token = await getToken();
      const response = await fetch(
        `${globalConstants.URL_BASE}/services/${serviceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error("Error al obtener el servicio");
      }
      const data = await response.json();
      setCurrentService(data.body);
    };

    if (serviceId) {
      fetchService();
    }
  }, [serviceId]);

  // Unir a la sala del paseador si hay un servicio activo
  const joinWalkerRoom = (service) => { 
    const roomName = `turn_service_${service.TurnId}`;
    
    if (!joinedRoom) {
      //no esta entrando a la sala
      setJoinedRoom(true);
      socket.emit('joinRoom', { roomName, userId: userLog.id });

      // Solicitar ubicación inicial del paseador
      socket.emit('requestLocation', { roomName });

      // Escuchar actualizaciones de ubicación
      socket.on('receiveLocation', (location) => {
        setWalkerLocation([location.lat, location.long]);
      });

      // Escuchar cuando se finalice el servicio
      socket.on('serviceFinished', () => {
        setWalkerLocation(null);
        setJoinedRoom(false); // Resetear el estado de la sala
        socket.emit('leaveRoom', { roomName , userId: userLog.id });
      });

      // Limpiar cuando el componente se desmonte o el servicio termine
      return () => {
        socket.off('receiveLocation');
        socket.off('serviceFinished');
        socket.emit('leaveRoom', { roomName, userId: userLog.id });
      };
    }
  };

  // Efecto para gestionar la unión a la sala del paseador y la ubicación inicial
  useEffect(() => {      
      if (currentService && currentService.TurnId) {
        joinWalkerRoom(currentService);
      }
  }, [currentService]);

  return (
    <View style={styles.container}>
      <WebView
        key={htmlContent}
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        style={styles.map}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default OpenStreetMapComponent;