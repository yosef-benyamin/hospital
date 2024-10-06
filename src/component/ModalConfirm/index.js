import React from 'react';
import {Modal, StyleSheet, Text, View} from 'react-native';
import ButtonLarge from '../ButtonLarge';

export const ModalConfirm = ({
  animationType = 'fade',
  transparent = true,
  visible,
  negativeButton,
  positiveButton,
}) => {
  return (
    <Modal
      animationType={animationType}
      transparent={transparent}
      visible={visible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Keluar</Text>
          <Text style={styles.modalDesc}>Apa anda yakin ingin keluar?</Text>
          <View style={styles.viewButton}>
            <ButtonLarge
              styleButton={styles.button}
              text={'Batal'}
              onPress={negativeButton}
            />
            <ButtonLarge
              styleButton={styles.button}
              text={'Keluar'}
              onPress={positiveButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
  },
  modalText: {
    textAlign: 'center',
    fontWeight: '900',
    color: 'black',
  },
  modalDesc: {
    margin: 10,
  },
  viewButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '85%',
  },
  button: {
    width: '50%',
    margin: 12,
  },
});
