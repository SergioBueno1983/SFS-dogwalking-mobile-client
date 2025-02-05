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

const ChatComponent = ({ walkerId }) => {
  const socket = useWebSocket();
  const { userLog } = useUserLog();
  const { userWithUnreadMessage, setUserWithUnreadMessage, removeUnreadChat, usersWithChats, setUsersWithChat } = useChatsContext();
  const [messages, setMessages] = useState([]);
  const router = useRouter();
  const [walker, setWalker] = useState(null);

    // Función para emitir eventos de WebSocket
    const emitSocketEvent = (eventName, data) => {
      if (socket) socket.emit(eventName, data);
    };

  //useEffect para ver si el walkere tiene mensajes no leidos, para marcarlos como leidos
  useEffect(() => {
    const fetchWalker = async () => {
      try {
        const apiUrl = `${globalConstants.URL_BASE}/walkers/${walkerId}`;
        const token = await getToken();
        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setWalker(data.body);
      } catch (error) {
        console.error('Error al obtener el walker:', error);
      }
    };

    fetchWalker();
  }, [walkerId]);

  
  // en caso de tener mensajes sin leer, lo marco como leido, sacar al walkere de la lista
  useEffect(() => {
    if (walker && userWithUnreadMessage.has(walker.id)) {
      removeUnreadChat(walker.id);
    }
  }, [walker, userWithUnreadMessage]);

  // Cargar mensajes desde la API
  useEffect(() => {
    if (!userLog || !walker) return;

    const cargarMensajes = async () => {
      try {
        const token = await getToken();
        const response = await fetch(
          `${globalConstants.URL_BASE}/messages/${userLog.id}/${walker.id}`,
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
              name: msg.senderId === userLog.id ? 'Tú' : walker.User.nombre_usuario,
            },
            read: msg.read,
          }))
        );
      } catch (error) {
        console.error('Error al obtener los mensajes.', error);
      }
    };

    cargarMensajes();
  }, [walker, userLog]);

  // Manejar recepción de mensajes por WebSocket
  useEffect(() => {
    if (!socket || !walker || !userLog) return;

    const handleNewMessage = (newMessage) => {
      if (
        (newMessage.receiverId === userLog.id && newMessage.senderId === walker.id)
      ) {
        const formattedMessage = {
          _id: newMessage.id,
          text: newMessage.contenido,
          createdAt: new Date(),
          user: {
            _id: newMessage.senderId,
            name: newMessage.senderId === userLog.id ? 'Tú' : walker.nombre_usuario,
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
  }, [socket, walker, userLog]);

  // Enviar mensaje
  const onSend = useCallback(
    (messages = []) => {
      if (!userLog || !walker) return;

      const [newMessage] = messages;
      const messageToSend = {
        senderId: userLog.id,
        receiverId: walker.id,
        contenido: newMessage.text,
      };

      socket.emit('sendMessage', messageToSend);

      setMessages((prevMessages) => GiftedChat.append(prevMessages, messages));
    },
    [userLog, walker, socket]
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
          _id: userLog.id, // El usuario es el walkere
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
