import { StyleSheet } from 'react-native';
import { Colors } from './AppStyles';

const StylesModal = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '80%',
      backgroundColor: Colors.darker,
      borderRadius: 8,
      padding: 16,
      alignItems: 'center',
    },
    modalTitle: {
      paddingTop: 26,
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
      color: '#fff',
    },
    modalLabelText: {
      fontSize: 16,
      fontWeight: 'bold',
      alignSelf: 'flex-start',
      marginBottom: 8,
      color: '#fff',
    },
    modalOption: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      marginVertical: 4,
      backgroundColor: Colors.primary,
      borderRadius: 25,
      width: '100%',
      alignItems: 'center',
    },
    modalOptionText: {
      color: '#fff',
      fontSize: 16,
    },
    modalCloseButton: {
      marginTop: 16,
      paddingVertical: 8,
      paddingHorizontal: 16,
      backgroundColor: Colors.primary,
      borderRadius: 4,
      width: '100%',
      alignItems: 'center',
    },
    modalCloseButtonText: {
      color: '#fff',
      fontSize: 16,
    },
    modalCloseButtonIcon: {
      position: 'absolute',
      top: 16,
      left: 16,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: Colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      },
    modalTexarea: {
        width: '100%',
        height: 100,
        borderWidth: 1,
        borderColor: Colors.primary,
        backgroundColor: Colors.primary,
        color: '#fff',
        borderRadius: 8,
        padding: 8,
        textAlignVertical: 'top',
        marginBottom: 16,
    }
  });

  export default StylesModal;