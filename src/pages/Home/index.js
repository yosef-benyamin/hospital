import React, {Component} from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import {Header} from '../../component/Header';
import SmallCard from '../../component/SmallCard';
import {ButtonLarge} from '../../component/ButtonLarge';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: 1,
      expand: false,
    };
  }

  handleContent = () => {
    switch (this.state.tab) {
      case 1:
        return (
          <View>
            <Text style={styles.textBold}>Ruang Radiologi</Text>
            <Text>Antonio (Dokter Jaga)</Text>
            <Text>Fajar M (Operator Radiologi)</Text>
            <Text>Fanny (Operator Radiologi)</Text>
            <Text>Reza(Administrasi)</Text>
          </View>
        );
      case 2:
        return (
          <View>
            <TouchableOpacity style={styles.btnContent}>
              <Text style={styles.textBold}>Ruang Radiologi</Text>
              <SmallCard text={'Sesi 1'} color={'blue'} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnContent}
              onPress={() => this.setState({expand: !this.state.expand})}>
              <View>
                <Text style={styles.textBold}>Ruang Radiologi</Text>
                {this.state.expand && (
                  <View>
                    <Text>Antonio (Dokter Jaga)</Text>
                    <Text>Fajar M (Operator Radiologi)</Text>
                    <Text>Fanny (Operator Radiologi)</Text>
                    <Text>Reza(Administrasi)</Text>
                  </View>
                )}
              </View>
              <SmallCard text={'Sesi 2'} color={'blue'} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnContent}>
              <Text style={styles.textBold}>Ruang Radiologi</Text>
              <SmallCard text={'Sesi 3'} color={'blue'} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnContent}>
              <Text style={styles.textBold}>Ruang Radiologi</Text>
              <SmallCard text={'Sesi 4'} color={'blue'} />
            </TouchableOpacity>
          </View>
        );
      default:
        break;
    }
  };

  handleStyleActive = item => {
    switch (this.state.tab === item) {
      case true:
        return styles.tabActive;
      case false:
        return styles.tabNonActive;
    }
  };

  handleRenderContent = () => {
    return (
      <View style={styles.viewContent}>
        <TouchableOpacity
          style={styles.btnTab}
          onPress={() => this.setState({tab: 1})}>
          <Text style={this.handleStyleActive(1)}>Jadwal Sesi 2</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnTab}
          onPress={() => this.setState({tab: 2})}>
          <Text style={this.handleStyleActive(2)}>Jadwal Hari ini</Text>
        </TouchableOpacity>
      </View>
    );
  };

  handleLogin = () => {
    this.props.navigation.navigate('Login');
  };

  render() {
    return (
      <View style={styles.viewContainer}>
        <Header />
        <View style={styles.viewTopCard}>
          <View>
            <Text style={styles.textCardBold}>Kamis, 12 September 2024</Text>
            <Text>22.30 WIB</Text>
          </View>
          <SmallCard text={'Sesi 2'} color={'black'} />
        </View>
        <View style={styles.viewWrapper}>
          {this.handleRenderContent()}
          <View style={styles.viewWrapperContent}>{this.handleContent()}</View>
        </View>
        {}
        <View style={styles.viewButton}>
          <ButtonLarge onPress={this.handleLogin} text={'Masuk'} />
        </View>
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
  viewTopCard: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FE',
    borderRadius: 16,
    padding: 16,
  },
  textCardBold: {
    fontWeight: 'bold',
    color: '#000000',
  },
  viewContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    marginBottom: 16,
    padding: 4,
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 10,
    color: '#1F2024',
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'center',
  },
  tabNonActive: {
    borderRadius: 16,
    padding: 10,
    color: '#71727A',
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'center',
  },
  btnTab: {
    width: '50%',
  },
  viewWrapper: {
    flex: 8,
    width: '90%',
    backgroundColor: '#F8F9FE',
    margin: 16,
    borderRadius: 16,
  },
  textBold: {
    color: '#1F2024',
    fontWeight: 'bold',
  },
  viewWrapperContent: {
    paddingHorizontal: 20,
  },
  btnContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 18,
  },
  viewButton: {
    width: '90%',
    marginVertical: 16,
  },
});
