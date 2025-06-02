import React, { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { getReadingSessionsHistory } from "../api/readingSessionService";
import { Colors } from "../styles/AppStyles";
import Icon from "react-native-vector-icons/FontAwesome";
import StandarModal from "../components/StandarModal";
import StylesModal from "../styles/StylesModal";
// import Swipeable from 'react-native-gesture-handler';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';

const ReadingLogs = ({ navigation }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        // Puedes usar tu endpoint real para historial de sesiones
        const response = await getReadingSessionsHistory();
        console.log("Registros de lectura obtenidos:", response.data);
        setLogs(response?.data || []);
      } catch (error) {
        console.error("Error al obtener registros de lectura:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleEdit(item)} >
        <View style={styles.logItem}>
            <View style={[styles.actionButton, { marginRight: 8, position: 'absolute', top: 5, right: 0 }]}>
                <Icon name="edit" size={20} color={Colors.white} />
            </View>
            <Text style={styles.bookTitle}>{formatTime(item.seconds)}</Text>
            <Text style={styles.bookSubtitle}>{new Date(item.date).toLocaleDateString()}</Text>
            <Text style={styles.logText}>{item.book_title}</Text>
        </View>
    </TouchableOpacity>
  );

// const renderItem = ({ item }) => (
//   <Swipeable renderRightActions={() => renderRightActions(item)}>
//     <View style={styles.logItem}>
//       <Text style={styles.bookTitle}>{formatTime(item.seconds)}</Text>
//       <Text style={styles.bookSubtitle}>{new Date(item.date).toLocaleDateString()}</Text>
//       <Text style={styles.logText}>{item.book_title}</Text>
//     </View>
//   </Swipeable>
// );

const renderRightActions = (item) => (
  <TouchableOpacity
    style={{
      backgroundColor: Colors.secondary,
      justifyContent: 'center',
      alignItems: 'center',
      width: 64,
      height: '100%',
      borderRadius: 8,
      marginVertical: 6,
    }}
    onPress={() => handleEdit(item)}
  >
    <Icon name="edit" size={22} color="#fff" />
    <Text style={{ color: '#fff', fontSize: 12 }}>Editar</Text>
  </TouchableOpacity>
);

  // Agrega las funciones (puedes personalizarlas):
  const handleEdit = (item) => {
    console.log('Editar registro:', item);
    setModalVisible(true);
    setSelectedLog(item);
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    // <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.container}>
            {/* Botón para regresar */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Icon name="close" size={20} color={Colors.white} />
            </TouchableOpacity>
            {/* Aquí puedes agregar más detalles del libro si es necesario */}
            <View style={styles.header}>
                <Text style={styles.title}>Historial de Lecturas</Text>
                <View style={styles.bookSetionMain}>
                    <View style={styles.bookSetionMainContainer}>
                        <Text style={styles.subtitles}>Registros de Lectura</Text>
                        <Text style={styles.italics}>Tiempos de lectura registrados:</Text>
                    </View>
                </View>
            </View>
            { loading && (
                <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />
            )}
            {logs.length === 0 && !loading &&
                <Text style={styles.emptyText}>No hay registros de lectura.</Text>
            }

            {/* Lista de registros de lectura */}
            <FlatList
                data={logs}
                keyExtractor={(item, idx) => item.id?.toString() || idx.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 24 }}
            />
            <StandarModal
                onVisible={modalVisible} // Cambia esto según tu lógica de visibilidad
                onClose={() => setModalVisible(false)}
            >
                <View style={{marginTop: 40, alignItems: 'center'}}>
                <Text style={StylesModal.modalTitle}>{selectedLog?.book_title}</Text>
                <Text style={StylesModal.modalSubtitle}>{new Date(selectedLog?.date).toLocaleDateString()}</Text>
                {/* <Text style={StylesModal.modalTitleXL}>{formatTime(selectedLog?.seconds)}</Text> */}
                <View style={{ width: '100%', alignItems: 'center', marginVertical: 16 }}>
                    
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                        <TextInput
                            style={[StylesModal.modalInput, { width: 60, textAlign: 'center', marginHorizontal: 2, fontSize: 24 }]}
                            keyboardType="numeric"
                            maxLength={2}
                            value=""
                            placeholder={selectedLog ? Math.floor(selectedLog.seconds / 3600).toString().padStart(2, '0') : ''}
                            placeholderTextColor={Colors.tertiary}
                        />
                        <TextInput
                            style={[StylesModal.modalInput, { width: 60, textAlign: 'center', marginHorizontal: 2, fontSize: 24 }]}
                            keyboardType="numeric"
                            maxLength={2}
                            value=""
                            onChangeText={m => {
                                if (!selectedLog) return;
                                const hours = Math.floor(selectedLog.seconds / 3600);
                                const minutes = parseInt(m) || 0;
                                const seconds = selectedLog.seconds % 60;
                                setSelectedLog({ ...selectedLog, seconds: hours * 3600 + minutes * 60 + seconds });
                            }}
                            placeholder={selectedLog ? Math.floor((selectedLog.seconds % 3600) / 60).toString().padStart(2, '0') : ''}
                            placeholderTextColor={Colors.tertiary}
                        />
                        <TextInput
                            style={[StylesModal.modalInput, { width: 60, textAlign: 'center', marginHorizontal: 2, fontSize: 24 }]}
                            keyboardType="numeric"
                            maxLength={2}
                            value=""
                            onChangeText={s => {
                                if (!selectedLog) return;
                                const hours = Math.floor(selectedLog.seconds / 3600);
                                const minutes = Math.floor((selectedLog.seconds % 3600) / 60);
                                const seconds = parseInt(s) || 0;
                                setSelectedLog({ ...selectedLog, seconds: hours * 3600 + minutes * 60 + seconds });
                            }}
                            placeholder={selectedLog ? (selectedLog.seconds % 60).toString().padStart(2, '0') : ''}
                            placeholderTextColor={Colors.tertiary}
                        />
                    </View>
                </View>
                <View style={StylesModal.modalButtonContainer}>
                <TouchableOpacity style={StylesModal.modalButton} onPress={() => console.log('Editar registro')}>
                    <Text style={StylesModal.modalOptionText}>Guardar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[StylesModal.modalButton,{backgroundColor:Colors.red}]} onPress={() => console.log('Editar registro')}>
                    <Text style={StylesModal.modalOptionText}>Eliminar</Text>
                </TouchableOpacity>
                </View>
            </View>
            </StandarModal>
        </View>
    // </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.darker,
    paddingBottom: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors.white,
  },
  header: {
    marginTop: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  bookSetionMain: {
    marginBottom: 16,
    backgroundColor: Colors.darker,
    borderRadius: 12,
    padding: 16,
  },
  bookSetionMainContainer: {
    alignItems: 'center',
  },
  bookDetailsContainer: {
    flex: 1,
    textAlign: 'center',
  },
  bookDetail: {
    fontSize: 14,
    marginBottom: 8,
    color: Colors.white,
  },
  bookReview: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
    color: Colors.white,
  },
  subtitles: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.white,
  },
  italics: {
    fontSize: 16,
    marginBottom: 8,
    fontStyle: 'italic',
    color: Colors.white,
  },
  bottonStateLabelContainer: {
    marginVertical: 8,
    alignSelf: 'center',
    backgroundColor: Colors.secondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  bottoonStateLabel: {
    color: Colors.lighter,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  stateLabelContainer: {
    marginVertical: 2,
    alignSelf: 'center',
    backgroundColor: Colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  stateLabel: {
    color: Colors.lighter,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
  },
  descriptionLong: {
    marginTop: 8,
    fontSize: 16,
    marginBottom: 8,
    maxHeight: 100,
    overflow: 'hidden',
  },
  bgToReadLabel:{
    backgroundColor: Colors.state_toread,
  },
  bgReadLabel:{
    backgroundColor: Colors.state_read,
  },
  bgReadingLabel:{
    backgroundColor: Colors.state_reading,
  },
  iconEditReview: {
    position: 'absolute',
    top: 8,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookCoverContainer: {
      alignContent: 'center',
      justifyContent: 'center',
      alignItems: 'center',
  },
  bookCover: {
      width: 100,
      height: 150,
      borderRadius: 12,
      borderColor: '#ccc',
      shadowColor: '#000',
      backgroundColor: '#e0e0e0',
      marginBottom: 20,
  },
  bookTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 4,
      color: Colors.white,
      textAlign: 'left',
  },
  bookSubtitle: {
      fontSize: 14,
      marginBottom: 1,
      color: Colors.white,
      textAlign: 'left',
  },
  bookDescription: {
      fontSize: 13,
      marginBottom: 8,
      color: Colors.white,
      textAlign: 'center',
  },
  deleteButton: {
      marginVertical: 8,
      alignSelf: 'center',
      backgroundColor: Colors.red,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      alignItems: 'center',
  },
  deleteButtonText: {
      color: Colors.lighter,
      fontSize: 12,
      fontWeight: 'bold',
  },
  backButton: {
    flexDirection: 'row',
    marginBottom: 4,
    marginTop: 50,
    marginEnd: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: Colors.white,
    fontSize: 16,
    marginLeft: 8,
  },
  logItem: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  logText: {
    color: Colors.white,
    fontSize: 14,
    marginTop: 6,
    fontWeight: '500',
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    marginTop: 40,
    fontSize: 16,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ReadingLogs;