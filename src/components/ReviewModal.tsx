import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Colors } from "../styles/AppStyles";
import StylesModal from "../styles/StylesModal";
import Icon from "react-native-vector-icons/FontAwesome";

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
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((value) => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.ratingButton,
                  rating === value && styles.ratingButtonSelected,
                ]}
                onPress={() => setRating(value)}
              >
                <Text style={[ styles.ratingButtonText, rating === value && styles.ratingButtonTextSelected, ]} >
                  <Icon name="star" size={16} color={rating >= value ? Colors.lighter : Colors.darker} />
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            style={StylesModal.modalTexarea}
            multiline={true}
            numberOfLines={4}
            placeholder="Escribe tu reseña aquí..."
            placeholderTextColor={Colors.darker}
            value={review}
            onChangeText={setReview}
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
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    width: '100%',
  },
  ratingButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  ratingButtonSelected: {
    backgroundColor: Colors.primary,
  },
  ratingButtonText: {
    fontSize: 16,
    color: Colors.lightereso,
  },
  ratingButtonTextSelected: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default ReviewModal;