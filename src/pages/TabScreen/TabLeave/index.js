import React, {Component} from 'react';
import {Text, StyleSheet, View, TouchableOpacity, Image} from 'react-native';
import {COLOR_BLUE, COLOR_GREEN, COLOR_RED} from '../../../component/Constant';

export default class TabLeave extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allContact: {},
      contactKey: [],
      tab: 1,
      expand: false,
    };
  }

  handleRenderNoData = () => {
    return (
      <View style={styles.viewMiddle}>
        <Image
          source={require('../../../../assets/noData.png')}
          style={styles.image}
        />
        <View style={styles.wrapperText}>
          <Text style={styles.textHugeCenter}>Kamu belum pernah</Text>
          <Text style={styles.textHugeCenter}>mengajukan cuti</Text>
        </View>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('FormLeave')}>
          <Text style={styles.textBlue}>Ajukan sekarang</Text>
        </TouchableOpacity>
      </View>
    );
  };

  handleRenderData = () => {
    return (
      <>
        <View style={styles.viewCard}>
          <View>
            <Text style={styles.textTitle}>1 Hari</Text>
            <Text>16 September 2024</Text>
            <Text>Libur Bersama Keluarga</Text>
          </View>
          <View>
            <Text style={[styles.textStatus, styles.blue]}>Menunggu</Text>
          </View>
        </View>
        <View style={styles.viewCard}>
          <View>
            <Text style={styles.textTitle}>1 Hari</Text>
            <Text>16 September 2024</Text>
            <Text>Libur Bersama Keluarga</Text>
          </View>
          <View>
            <Text style={[styles.textStatus, styles.green]}>Disetujui</Text>
          </View>
        </View>
        <View style={styles.viewCard}>
          <View>
            <Text style={styles.textTitle}>1 Hari</Text>
            <Text>16 September 2024</Text>
            <Text>Libur Bersama Keluarga</Text>
            <Text style={styles.red}>
              Terlalu banyak pengajuan cuti bulan ini
            </Text>
          </View>
          <View>
            <Text style={[styles.textStatus, styles.red]}>Ditolak</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => this.props.navigation.navigate('FormLeave')}>
          <Text style={styles.white}>+</Text>
        </TouchableOpacity>
      </>
    );
  };

  render() {
    return (
      <View style={styles.viewContainer}>
        <Text style={styles.textTitleBold}>Cuti</Text>
        {/* {this.handleRenderNoData()} */}
        {this.handleRenderData()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  viewMiddle: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapperText: {
    padding: 14,
  },
  textTitleBold: {
    fontWeight: 'bold',
    color: '#000000',
    padding: 30,
  },
  textHugeCenter: {
    fontWeight: '900',
    color: '#000000',
    fontSize: 20,
    textAlign: 'center',
  },
  textBlue: {
    color: COLOR_BLUE,
    textAlign: 'center',
  },
  image: {
    width: 100,
    height: 100,
  },
  viewCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    backgroundColor: '#F8F9FE',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginVertical: 10,
  },
  textTitle: {
    fontWeight: 'bold',
    color: '#000000',
  },
  textStatus: {
    fontWeight: 'bold',
    padding: 16,
  },
  blue: {
    color: COLOR_BLUE,
  },
  green: {
    color: COLOR_GREEN,
  },
  red: {
    color: COLOR_RED,
  },
  white: {
    color: 'white',
  },
  fab: {
    backgroundColor: COLOR_BLUE,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '90%',
    left: '80%',
  },
});
