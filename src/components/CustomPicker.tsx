import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import StylesModal from '../styles/StylesModal';
import Icon from 'react-native-vector-icons/FontAwesome';

const CustomPicker = ({ selectedValue, onValueChange, options }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (value) => {
    onValueChange(value);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.pickerButton}>
        <Text style={styles.pickerText}>{selectedValue}</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={StylesModal.modalOverlay}>
          <View style={StylesModal.modalContent}>
            <TouchableOpacity style={StylesModal.modalCloseButtonIcon} onPress={() => setModalVisible(false)} >
              <Icon name="arrow-left" size={16} color="#fff" />
            </TouchableOpacity>
            <FlatList
              data={options}
              keyExtractor={(item) => item.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalOption} onPress={() => handleSelect(item)} >
                  <Text style={styles.modalOptionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  pickerButton: {
    borderWidth: 1,
    borderColor: '#595959',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#595959',
  },
  pickerText: {
    fontSize: 16,
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  modalOption: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginVertical: 4,
    width: '100%',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#fff',
  },
  modalCloseButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomPicker;