import {Modal, Text, TouchableOpacity, View} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';
import styles from '../../styles/DeleteModal.styles';

const DeleteModal = ({
  visible,
  onClose,
  onConfirm,
  title = 'আপনি কি নিশ্চিত?',
  message = 'আপনি কি নিশ্চিত মুছে ফেলতে চান?',
  confirmText = 'হ্যাঁ, মুছুন',
  cancelText = 'বাতিল',
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.iconContainer}>
            <Ionicons name="trash-outline" size={32} color="#E43A3A" />
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>{cancelText}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.confirmText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteModal;
