import React, { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, ToastAndroid, Platform, Alert } from "react-native";
import Toast from 'react-native-toast-message';
import { getReadingSessionsHistory, registerReadingSessions, updateReadingSessions, deleteReadingSessions  } from "../api/readingSessionService";
import { getBooks } from "../api/bookService";
import { Colors } from "../styles/AppStyles";
import { Swipeable } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import StandarModal from "../components/StandarModal";
import StylesModal from "../styles/StylesModal";
import Icon from "react-native-vector-icons/FontAwesome";
import Loading from "../components/Loading";

const ReadingLogs = ({ navigation }) => {
    const [logs, setLogs]               = useState([]);
    const [loading, setLoading]         = useState(true);
    const [selectedLog, setSelectedLog] = useState(null);
    
    const [modalAddLogVisible, setModalAddLogVisible] = useState(false);
    const [addDate, setAddDate]           = useState(new Date().toISOString().split('T')[0]); // Formato YYYY-MM-DD
    const [addHours, setAddHours]         = useState('');
    const [addMinutes, setAddMinutes]     = useState('');
    const [addSeconds, setAddSeconds]     = useState('');
    const [addBookId, setAddBookId]       = useState(null);
    const [addBookTitle, setAddBookTitle] = useState('');
    
    const [modalEditLogVisible, setModalEditLogVisible] = useState(false);
    const [editHours, setEditHours]     = useState('00');
    const [editMinutes, setEditMinutes] = useState('00');
    const [editSeconds, setEditSeconds] = useState('00');
    
    const [modalDeleteLogVisible, setModalDeleteLogVisible] = useState(false);
    
    useEffect(() => {
        const fetchLogs = async () => {
        try {
            // Puedes usar tu endpoint real para historial de sesiones
            const response = await getReadingSessionsHistory();
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

    const handleAdd = () => {
        setAddDate(new Date().toISOString().split('T')[0]); // Resetea la fecha al día actual
        setModalAddLogVisible(true);
    };

    /**
     * Maneja la edición de un registro de lectura.
     * @param item 
     */
    const handleEdit = (item) => {
        setEditHours('');
        setEditMinutes('');
        setEditSeconds('');
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

    const onAddBookLog = async () => {
        const SECOND_TODAY = 86400; // 24 horas en segundos
        let message = "";
        const second = (parseInt(addHours) || 0) * 3600 + (parseInt(addMinutes) || 0) * 60 + (parseInt(addSeconds) || 0);
        
        if (addBookId === null || addBookId === undefined) {
            message = "Por favor, selecciona un libro.";
        }
        
        if (!addDate) {
            message = "Por favor, verifique la fecha.";
        }

        if (second === 0) {
            message = "Por favor, ingrese un tiempo de lectura válido.";
        }

        if (second > SECOND_TODAY) {
            message = "Las horas no pueden exceder el dia (24 horas)";
        }

        if (message !== "") {
            if (Platform.OS === "android") {
                ToastAndroid.show(message, ToastAndroid.SHORT);
            } else {
                Alert.alert("Advertencia", message);
            }
            return;
        }
        const newLog = { date: addDate, book_id: addBookId, seconds: second };
        try{
            setLoading(true);
            const response = await registerReadingSessions(newLog);
            if (!response.success) {
                Toast.show({ type: 'error', text1: 'Error', text2: 'No se pudo agregar el registro', });
                console.error('Error al agregar el registro:', response.message);
                return;
            }
            const newLogData = response.data;
            setLogs(prevLogs => [...prevLogs, { ...newLog, _id: newLogData._id, book_title: newLogData.book_title }]);
            console.log('Registro agregado:', newLogData);
            console.log('nuevo logs:', logs);
            Toast.show({ type: 'success', text1: 'Éxito', text2: 'Registro agregado correctamente.', });
            setModalAddLogVisible(false);
            setAddDate(new Date().toISOString().split('T')[0]);
            setAddHours('');
            setAddMinutes('');
            setAddSeconds('');
            setAddBookId(null);
            setAddBookTitle('');

        } catch (error) {
            Toast.show({ type: 'error', text1: 'Error', text2: 'No se pudo crear el registro', });
            return;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Actualiza un registro de lectura.
     * @returns 
     */
    const onEditBook = async () => {

        const SECOND_TODAY = 86400; // 24 horas en segundos

        if (!selectedLog) return;

        let message = "";
        if(!editHours && !editMinutes && !editSeconds) {
            message = "No se encontraron cambios para actualizar";
        }

        if( (selectedLog?._id === undefined || selectedLog?._id === null) && 
            (selectedLog?.date === undefined || selectedLog?.date === null)
        ) {
             message = "No se puede actualizar el registro";
        }

        const second = (parseInt(editHours) || 0) * 3600 + (parseInt(editMinutes) || 0) * 60 + (parseInt(editSeconds) || 0);
        
        if (second > SECOND_TODAY) {
            message = "Las horas no pueden exceder el dia (24 horas)";
        }
        
        if (message !== "") {
            if( Platform.OS === "android") {
                ToastAndroid.show(message, ToastAndroid.SHORT);
            } else {
                Alert.alert("Advertencia", message);
            }
            return;
        }

        const updatedLog = {
            id        : selectedLog?._id,
            date      : selectedLog?.date,
            book_id   : selectedLog?.book_id,
            seconds   : second
        };
        setLoading(true);
        try {
            const response = await updateReadingSessions(updatedLog);
            if (!response.success) {
                Toast.show({ type: 'error', text1: 'Error', text2: 'No se pudo actualizar el registro', });
                setSelectedLog(null);
                setLoading(false);
                return;
            }
            selectedLog['seconds'] = second;
            setLogs(prevLogs => prevLogs.map(log => log._id === selectedLog._id ? selectedLog : log));
            Toast.show({ type: 'success', text1: 'Éxito', text2: 'Registro actualizado correctamente.', });
            setSelectedLog(null);
            setModalEditLogVisible(false);
        } catch (error) {
            console.error('Error al actualizar el registro:', error);
            Toast.show({ type: 'error', text1: 'Error', text2: 'No se pudo actualizar el registro', });
        } finally {
            setLoading(false);
        }
    };

    /**
     * Elimina un registro de lectura.
     * @param selectedLog 
     */
    const onDeleteBook = async (selectedLog) => {
        if (!selectedLog) return;
        setSelectedLog(null);
        setModalDeleteLogVisible(false);
        setLoading(true);
        try{
            console.log("onDeleteBook - Response:", selectedLog._id);
            const response = await deleteReadingSessions(selectedLog._id);
            if (!response.success) {
                Toast.show({ type: 'error', text1: 'Error', text2: 'No se pudo eliminar el registro', });
                setLoading(false);
                return;
            }
            setLogs(prevLogs => prevLogs.filter(log => log?._id !== selectedLog?._id));
            Toast.show({ type: 'success', text1: 'Éxito', text2: 'Registro eliminado correctamente.', });
        } catch (error) {
            console.error('Error al eliminar el registro:', error);
            Toast.show({ type: 'error', text1: 'Error', text2: 'No se pudo eliminar el registro', });
        } finally {
            setLoading(false);
        }

        // deleteReadingSessions(selectedLog._id)
        // .then(response => {
        //     setLogs(prevLogs => prevLogs.filter(log => log?._id !== selectedLog?._id));
        //     if (Platform.OS === "android") {
        //         ToastAndroid.show("Registro eliminado con éxito", ToastAndroid.SHORT);
        //     } else {
        //         Alert.alert("Éxito", "Registro eliminado con éxito");
        //     }
        // })
        // .catch(error => {
        //     console.error('Error al eliminar el registro:', error);
        //     if (Platform.OS === "android") {
        //         ToastAndroid.show("Error al eliminar el registro", ToastAndroid.SHORT);
        //     } else {
        //         Alert.alert("Error", "No se pudo eliminar el registro");
        //     }
        // });
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
                {/* Bloqueo de pantalla con spinner */}
                {loading && (<Loading />)}
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

                    {/* Botón para agregar registro */}
                    <View style={{ marginBottom: 8 }}>
                        <TouchableOpacity
                            style={styles.logButton}
                            onPress={handleAdd}
                        >
                            <Text style={styles.logButtonText}>Agregar</Text>
                        </TouchableOpacity>
                    </View>
            
                </View>
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

                {/* Modal para agregar registro */}
                <AddModal 
                    onVisible={modalAddLogVisible} 
                    onClose={() => setModalAddLogVisible(false)}
                    onSave={onAddBookLog}
                    addDate={addDate}
                    setAddDate={setAddDate}
                    addHours={addHours}
                    setAddHours={setAddHours}
                    addMinutes={addMinutes}
                    setAddMinutes={setAddMinutes}
                    addSeconds={addSeconds}
                    setAddSeconds={setAddSeconds}
                    addBookId={addBookId}
                    setAddBookId={setAddBookId}
                    addBookTitle={addBookTitle}
                    setAddBookTitle={setAddBookTitle}
                />
                
                {/* Modal de edicion */}
                <EditModal 
                    onVisible={modalEditLogVisible} 
                    onClose={() => setModalEditLogVisible(false)}
                    onSave= {() => onEditBook()}
                    selectedLog={selectedLog}
                    setSelectedLog={setSelectedLog}
                    editHours={editHours}
                    setEditHours={setEditHours}
                    editMinutes={editMinutes}
                    setEditMinutes={setEditMinutes}
                    editSeconds={editSeconds}
                    setEditSeconds={setEditSeconds}
                />

                {/* Modal de eliminacion */}
                <DeleteModal
                    onVisible={modalDeleteLogVisible}
                    onClose={() => setModalDeleteLogVisible(false)}
                    onDelete={() => onDeleteBook(selectedLog)}
                    selectedLog={selectedLog}
                />
            </View>
        </GestureHandlerRootView>
    );
};

/**
    * Modal para agregar un nuevo registro de lectura.
    * @param props 
    * @returns 
*/
const AddModal = (props) => {
    const { onVisible, onClose, onSave, addDate, setAddDate, addHours, setAddHours, addMinutes, setAddMinutes, addSeconds, setAddSeconds, addBookId, setAddBookId, addBookTitle, setAddBookTitle } = props;

    const [showBooksDropdown, setShowBooksDropdown] = useState(false);
    const [booksInProgress, setBooksInProgress] = useState([]);
    useEffect(() => {
        const fetchBooksInProgress = async () => {
            try {
                const listBooks = {};
                const data = await getBooks();
                Object.entries(data).forEach(([state, books]) => {
                    listBooks[state] = [];
                    books.forEach((book: any) => {
                        listBooks[state].push(book);
                    });
                });
                setBooksInProgress(listBooks["reading"]);
            } catch (error) {
                console.error("Error al obtener libros en curso:", error);
            }
        };
        fetchBooksInProgress();
    }
    , []);

    return (
        <StandarModal onVisible={onVisible} onClose={onClose}>
            <View style={{marginTop: 40, alignItems: 'center', width: 300}}>
                <Text style={StylesModal.modalTitle}>Agregar Registro</Text>

                {/* Hora */}
                <Text style={StylesModal.modalSubtitle}>Tiempo de Lectura (hh:mm:ss)</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
                    <TextInput
                        style={[StylesModal.modalInput, { width: 60, textAlign: 'center', marginHorizontal: 2, fontSize: 24 }]}
                        keyboardType="numeric"
                        maxLength={2}
                        value={addHours}
                        onChangeText={h => setAddHours(h.replace(/[^0-9]/g, ''))}
                        placeholder="00"
                        placeholderTextColor={Colors.tertiary}
                    />
                    <TextInput
                        style={[StylesModal.modalInput, { width: 60, textAlign: 'center', marginHorizontal: 2, fontSize: 24 }]}
                        keyboardType="numeric"
                        maxLength={2}
                        value={addMinutes}
                        onChangeText={m => setAddMinutes(m.replace(/[^0-9]/g, ''))}
                        placeholder="00"
                        placeholderTextColor={Colors.tertiary}
                    />
                    <TextInput
                        style={[StylesModal.modalInput, { width: 60, textAlign: 'center', marginHorizontal: 2, fontSize: 24 }]}
                        keyboardType="numeric"
                        maxLength={2}
                        value={addSeconds}
                        onChangeText={s => setAddSeconds(s.replace(/[^0-9]/g, ''))}
                        placeholder="00"
                        placeholderTextColor={Colors.tertiary}
                    />
                </View>

                {/* Fecha */}
                <TextInput
                    style={[StylesModal.modalInput, {width: '100%', textAlign: 'center'}]}
                    placeholder="YYYY-MM-DD"
                    value={addDate}
                    placeholderTextColor={Colors.tertiary}
                    keyboardType="numeric"
                    maxLength={10}
                    onChangeText={text => {
                        // Solo permite números y guiones, y aplica la máscara YYYY-MM-DD
                        let cleaned = text.replace(/[^0-9]/g, '');
                        let masked = '';
                        if (cleaned.length > 0) masked = cleaned.substring(0, 4);
                        if (cleaned.length >= 5) masked += '-' + cleaned.substring(4, 6);
                        if (cleaned.length >= 7) masked += '-' + cleaned.substring(6, 8);
                        setAddDate(masked);
                    }}
                />
                
                {/* Libros en curso */}
                <View style={{width: '100%', marginBottom: 16}}>
                    <TouchableOpacity
                        style={[StylesModal.modalInput, {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}]}
                        onPress={() => setShowBooksDropdown(!showBooksDropdown)}
                    >
                        <Text style={{color: addBookId ? Colors.white : Colors.tertiary}}>
                            {addBookTitle || 'Selecciona un libro'}
                        </Text>
                        <Icon name={showBooksDropdown ? "chevron-up" : "chevron-down"} size={16} color={Colors.tertiary} />
                    </TouchableOpacity>
                    {showBooksDropdown && (
                        <View style={{
                            backgroundColor: Colors.primary,
                            borderRadius: 8,
                            maxHeight: 140,
                        }}>
                            <ScrollView style={{ maxHeight: 140 }}>
                                {booksInProgress.length === 0 ? (
                                    <Text style={{color: Colors.tertiary, padding: 8}}>No hay libros en curso</Text>
                                ) : (
                                    booksInProgress.map((book, idx) => (
                                      <TouchableOpacity
                                        key={book._id ? book._id.toString() : `book-${idx}`}
                                        style={{paddingHorizontal: 10, paddingTop: 10}}
                                        onPress={() => {
                                            setAddBookId(book.book_id);
                                            setAddBookTitle(book.title);
                                            setShowBooksDropdown(false);
                                        }}
                                      >
                                        <Text style={{
                                          color: Colors.white, 
                                          borderColor: Colors.darker, 
                                          borderWidth:1,
                                          borderRadius: 8,
                                          paddingHorizontal: 12,
                                          paddingVertical: 8,
                                        }}>{book.title}</Text>
                                      </TouchableOpacity>
                                    ))
                                )}
                            </ScrollView>
                        </View>
                    )}
                </View>

                <View style={StylesModal.modalButtonContainer}>
                    <TouchableOpacity style={StylesModal.modalButton} onPress={onSave}>
                        <Text style={StylesModal.modalOptionText}>Agregar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </StandarModal>
    )
};

/**
 * Modal para editar un registro de lectura.
 * @param props 
 * @returns 
 */
const EditModal = (props) => {
    const { onVisible, onClose, onSave, selectedLog, setSelectedLog, editHours, setEditHours, editMinutes, setEditMinutes, editSeconds, setEditSeconds } = props;
    return (
        <StandarModal onVisible={onVisible} onClose={onClose} >
            <View style={{marginTop: 40, alignItems: 'center'}}>
                <Text style={StylesModal.modalTitle}>{selectedLog?.book_title}</Text>
                <Text style={StylesModal.modalSubtitle}>{new Date(selectedLog?.date).toLocaleDateString()}</Text>
                <View style={{ width: '100%', alignItems: 'center', marginVertical: 16 }}>
                
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                        <TextInput
                            style={[StylesModal.modalInput, { width: 60, textAlign: 'center', marginHorizontal: 2, fontSize: 24 }]}
                            keyboardType="numeric"
                            maxLength={2}
                            value={editHours}
                            onChangeText={h => {
                                setEditHours(h.replace(/[^0-9]/g, ''));
                                if (!selectedLog) return;
                                const hours = parseInt(h) || 0;
                                const minutes = parseInt(editMinutes) || 0;
                                const seconds = parseInt(editSeconds) || 0;
                                setSelectedLog({ ...selectedLog, seconds: hours * 3600 + minutes * 60 + seconds });
                            }}
                            placeholder={selectedLog ? Math.floor(selectedLog.seconds / 3600).toString().padStart(2, '0') : '00'}
                            placeholderTextColor={Colors.tertiary}
                        />
                        <TextInput
                            style={[StylesModal.modalInput, { width: 60, textAlign: 'center', marginHorizontal: 2, fontSize: 24 }]}
                            keyboardType="numeric"
                            maxLength={2}
                            value={editMinutes}
                            onChangeText={m => {
                                setEditMinutes(m.replace(/[^0-9]/g, ''));
                                if (!selectedLog) return;
                                const hours = parseInt(editHours) || 0;
                                const minutes = parseInt(m) || 0;
                                const seconds = parseInt(editSeconds) || 0;
                                setSelectedLog({ ...selectedLog, seconds: hours * 3600 + minutes * 60 + seconds });
                            }}
                            placeholder={selectedLog ? Math.floor((selectedLog.seconds % 3600) / 60).toString().padStart(2, '0') : '00'}
                            placeholderTextColor={Colors.tertiary}
                        />
                        <TextInput
                            style={[StylesModal.modalInput, { width: 60, textAlign: 'center', marginHorizontal: 2, fontSize: 24 }]}
                            keyboardType="numeric"
                            maxLength={2}
                            value={editSeconds}
                            onChangeText={s => {
                                setEditSeconds(s.replace(/[^0-9]/g, ''));
                                if (!selectedLog) return;
                                const hours = parseInt(editHours) || 0;
                                const minutes = parseInt(editMinutes) || 0;
                                const seconds = parseInt(s) || 0;
                                setSelectedLog({ ...selectedLog, seconds: hours * 3600 + minutes * 60 + seconds });
                            }}
                            placeholder={selectedLog ? (selectedLog.seconds % 60).toString().padStart(2, '0') : '00'}
                            placeholderTextColor={Colors.tertiary}
                        />
                    </View>
                </View>
                <View style={StylesModal.modalButtonContainer}>
                    <TouchableOpacity style={StylesModal.modalButton} onPress={onSave} >
                        <Text style={StylesModal.modalOptionText}>Guardar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </StandarModal>
    );
}

/**
 * Modal para confirmar la eliminación de un registro de lectura.
 * @param props 
 * @returns 
 */
const DeleteModal = (props) => {
    const { onVisible, onClose, onDelete, selectedLog } = props;

    return (
        <StandarModal onVisible={onVisible} onClose={onClose} >
            <View style={{ padding: 20, alignItems: 'center' }}>
                <Text style={StylesModal.modalTitle}>Confirmar accion.</Text>
                <Text style={StylesModal.modalMessage}>¿Estás seguro de que deseas eliminar este registro?</Text>
                <Text style={StylesModal.modalMessage}>Esta acción no se puede deshacer.</Text>
                <View style={StylesModal.modalButtonContainer}>
                    <TouchableOpacity style={[StylesModal.modalButton, StylesModal.modalCancelButton]} onPress={onClose} >
                        <Text style={StylesModal.modalButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[StylesModal.modalButton, StylesModal.modalConfirmButton]} onPress={onDelete} >
                        <Text style={StylesModal.modalButtonText}>Eliminar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </StandarModal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: Colors.darker,
        paddingBottom: 40,
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
        marginBottom: 4,
        elevation: 2,
    },
    bookSetionMain: {
        marginBottom: 4,
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
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        width: 64,
        height: '100%',
        borderRadius: 8,
        flexDirection: 'column',
        marginLeft: 4,
    },
    logButton: {
        backgroundColor: Colors.primary,
        borderWidth: 1,
        borderColor: "#403E3B",
        padding: 10,
        borderRadius: 28,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    logButtonText: {
        color: Colors.white,
        marginLeft: 8,
        fontWeight: "bold",
    },
});

export default ReadingLogs;