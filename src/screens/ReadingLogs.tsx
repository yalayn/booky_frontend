import React, { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { getReadingSessionsHistory, deleteReadingSessions } from "../api/readingSessionService";
import { Colors } from "../styles/AppStyles";
import Icon from "react-native-vector-icons/FontAwesome";
import StandarModal from "../components/StandarModal";
import StylesModal from "../styles/StylesModal";
import { Swipeable } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ToastAndroid, Platform, Alert } from "react-native";

const ReadingLogs = ({ navigation }) => {
    const [logs, setLogs]       = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalEditLogVisible, setModalEditLogVisible]     = useState(false);
    const [modalDeleteLogVisible, setModalDeleteLogVisible] = useState(false);
    const [selectedLog, setSelectedLog]                     = useState(null);
    const [hoursEdit, setHoursEdit]     = useState('00');
    const [minutesEdit, setMinutesEdit] = useState('00');
    const [secondsEdit, setSecondsEdit] = useState('00');

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

    /**
     * Renderiza cada elemento de la lista de registros de lectura.
     * @param param0 
     * @returns 
     */
    const renderItem = ({ item }) => (
    <Swipeable renderRightActions={() => renderRightActions(item)}>
        <View key={item._id} style={styles.logItem}>
            <View style={styles.logItemDateContainer}>
                <Text style={styles.bookTitle}>{formatTime(item.seconds)}</Text>
                <Text style={styles.bookSubtitle}>{new Date(item.date).toLocaleDateString()}</Text>
            </View>
            <Text style={styles.logText}>{item.book_title}</Text>
        </View>
    </Swipeable>
    );

    /**
     * Renderiza las acciones de deslizamiento a la derecha para editar y eliminar.
     * @param item 
     * @returns 
     */
    const renderRightActions = (item) => (
        <View style={styles.swipeableActions}>
            <TouchableOpacity style={styles.swipeableButton} onPress={() => handleEdit(item)} >
                <Icon name="edit" size={22} color="#fff" />
                <Text style={{ color: '#fff', fontSize: 12 }}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.swipeableButton,{backgroundColor:Colors.red}]} onPress={() => handleDelete(item)} >
                <Icon name="trash" size={22} color="#fff" />
                <Text style={{ color: '#fff', fontSize: 12 }}>Eliminar</Text>
            </TouchableOpacity>
        </View>
    );

    /**
     * Maneja la edición de un registro de lectura.
     * @param item 
     */
    const handleEdit = (item) => {
        setHoursEdit('');
        setMinutesEdit('');
        setSecondsEdit('');
        setModalEditLogVisible(true);
        setSelectedLog(item);
    };

    /**
     * Maneja la eliminación de un registro de lectura.
     * @param item 
     */
    const handleDelete = (item) => {
        setSelectedLog(item);
        setModalDeleteLogVisible(true);
    };

    /**
     * Elimina un registro de lectura.
     * @param selectedLog 
     */
    const onDeleteBook = (selectedLog) => {
        if (!selectedLog) return;
        deleteReadingSessions(selectedLog._id)
        .then(response => {
            setLogs(prevLogs => prevLogs.filter(log => log?._id !== selectedLog?._id));
            if (Platform.OS === "android") {
                ToastAndroid.show("Registro eliminado con éxito", ToastAndroid.SHORT);
            } else {
                Alert.alert("Éxito", "Registro eliminado con éxito");
            }
            setSelectedLog(null);
            setModalDeleteLogVisible(false);
        })
        .catch(error => {
            console.error('Error al eliminar el registro:', error);
            if (Platform.OS === "android") {
                ToastAndroid.show("Error al eliminar el registro", ToastAndroid.SHORT);
            } else {
                Alert.alert("Error", "No se pudo eliminar el registro");
            }
        });
    };

    /**
     * Formatea el tiempo en segundos a un formato de horas, minutos y segundos.
     * @param seconds 
     * @returns 
     */
    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${h}:${m}:${s}`;
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
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
                    keyExtractor={(item, idx) => item._id?.toString() || idx.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 24 }}
                />

                {/* Modal de edicion */}
                <StandarModal onVisible={modalEditLogVisible} onClose={() => setModalEditLogVisible(false)} >
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
                                    value={hoursEdit}
                                    onChangeText={h => {
                                        setHoursEdit(h.replace(/[^0-9]/g, ''));
                                        if (!selectedLog) return;
                                        const hours = parseInt(h) || 0;
                                        const minutes = parseInt(minutesEdit) || 0;
                                        const seconds = parseInt(secondsEdit) || 0;
                                        setSelectedLog({ ...selectedLog, seconds: hours * 3600 + minutes * 60 + seconds });
                                    }}
                                    placeholder={selectedLog ? Math.floor(selectedLog.seconds / 3600).toString().padStart(2, '0') : '00'}
                                    placeholderTextColor={Colors.tertiary}
                                />
                                <TextInput
                                    style={[StylesModal.modalInput, { width: 60, textAlign: 'center', marginHorizontal: 2, fontSize: 24 }]}
                                    keyboardType="numeric"
                                    maxLength={2}
                                    value={minutesEdit}
                                    onChangeText={m => {
                                        setMinutesEdit(m.replace(/[^0-9]/g, ''));
                                        if (!selectedLog) return;
                                        const hours = parseInt(hoursEdit) || 0;
                                        const minutes = parseInt(m) || 0;
                                        const seconds = parseInt(secondsEdit) || 0;
                                        setSelectedLog({ ...selectedLog, seconds: hours * 3600 + minutes * 60 + seconds });
                                    }}
                                    placeholder={selectedLog ? Math.floor((selectedLog.seconds % 3600) / 60).toString().padStart(2, '0') : '00'}
                                    placeholderTextColor={Colors.tertiary}
                                />
                                <TextInput
                                    style={[StylesModal.modalInput, { width: 60, textAlign: 'center', marginHorizontal: 2, fontSize: 24 }]}
                                    keyboardType="numeric"
                                    maxLength={2}
                                    value={secondsEdit}
                                    onChangeText={s => {
                                        setSecondsEdit(s.replace(/[^0-9]/g, ''));
                                        if (!selectedLog) return;
                                        const hours = parseInt(hoursEdit) || 0;
                                        const minutes = parseInt(minutesEdit) || 0;
                                        const seconds = parseInt(s) || 0;
                                        setSelectedLog({ ...selectedLog, seconds: hours * 3600 + minutes * 60 + seconds });
                                    }}
                                    placeholder={selectedLog ? (selectedLog.seconds % 60).toString().padStart(2, '0') : '00'}
                                    placeholderTextColor={Colors.tertiary}
                                />
                            </View>
                        </View>
                        <View style={StylesModal.modalButtonContainer}>
                            <TouchableOpacity style={StylesModal.modalButton} onPress={() => console.log('Editar registro')}>
                                <Text style={StylesModal.modalOptionText}>Guardar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </StandarModal>

                {/* Modal de eliminacion */}
                <StandarModal onVisible={modalDeleteLogVisible} onClose={() => setModalDeleteLogVisible(false)} >
                    <View style={{ padding: 20, alignItems: 'center' }}>
                        <Text style={StylesModal.modalTitle}>Confirmar accion.</Text>
                        <Text style={StylesModal.modalMessage}>¿Estás seguro de que deseas eliminar este registro?</Text>
                        <Text style={StylesModal.modalMessage}>Esta acción no se puede deshacer.</Text>
                        <View style={StylesModal.modalButtonContainer}>
                            <TouchableOpacity style={[StylesModal.modalButton, StylesModal.modalCancelButton]} onPress={() => setModalDeleteLogVisible(false)} >
                                <Text style={StylesModal.modalButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[StylesModal.modalButton, StylesModal.modalConfirmButton]} onPress={() => { setModalDeleteLogVisible(false); onDeleteBook(selectedLog); }} >
                                <Text style={StylesModal.modalButtonText}>Eliminar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </StandarModal>
            </View>
        </GestureHandlerRootView>
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
    logItemDateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
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
    swipeableActions: {
        flexDirection: 'row',
        padding: 0,
        marginBottom: 12,
    },
    swipeableButton: {
        backgroundColor: Colors.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        width: 64,
        height: '100%',
        borderRadius: 8,
        flexDirection: 'column',
        marginLeft: 4,
    },
});

export default ReadingLogs;