import React, { useState, useEffect } from 'react';
import { format,  getDay } from 'date-fns';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput, Button, HelperText } from 'react-native-paper';
import DateTimePicker from "@react-native-community/datetimepicker";
import { useServices } from '../../contexts/ServicesContext';
import { useUserLog } from '../../contexts/UserLogContext';
import globalConstants from '../../const/globalConstants';
import { getToken } from '../../utils/authStorage';
import { useRouter } from 'expo-router';


function AddServiceForm({ turnId }) {

  const [fecha, setFecha] = useState(new Date());
  const [direccionPickUp, setDireccionPickUp] = useState('');
  const [cantidadMascotas, setCantidadMascotas] = useState('');
  const [nota, setNota] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const { setServicesRequest } = useServices()
  const [turn, setTurn] = useState(null);
  const [turnDays, setTurnDays] = useState([]);
  const { userLog } = useUserLog();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const router = useRouter();

  useEffect(() => {
    //voy a buscar el turno
    try {
      const fetchTurn = async () => {
        const apiUrl = `${globalConstants.URL_BASE}/turns/${turnId}`;
        const token = await getToken();
        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (!data.ok) {
          throw new Error("No se pudo obtener el turno");
        }
        setTurn(data.body);
      };
      
      fetchTurn();
    }
    catch (error) {
      console.error('Error al buscar el turno:', error);
    }
  }, [turnId]);

  useEffect(() => {
    if (!turn) return;
    setTurnDays(turn.dias.map(day => {
      switch (day.toLowerCase()) {
        case 'lunes': return 1;
        case 'martes': return 2;
        case 'miercoles': return 3;
        case 'jueves': return 4;
        case 'viernes': return 5;
        case 'sabado': return 6;
        case 'domingo': return 0;
        default: return -1;
      }
    }));
  }, [turn]);

  
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false); // Cierra el DatePicker al seleccionar una fecha
    if (selectedDate) {
      setFecha(selectedDate); // Actualiza la fecha seleccionada
    }
  };

  const handleAddService = async () => {
    // Reiniciar mensajes de error
    setMensaje('');
    let valid = true;
    try {
      
      // Validar que direccion no tenga espacios al principio o al final
      if (!/^[^\s].*[^\s]$|^[^\s]$/.test(direccionPickUp)) {
        setMensaje('La zona no debe tener espacios al principio ni al final');
        valid = false; 
      }

      // validar que la direccion no sea vacia o "" (vacía)
      if (!direccionPickUp || direccionPickUp.trim() === '') {
        setMensaje('La direccion es obligatoria');
        valid = false; 
      }


      // Validar que la cantidad de mascotas sea positiva
      if (!cantidadMascotas || parseFloat(cantidadMascotas) <= 0) {
        setMensaje('La cantidad de mascotas debe ser un número positivo');
        valid = false; 
      }

      //validar que la nota no sea mayor a 255 caracteres
      if(nota.length > 255){
        setMensaje('La nota no puede tener mas de 255 caracteres');
        valid = false;
      }

      const selectedDay = getDay(fecha);
      const dayNames = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];


      // Validar que la fecha esté en un día permitido y no esté vacía
      if (!fecha) {
        setMensaje('La fecha no puede estar vacía');
        valid = false;
      } else if (selectedDay < 0 || selectedDay > 6) {
        setMensaje('Debe seleccionar un día válido');
        valid = false;
      } else if (!turnDays.includes(selectedDay)) {
        setMensaje(`El día seleccionado (${dayNames[selectedDay]}) no coincide con los días permitidos del turno (${turn.dias.join(', ')}).`);
        valid = false;
      }

      // Validar que la fecha no sea anterior a hoy
      const today = new Date();
      today.setHours(today.getHours() - 3);
      today.setHours(0, 0, 0, 0); // Establecer la hora a las 00:00 para comparar solo las fechas

      if (fecha < today) {
        setMensaje('La fecha no puede ser anterior a hoy');
        valid = false;
      }
      
      // si fecha seleccionada es la fecha de hoy
      if (fecha.getDate() === today.getDate()) {
        //comprobar que la hora actual, no sea mayor a la hora de fin que viene en formato string
        const horaFin = new Date();
        horaFin.setHours(parseInt(turn.hora_fin.split(':')[0]), parseInt(turn.hora_fin.split(':')[1]), 0, 0);
        if(horaFin < new Date()){
          setMensaje('No puede solicitar un servicio para hoy, porque ya se ha terminado el turno');
          valid = false;
        }
      }

      if (!valid) return; // Si hay errores, no continuar

      const serviceData = {
        fecha: format(fecha, 'yyyy-MM-dd'),
        direccionPickUp,
        cantidad_mascotas: parseInt(cantidadMascotas, 10),
        nota,
        TurnId: turnId, // ID del turno seleccionado
        ClientId: userLog.id // El ID del usuario logeado se utiliza como el ClientId del servicio
      };
      
      const token = await getToken();
      const response = await fetch(`${globalConstants.URL_BASE}/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(serviceData)
        
      });

      if (response.ok) {
        const responseData = await response.json();

        setServicesRequest((prevPendingServices) => [...prevPendingServices, responseData.data]);

        router.back();

      } else {
        console.error('Error al agregar el servicio:', response.statusText);
        setMensaje('Error al agregar el servicio');
      }
    } catch (error) {
      console.error('Error:', error);
      setMensaje('Error: ' + error.message);
    }
  };

    return (
        <View style={styles.container}>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Fecha</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text>{fecha ? fecha.toLocaleDateString() : 'Seleccionar fecha'}</Text>
            </TouchableOpacity>
          </View>
          
          {showDatePicker && <DateTimePicker
            mode="date"
            display="default"
            value={fecha}
            onChange={onDateChange}
          />}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Direccion</Text>
            <TextInput
              style={styles.input}
              value={direccionPickUp}
              onChangeText={setDireccionPickUp}
              placeholder="Ingrese una direccion"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Cantidad de Mascotas</Text>
            <TextInput
              style={styles.input}
              value={cantidadMascotas}
              onChangeText={setCantidadMascotas}
              placeholder="Ingrese la cantidad de mascotas"
              keyboardType="numeric"
            />
          </View>
    
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nota</Text>
            <TextInput
              style={styles.input}
              value={nota}
              onChangeText={setNota}
              placeholder="Ingrese una nota"
            />
          </View>
    
          <Text style={styles.infoText}>Total: ${turn?.tarifa * cantidadMascotas}</Text>
    
          <Button mode="contained" onPress={handleAddService} style={styles.button}>
            Agregar Servicio
          </Button>
    
          {mensaje ? <Text style={styles.message}>{mensaje}</Text> : null}
        </View>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        padding: 20,
      },
      datePicker: {
        width: '100%',
        marginBottom: 10,
      },
      infoText: {
        fontSize: 16,
        marginVertical: 5,
      },
      button: {
        marginTop: 20,
      },
      message: {
        marginTop: 10,
        color: 'red',
        textAlign: 'center',
      },
      inputContainer: {
        marginBottom: 15,
        width: "95%",
      },
      label: {
        fontSize: 18,
        marginBottom: 5,
        color: "#333",
        fontWeight: "bold",
      },
      input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 10,
        borderRadius: 5,
        fontSize: 16,
        backgroundColor: "#fff",
      },
      
    });
    

export default AddServiceForm;
