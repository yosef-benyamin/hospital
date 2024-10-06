import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import SmallCard from '../../../component/SmallCard';
import {ButtonSmall} from '../../../component/ButtonSmall';
import {COLOR_BLUE} from '../../../component/Constant';
import {Header} from '../../../component/Header';

export default class TabHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allContact: {},
      contactKey: [],
      tab: 1,
      expand: false,
      filterAll: true,
    };
  }

  handleContent = () => {
    switch (this.state.tab) {
      case 1:
        return (
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
            <View>
              <Text style={styles.textDate}>12 September 2024</Text>
              <Text style={styles.textDate}>Sesi 2</Text>
            </View>
          </TouchableOpacity>
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
          <Text style={this.handleStyleActive(1)}>Jadwal Anda</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnTab}
          onPress={() => this.setState({tab: 2})}>
          <Text style={this.handleStyleActive(2)}>Jadwal Bulan Ini</Text>
        </TouchableOpacity>
      </View>
    );
  };

  handleLogin = () => {
    this.props.navigation.navigate('Login');
  };

  handleButtonFilter = filter => {
    this.setState({
      filterAll: false,
      filter1: false,
      filter2: false,
      filter3: false,
      filter4: false,
      [filter]: true,
    });
    console.log('filter');
  };

  render() {
    return (
      <View style={styles.viewContainer}>
        <Header />
        <View style={styles.viewGreeting}>
          <Text style={styles.textGreeting}>Hi, Dian Sastro</Text>
          <Text style={styles.textGreeting}>Dokter Anak</Text>
        </View>
        <View style={styles.viewTopCard}>
          <View>
            <Text style={styles.textCardBold}>Kamis, 12 September 2024</Text>
            <Text>22.30 WIB</Text>
          </View>
          <SmallCard text={'Sesi 2'} color={'black'} />
        </View>
        <View style={styles.viewWrapper}>
          {this.handleRenderContent()}
          <View style={styles.viewFilter}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <ButtonSmall
                text={'Semua'}
                active={this.state.filterAll}
                onPress={() => this.handleButtonFilter('filterAll')}
              />
              <ButtonSmall
                text={'Sesi 1'}
                active={this.state.filter1}
                onPress={() => this.handleButtonFilter('filter1')}
              />
              <ButtonSmall
                text={'Sesi 2'}
                active={this.state.filter2}
                onPress={() => this.handleButtonFilter('filter2')}
              />
              <ButtonSmall
                text={'Sesi 3'}
                active={this.state.filter3}
                onPress={() => this.handleButtonFilter('filter3')}
              />
              <ButtonSmall
                text={'Libur'}
                active={this.state.filter4}
                onPress={() => this.handleButtonFilter('filter4')}
              />
            </ScrollView>
          </View>
          <View style={styles.viewWrapperContent}>{this.handleContent()}</View>
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
  viewGreeting: {
    width: '90%',
    marginVertical: 10,
  },
  textGreeting: {
    fontWeight: '500',
    color: '#000000',
    fontSize: 16,
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
  textCard: {
    color: '#71727A',
  },
  textCardBold: {
    fontWeight: 'bold',
    color: '#000000',
  },
  viewInnerCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#000000',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  viewFilter: {
    flexDirection: 'row',
  },
  textDate: {
    color: COLOR_BLUE,
    fontWeight: 'bold',
    textAlign: 'right',
  },
});
