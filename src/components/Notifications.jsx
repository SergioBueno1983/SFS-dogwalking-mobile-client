import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ScrollView, Touchable } from 'react-native';
import { Badge, IconButton, Portal } from 'react-native-paper';
import { useNotificationsContext } from '../contexts/NotificationsContext';
import { formatDistanceToNow } from 'date-fns';
import es from 'date-fns/locale/es';
import { useShowHeaderTools } from '../contexts/ShowHeaderToolsContext';

const Notifications = () => {
  const { notifications, markAsRead } = useNotificationsContext();
  const [unreadCount, setUnreadCount] = useState(0);
  const { setShowNotifications, showNotifications, showChats, setShowChats } = useShowHeaderTools();

  useEffect(() => {
    // Actualiza el conteo de notificaciones no leídas cada vez que cambian las notificaciones
    setUnreadCount(notifications.filter((notification) => !notification.leido).length);
  }, [notifications]);

  useEffect(() => {
  }, [showNotifications]);

  const toggleNotifications = async () => {


    if (showNotifications) {
      // Si la lista está abierta y se va a cerrar, marca todas las no leídas como leídas
      const unreadNotifications = notifications.filter((notification) => !notification.leido);
      await Promise.all(unreadNotifications.map((notification) => markAsRead(notification.id)));
    } else { // si se va a abrir
      if (showChats) {
        // Si la lista de chats está abierta la cierro
        setShowChats(false);
      }
    }
    setShowNotifications(!showNotifications);
  };

  const closeNotifications = async () => {
    const unreadNotifications = notifications.filter((notification) => !notification.leido);
    await Promise.all(unreadNotifications.map((notification) => markAsRead(notification.id)));
    setShowNotifications(false);
  };
  

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleNotifications}>
        <View>
          {unreadCount > 0 && <Badge style={styles.badge}>{unreadCount}</Badge>}
          <IconButton icon="bell" size={30} />
        </View>
      </TouchableOpacity>
      <Portal>
      {showNotifications && (
        <View style={styles.notificationsContainer}>
          {notifications.length === 0 ? (
            <Text style={styles.noNotifications}>No hay notificaciones disponibles</Text>
          ) : (
            <ScrollView 
            style={styles.scrollView} 
            contentContainerStyle={styles.scrollViewContent} 
            showsVerticalScrollIndicator={true} // Mostrar la barra de scroll
          >
            {notifications.map((notification) => (
              <TouchableOpacity onPress={closeNotifications} key={notification.id}>
                <View
                  key={notification.id}
                  style={[
                    styles.notificationItem,
                    notification.leido ? styles.readNotification : styles.unreadNotification,
                  ]}
                >
                <View>
                  <Text style={styles.notificationTitle}>{notification.titulo}</Text>
                  <Text style={styles.notificationContent}>{notification.contenido}</Text>
                  <Text style={styles.notificationTime}>{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: es })}</Text>
                </View>
              </View>
            </TouchableOpacity>
            ))}
          </ScrollView>
          )}
        </View>
      )}
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    backgroundColor: 'red',
    color: 'white',
  },
  flatListContainer: {
    flex: 1, // Permite que el FlatList ocupe espacio dentro del contenedor
  },
  notificationsContainer: {
    position: 'absolute',
    top: 120,
    right: 0,
    width: 300,
    maxHeight: 400,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 10,
    zIndex: 9999,
    
  },
  notificationItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  readNotification: {
    backgroundColor: '#f5f5f5',
  },
  unreadNotification: {
    backgroundColor: '#e0f7fa',
  },
  notificationTitle: {
    fontWeight: 'bold',
  },
  notificationContent: {
    color: '#555',
  },
  notificationTime: {
    color: '#888',
    fontSize: 12,
    marginTop: 5,
  },
  noNotifications: {
    textAlign: 'center',
    color: '#888',
  },
  markAsReadIcon: {
    marginLeft: 10,
  },
  scrollView: {
    flex: 1, // Asegura que ScrollView ocupe todo el espacio disponible
  },
  scrollViewContent: {
    flexGrow: 1, // Permite que ScrollView maneje correctamente el contenido
  },
});

export default Notifications;
