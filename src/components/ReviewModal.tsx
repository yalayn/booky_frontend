import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Colors } from "../styles/AppStyles";
import StylesModal from "../styles/StylesModal";
import Icon from "react-native-vector-icons/FontAwesome";
import CustomPicker from './CustomPicker';

const ReviewModal = ({ visible, onClose, onSubmit, initialRating, initialReview }) => {
  const [rating, setRating] = useState(initialRating || 1);
  const [review, setReview] = useState(initialReview || '');

  const handleSubmit = () => {
    onSubmit(rating, review);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={StylesModal.modalOverlay}>
        <View style={StylesModal.modalContent}>
            <TouchableOpacity style={StylesModal.modalCloseButtonIcon} onPress={onClose}>
              <Icon name="close" size={16} color="#fff" />
            </TouchableOpacity>
            <Text style={StylesModal.modalTitle}>Agregar Reseña</Text>

            {/* Reseña */}
            <Text style={StylesModal.modalLabelText}>Reseña:</Text>
            <TextInput
                style={StylesModal.modalTexarea}
                multiline={true}
                numberOfLines={4}
                placeholder="Escribe tu reseña aquí..."
                placeholderTextColor={Colors.darker}
                value={review}
                onChangeText={setReview}
                />
            {/* Selector de Puntuación */}
             <Text style={StylesModal.modalLabelText}>Puntuación:</Text>
             <CustomPicker
                selectedValue={rating}
                onValueChange={(value) => setRating(value)}
                options={[1, 2, 3, 4, 5]}
            />
            {/* Botones */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={StylesModal.modalOption} onPress={handleSubmit}>
                    <Text style={StylesModal.modalOptionText}>Guardar</Text>
                </TouchableOpacity>
            </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  picker: {
    width: '100%',
    height: 50,
    marginBottom: 16,
  },
  textarea: {
    width: '100%',
    height: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: Colors.secondary,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ReviewModal;