import React, { useState, useEffect, use } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ScrollView } from 'react-native';
import { Badge, IconButton, Portal } from 'react-native-paper';
import { useChatsContext } from '../contexts/ChatContext';
import { formatDistanceToNow } from 'date-fns';
import es from 'date-fns/locale/es';
import { useRouter } from 'expo-router';
import { useShowHeaderTools } from '../contexts/ShowHeaderToolsContext';

const ChatList = () => {
  const { usersWithChat, userWithUnreadMessage, unreadChatsCount } = useChatsContext();
  const router = useRouter();
  const { setShowChats, showChats, showNotifications, setShowNotifications } = useShowHeaderTools();

  useEffect(() => {
    // Redibujo el componente cuando cambia alguno de los estados
  }, [usersWithChat, userWithUnreadMessage, unreadChatsCount, showChats]);
  
  const handleClick = (chatId) => {
    setShowChats(false);

    // busco en chats el chat con el id que me pasa
    const userChat = usersWithChat.find((userChat) =>  userChat.id.toString() === chatId.toString());
    
    // Verificar si se encontró el chat
    if (userChat) {
      router.push(`/chat/${userChat.id}`);
    }
  };
  

  const toggleVisible = async () => {
    if (showNotifications) {
      // Si la lista de notificaciones está abierta la cierro
      setShowNotifications(false);
    }
    setShowChats(!showChats);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleVisible}>
        <View>
          {unreadChatsCount > 0 && <Badge style={styles.badge}>{unreadChatsCount}</Badge>}
          <IconButton icon="chat" size={30} />
        </View>
      </TouchableOpacity>
      <Portal>
      {showChats && (
        <View style={styles.chatsContainer}>
          {usersWithChat.length === 0 ? (
            <Text style={styles.noChats}>No hay chats disponibles</Text>
          ) : (
            <ScrollView 
            style={styles.scrollView} 
            contentContainerStyle={styles.scrollViewContent} 
            showsVerticalScrollIndicator={true} // Mostrar la barra de scroll
          >
            {usersWithChat.map((chat) => (
              <TouchableOpacity
              key={chat.id}
              style={[
                styles.chatItem,
                chat.lastMessageReceived?.read ? styles.readChat : styles.unreadChat,
              ]}
              onPress={() => handleClick(chat.id)}
            >
              <View>
                <Text style={styles.chatTitle}>{chat.User.nombre_usuario}</Text>
                <Text style={styles.chatTime}>
                  {chat.lastMessage 
                    ? formatDistanceToNow(new Date(chat.lastMessage.createdAt), { addSuffix: true, locale: es }) 
                    : "No hay mensajes"}
                </Text>

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
  chatsContainer: {
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
  chatItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  readChat: {
    backgroundColor: '#f5f5f5',
  },
  unreadChat: {
    backgroundColor: '#e0f7fa',
  },
  chatTitle: {
    fontWeight: 'bold',
  },
  chatContent: {
    color: '#555',
  },
  chatTime: {
    color: '#888',
    fontSize: 12,
    marginTop: 5,
  },
  noChats: {
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

export default ChatList;
