import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Colors, CardStyles } from "../styles/AppStyles";
import { Card, CardContent } from '../components/Card';
import Icon from "react-native-vector-icons/FontAwesome";
import StandarModal from '../components/StandarModal';
import StylesModal from "../styles/StylesModal";
import { MoveRight } from 'lucide-react-native';

const UserGoalScreen = ({navigation}) => {
    const [modalEditLogVisible, setModalEditLogVisible] = useState(false);
    const [editHours, setEditHours]       = useState('00');
    const [editMinutes, setEditMinutes]   = useState('00');
    const [editSeconds, setEditSeconds]   = useState('00');
    const [selectedData, setSelectedData] = useState(null);

    useEffect(() => {
        const fetchUserGoal = async () => {
            const userGoal = await getUserGoal();
            setEditHours(userGoal.hours);
            setEditMinutes(userGoal.minutes);
            setEditSeconds(userGoal.seconds);
        };
    fetchUserGoal();
  }, []);

  const onEditBook = () => {
    // Aquí puedes manejar la edición del libro
    console.log('Editando libro:', selectedData);
  };

  return (
    <View style={styles.container}>
        {/* Botón para regresar */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="close" size={20} color={Colors.white} />
        </TouchableOpacity>        
        <View style={styles.header}><Text style={styles.title}>Metas de lectura</Text></View>
        <Card style={CardStyles.cardSpacing}>
            <CardContent>
                <Text style={styles.subtitles}>Define un tiempo de lectura</Text>
                <Text style={styles.simple}>Podras establecer un tiempo de lectura diario.</Text>
                <Icon name="clock-o" size={36} color={Colors.white} style={{position: "absolute", right: 0, top: 0}}/>
                <View style={{marginTop: 15, flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{color: Colors.white, marginLeft: 0, fontSize: 18}}>{`${editHours}:${editMinutes}:${editSeconds}`}</Text>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        <TouchableOpacity style={styles.singleButton} onPress={() => { setModalEditLogVisible(true) }} >
                            <Text style={styles.singleButtonText}>Registrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </CardContent>
        </Card>
        <EditModal 
            onVisible       = {modalEditLogVisible} 
            onClose         = {() => setModalEditLogVisible(false)}
            onSave          = {() => onEditBook()}
            selectedData    = {selectedData}
            setSelectedData = {setSelectedData}
            editHours       = {editHours}
            setEditHours    = {setEditHours}
            editMinutes     = {editMinutes}
            setEditMinutes  = {setEditMinutes}
            editSeconds     = {editSeconds}
            setEditSeconds  = {setEditSeconds}
        />
    </View>
  );
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
                <Text style={StylesModal.modalTitle}>Tiempo de lectura</Text>
                <Text style={StylesModal.modalSubtitle}>Indica tu meta de lectura</Text>
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
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: Colors.white,
    },
    simple: {
        fontSize: 14,
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
    singleButton: {
        width: '40%',
        backgroundColor: Colors.primary,
        borderWidth: 1,
        borderColor: "#403E3B",
        padding: 10,
        borderRadius: 28,
        flexDirection: "row",
        justifyContent: "center",
        alignSelf: "flex-end",
    },
    singleButtonText: {
        color: Colors.white,
        fontWeight: "bold",
    },
});

export default UserGoalScreen;
