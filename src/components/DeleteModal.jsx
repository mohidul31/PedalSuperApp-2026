import {Modal, Pressable, StyleSheet, Text, View} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';

const DeleteModal = ({
  visible,
  onClose,
  onConfirm,
  title = 'আপনি কি নিশ্চিত?',
  message = 'আপনি কি নিশ্চিত মুছে ফেলতে চান?',
  confirmText = 'হ্যাঁ',
  cancelText = 'না',
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.deleteModal}>
          <Ionicons name="trash-outline" size={50} color="red" />
          <Text style={styles.deleteTitle}>{title}</Text>
          <Text style={styles.deleteMessage}>{message}</Text>
          <View style={styles.deleteButtonContainer}>
            <Pressable
              style={[styles.button, {backgroundColor: 'gray'}]}
              onPress={onClose}>
              <Text style={styles.buttonText}>{cancelText}</Text>
            </Pressable>
            <Pressable
              style={[styles.button, {backgroundColor: 'red'}]}
              onPress={onConfirm}>
              <Text style={styles.buttonText}>{confirmText}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteModal: {
    width: '75%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  deleteMessage: {
    marginTop: 10,
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
  },
  deleteButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default DeleteModal;
