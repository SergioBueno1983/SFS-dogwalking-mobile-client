import React, { useState, useEffect, useRef, useCallback } from 'react';
import {View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { GiftedChat, InputToolbar, Send, Bubble } from 'react-native-gifted-chat';
import { useWebSocket } from '../contexts/WebSocketContext';
import { useUserLog } from '../contexts/UserLogContext';
import { useChatsContext } from '../contexts/ChatContext';
import { useRouter } from 'expo-router';
import { getToken } from '../utils/authStorage';
import globalConstants from '../const/globalConstants';
import { ActivityIndicator } from 'react-native-paper';

const ChatComponent = ({ clientId }) => {
  const socket = useWebSocket();
  const { userLog } = useUserLog();
  const { userWithUnreadMessage, setUserWithUnreadMessage, removeUnreadChat, usersWithChats, setUsersWithChat } = useChatsContext();
  const [messages, setMessages] = useState([]);
  const router = useRouter();
  const [client, setClient] = useState(null);

    // Función para emitir eventos de WebSocket
    const emitSocketEvent = (eventName, data) => {
      if (socket) socket.emit(eventName, data);
    };

  //useEffect para ver si el cliente tiene mensajes no leidos, para marcarlos como leidos
  useEffect(() => {
    const fetchClient = async () => {
      try {
        const apiUrl = `${globalConstants.URL_BASE}/clients/body/${clientId}`;
        const token = await getToken();
        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setClient(data.body);
      } catch (error) {
        console.error('Error al obtener el cliente:', error);
      }
    };

    fetchClient();
  }, [clientId]);

  /* useEffect(() => {
    if (!socket || !userLog || !client) return;

    emitSocketEvent('getUnreadMessages', { receiverId: userLog.id, senderId: client.id });

    socket.on('unreadMessages', (unreadMessages) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        ...unreadMessages.filter((msg) => !prevMessages.some((m) => m.id === msg.id)),
      ]);
      unreadMessages.forEach((msg) => emitSocketEvent('messageRead', { messageId: msg.id }));


      if (userWithUnreadMessage.length > 0 && userWithUnreadMessage.has(client.id)) {
      // actualizo el estado unreadChats para quitar el chat con id = msg.senderId
      setUserWithUnreadMessage((prevUnreadChats) => prevUnreadChats.filter((c) => c.id !== receiver.id));}
      
    });

    return () => socket.off('unreadMessages');
  }, [socket, client, userLog, userWithUnreadMessage]); */
  

  // en caso de tener mensajes sin leer, lo marco como leido, sacar al cliente de la lista
  useEffect(() => {
    if (client && userWithUnreadMessage.has(client.id)) {
      removeUnreadChat(client.id);
    }
  }, [client, userWithUnreadMessage]);

  // Cargar mensajes desde la API
  useEffect(() => {
    if (!userLog || !client) return;

    const cargarMensajes = async () => {
      try {
        const token = await getToken();
        const response = await fetch(
          `${globalConstants.URL_BASE}/messages/${userLog.id}/${client.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        if (!response.ok) throw new Error('Error del servidor');

        // Ordenar los mensajes por createdAt de mayor a menor
        const mensajesOrdenados = data.body.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));


        setMessages(
          mensajesOrdenados.map((msg) => ({
            _id: msg.id,
            text: msg.contenido,
            createdAt: new Date(msg.createdAt),
            user: {
              _id: msg.senderId,
              name: msg.senderId === userLog.id ? 'Tú' : client.User.nombre_usuario,
            },
            read: msg.read,
          }))
        );
      } catch (error) {
        console.error('Error al obtener los mensajes.', error);
      }
    };

    cargarMensajes();
  }, [client, userLog]);

  // Manejar recepción de mensajes por WebSocket
  useEffect(() => {
    if (!socket || !client || !userLog) return;

    const handleNewMessage = (newMessage) => {
      if (
        (newMessage.receiverId === userLog.id && newMessage.senderId === client.id)
      ) {
        const formattedMessage = {
          _id: newMessage.id,
          text: newMessage.contenido,
          createdAt: new Date(),
          user: {
            _id: newMessage.senderId,
            name: newMessage.senderId === userLog.id ? 'Tú' : client.nombre_usuario,
          },
          read: newMessage.leido,
        };
        setMessages((prevMessages) => GiftedChat.append(prevMessages, [formattedMessage]));
      }
    };

    socket.on('receiveMessage', handleNewMessage);

    return () => {
      socket.off('receiveMessage', handleNewMessage);
    };
  }, [socket, client, userLog]);

  // Enviar mensaje
  const onSend = useCallback(
    (messages = []) => {
      if (!userLog || !client) return;

      const [newMessage] = messages;
      const messageToSend = {
        senderId: userLog.id,
        receiverId: client.id,
        contenido: newMessage.text,
      };

      socket.emit('sendMessage', messageToSend);

      setMessages((prevMessages) => GiftedChat.append(prevMessages, messages));
    },
    [userLog, client, socket]
  );

  useEffect(() => {
    if (messages.length > 0) {
      messages.map((message) => {
        if (message.user._id !== userLog.id && !message.read) {
          socket.emit('messageRead', { messageId: message._id });
        }
      });
    }
  }, [messages]);

  if (messages.length === 0) {
    return <ActivityIndicator />;
  }

  return (
    <>
    <KeyboardAvoidingView
      style={[styles.container]} // Ajustar el paddingTop
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: userLog.id, // El usuario es el cliente
          name: 'Tú',
        }}
        
        placeholder="Escribe tu mensaje..."
        alwaysShowSend
        renderSend={(props) => (
          <Send {...props}>
            <View style={styles.sendButton}>
              <Text style={styles.sendText}>Enviar</Text>
            </View>
          </Send>
        )}
        renderBubble={(props) => (
          <Bubble
            {...props}
            wrapperStyle={{
              right: { backgroundColor: '#0078fe' },
              left: { backgroundColor: '#e5e5e5' },
            }}
          />
        )}
        renderInputToolbar={(props) => (
          <InputToolbar
            {...props}
            containerStyle={{
              borderTopWidth: 1,
              borderTopColor: '#e5e5e5',
              paddingHorizontal: 10,
            }}
          />
        )}
      />
    </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  sendButton: {
    marginRight: 10,
    marginBottom: 5,
    backgroundColor: '#0078fe',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  sendText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ChatComponent;
