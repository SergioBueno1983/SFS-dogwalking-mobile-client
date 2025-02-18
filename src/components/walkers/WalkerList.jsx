import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import WalkerCard from '../cards/WalkerCard'; 
import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';
import { getToken } from "../../utils/authStorage";
import globalConstants from '../../const/globalConstants';
import barriosData from '../../assets/barrios.json';
import { AntDesign } from "@expo/vector-icons";

function WalkersList() {
  const [walkers, setWalkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    calificacion: 0,
    zona: '',
    tarifa: ''
  });
  const [maxDistance, setMaxDistance] = useState('');
  const [clientLocation, setClientLocation] = useState(null);
  const [zones, setZones] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchWalkers = async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${globalConstants.URL_BASE}/walkers`, { 
          headers: {
             Authorization: `Bearer ${token}` 
            }
        });
        if (!response.ok) throw new Error('Error en la respuesta de la red');
        const data = await response.json();
        //filtro walkers sin turno
        const filteredWalkers = data.body.filter(walker => walker.Turns.length > 0);
        setWalkers(filteredWalkers);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchWalkers();
  }, []);

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log("Permiso de ubicación denegado");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setClientLocation({
        lat: location.coords.latitude,
        lon: location.coords.longitude,
      });
    };
    getLocation();
  }, []);

  useEffect(() => {
    const loadZones = () => {
      try {
        const zonesData = barriosData.barrios.reduce((acc, barrio) => {
          acc[barrio.nombre] = { id: barrio.id_barrio };
          return acc;
        }, {});
        setZones(zonesData);
      } catch (error) {
        console.error("Error cargando barrios.json:", error);
      }
    };
    loadZones();
  }, []);

  const filteredWalkers = walkers.filter((walker) => {
    const calificacionMatch = filters.calificacion ? walker.User.calificacion >= filters.calificacion : true;
    const zonaMatch = filters.zona ? walker.Turns.some(turn => turn.zona.toLowerCase().includes(filters.zona.toLowerCase())) : true;
    const tarifaMatch = filters.tarifa ? walker.Turns.some(turn => parseFloat(turn.tarifa) <= parseFloat(filters.tarifa)) : true;
    return calificacionMatch && zonaMatch && tarifaMatch;
  });

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text style={styles.errorText}>Error: {error}</Text>;

  return (
      <View style={styles.container}>        
        {/* Botón para abrir el modal de filtros */}
        <Pressable  onPress={() => setModalVisible(true)}>
            <AntDesign name="filter" size={24} color="black" />
        </Pressable>

        {/* Modal con los filtros */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>

              <Text style={styles.modalTitle}>Filtrar Walkers</Text>

              {/* Filtro por calificación */}
              <Picker
                selectedValue={filters.calificacion}
                onValueChange={(itemValue) => setFilters(prev => ({ ...prev, calificacion: itemValue }))}
                style={styles.picker}
              >
                <Picker.Item label="Sin filtrar" value={0} />
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Picker.Item key={rating} label={`⭐️ ${rating}`} value={rating} />
                ))}
              </Picker>

              {/* Filtro por tarifa */}
              <TextInput
                style={styles.input}
                placeholder="Tarifa máxima"
                keyboardType="numeric"
                value={filters.tarifa}
                onChangeText={(text) => setFilters(prev => ({ ...prev, tarifa: text }))}
              />

              {/* Filtro por zona (Picker con barrios) */}
              <Picker
                selectedValue={filters.zona}
                onValueChange={(itemValue) => setFilters(prev => ({ ...prev, zona: itemValue }))}
                style={styles.picker}
              >
                <Picker.Item label="Selecciona una zona" value="" />
                {Object.keys(zones).map((zona) => (
                  <Picker.Item key={zona} label={zona} value={zona} />
                ))}
              </Picker>

              {/* Botones de aplicar y limpiar */}
              <View style={styles.modalButtons}>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.applyButton}>
                  <Text style={styles.buttonText}>Aplicar</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                  setFilters({ calificacion: 0, zona: '', tarifa: '' });
                  setMaxDistance('');
                }} style={styles.clearButton}>
                  <Text style={styles.buttonText}>Limpiar</Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </Modal>

        {/* Lista de Walkers */}
        <FlatList
          data={filteredWalkers}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={({ item }) => <WalkerCard walker={item} />}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
     flex: 1,
     padding: 10,
     backgroundColor: '#fff'},

  filterButton: { 
    backgroundColor: '#007BFF', 
    padding: 10, borderRadius: 5, 
    alignItems: 'left', 
    marginBottom: 10 },

  filterButtonText: { 
    color: '#fff', 
    fontWeight: 'bold' },

  modalContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.5)' },

  modalContent: { 
    width: '80%', 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 10 },

  modalTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 10 },

  picker: { 
    height: 50, 
    width: '100%', 
    backgroundColor: '#ddd', 
    marginBottom: 10 },

  input: { 
    backgroundColor: '#ddd', 
    padding: 10, 
    borderRadius: 5, 
    marginBottom: 10 },

  modalButtons: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 10 },

  applyButton: { 
    backgroundColor: 'green', 
    padding: 10, 
    borderRadius: 5 },

  clearButton: { 
    backgroundColor: 'red', 
    padding: 10, borderRadius: 5 },

  buttonText: { color: '#fff', 
    fontWeight: 'bold' },

  errorText: { color: 'red', 
    textAlign: 'center', 
    marginTop: 20 },
});

export default WalkersList;
