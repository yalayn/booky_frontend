import React from 'react';
import { View, Modal, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import StylesModal from '../styles/StylesModal';

/**
 * StandarModal component
 * @param {Object} props - Component properties
 * @param {Function} props.onClose - Function to call when the modal is closed
 * @param {boolean} props.onVisible - Boolean to control the visibility of the modal
 * @param {ReactNode} props.children - Children components to render inside the modal
 */
const StandarModal = ({onClose,onVisible,children}) => {
    return (
        <Modal
        animationType="slide"
        transparent={true}
        visible={onVisible}
        onRequestClose={onClose}
        >
        <View style={StylesModal.modalOverlay}>
            <View style={StylesModal.modalContent}>
            <TouchableOpacity style={StylesModal.modalCloseButtonIcon} onPress={onClose}>
                <Icon name="close" size={16} color="#fff" />
            </TouchableOpacity>
            {children}
            </View>
        </View>
        </Modal>
    );
};

export default StandarModal;    