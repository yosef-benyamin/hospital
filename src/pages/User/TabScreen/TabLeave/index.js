import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {
  COLOR_BLUE,
  COLOR_GREEN,
  COLOR_RED,
} from '../../../../component/Constant';
import {MMKV} from 'react-native-mmkv';
import {child, get, getDatabase, ref} from 'firebase/database';
import {FlashList} from '@shopify/flash-list';

const {height} = Dimensions.get('window');

export default class TabLeave extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allContact: {},
      contactKey: [],
      tab: 1,
      expand: false,
      leaves: {},
      noData: true,
    };
  }

  componentDidMount = async () => {
    const storage = new MMKV();
    const jsonUser = storage.getString('employee');
    const employee = JSON.parse(jsonUser);

    this.setState({employee});
    this.initApi();
  };

  initApi = () => {
    const db = ref(getDatabase());
    get(child(db, 'leaves/')).then(snapshot => {
      if (snapshot.exists()) {
        this.setState({leaves: snapshot.val()});
      } else {
        console.log('No Data Available');
      }
    });
  };

  handleRenderNoData = () => {
    return (
      <ScrollView
        contentContainerStyle={styles.viewMiddle}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => this.initApi()} />
        }>
        <Image
          source={require('../../../../../assets/noData.png')}
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
      </ScrollView>
    );
  };

  handleStatus = status => {
    switch (status) {
      case 'approved':
        return <Text style={[styles.textStatus, styles.green]}>Disetujui</Text>;
      case 'waiting':
        return <Text style={[styles.textStatus, styles.blue]}>Menunggu</Text>;
      case 'rejected':
        return <Text style={[styles.textStatus, styles.red]}>Ditolak</Text>;
      default:
        break;
    }
  };

  handleDate = date => {
    return new Date(date).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  handleLeave = ({item}) => {
    // Check if we need to update noData state
    const hasMatchingEmployee = Object.entries(item[1]).some(
      ([key]) => key === Object.keys(this.state.employee)[0],
    );

    // Update state outside of render if needed
    if (hasMatchingEmployee && this.state.noData) {
      // Use setTimeout to avoid state updates during render
      setTimeout(() => {
        this.setState({noData: false});
      }, 0);
    }

    return Object.entries(item[1]).map(([key, val]) => {
      if (key === Object.keys(this.state.employee)[0]) {
        return (
          <View style={styles.viewCard} key={`${item[0]} ${key}`}>
            <View>
              <Text style={styles.textTitle}>{val.dayLeave} Hari</Text>
              <Text style={styles.textGrey}>{this.handleDate(item[0])}</Text>
              <Text style={styles.textGrey}>{val.reason}</Text>
              {val.approval === 'rejected' && (
                <Text style={styles.red}>{val.reasonReject}</Text>
              )}
            </View>
            <View>{this.handleStatus(val.approval)}</View>
          </View>
        );
      }
    });
  };

  handleRenderData = () => {
    return (
      <>
        <View
          style={[styles.viewFlashList, this.state.noData && styles.noData]}>
          <FlashList
            data={Object.entries(this.state.leaves)}
            renderItem={this.handleLeave}
            estimatedItemSize={30}
            onRefresh={this.initApi}
            refreshing={false}
            ListEmptyComponent={this.handleRenderNoData()}
          />
        </View>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => this.props.navigation.navigate('FormLeave')}>
          <Text style={styles.white}>+</Text>
        </TouchableOpacity>
      </>
    );
  };

  handleStyleActive = item => {
    switch (this.state.tab === item) {
      case true:
        return styles.tabActive;
      case false:
        return styles.tabNonActive;
    }
  };

  render() {
    return (
      <View style={styles.viewContainer}>
        <Text style={styles.textTitleBold}>Cuti</Text>
        {this.handleRenderData()}
        {this.handleRenderNoData()}
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
    height: height * 0.7,
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
    width: '100%',
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
  textGrey: {
    color: 'grey',
  },
  viewFlashList: {
    height: '90%',
    width: '100%',
    padding: 16,
  },
  noData: {
    height: '5%',
  },
});
