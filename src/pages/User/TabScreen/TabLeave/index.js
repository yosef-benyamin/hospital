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
  COLOR_GREEN_PRIMARY,
  COLOR_RED,
} from '../../../../component/Constant';
import {MMKV} from 'react-native-mmkv';
import {getLeavesByID} from '../../../../firestore/User/TabLeave';
import {FlashList} from '@shopify/flash-list';

const {height} = Dimensions.get('window');

export default class TabLeave extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leaves: [],
      employee: {},
    };
  }

  componentDidMount = async () => {
    const storage = new MMKV();
    const jsonUser = storage.getString('employee');
    const employee = JSON.parse(jsonUser);

    this.setState({employee});
    this.initApi(employee);
  };

  initApi = async employee => {
    const leaves = [];
    const querySnapshot = await getLeavesByID(employee.key);
    querySnapshot.forEach(doc => {
      leaves.push({...doc.data(), key: doc.id});
    });
    this.setState({leaves});
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
          <Text style={styles.textGreen}>Ajukan sekarang</Text>
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
    return (
      <View style={styles.viewCard} key={item.key}>
        <View style={styles.viewDesc}>
          <Text style={styles.textTitle}>{item.dayLeave} Hari</Text>
          <Text style={styles.textGrey}>{this.handleDate(item.date)}</Text>
          <Text style={styles.textGrey}>{item.reason}</Text>
          {item.approval === 'rejected' && (
            <Text style={styles.red}>{item.reasonReject}</Text>
          )}
        </View>
        <View>{this.handleStatus(item.approval)}</View>
      </View>
    );
  };

  handleRenderData = () => {
    return (
      <>
        <View style={styles.viewFlashList}>
          <FlashList
            data={this.state.leaves}
            renderItem={this.handleLeave}
            estimatedItemSize={30}
            onRefresh={() => this.initApi(this.state.employee)}
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
  textGreen: {
    color: COLOR_GREEN_PRIMARY,
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
    backgroundColor: COLOR_GREEN_PRIMARY,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '90%',
    left: '80%',
  },
  textGrey: {
    color: 'grey',
  },
  viewFlashList: {
    height: '90%',
    width: '100%',
    padding: 16,
  },
  viewDesc: {
    width: '70%',
  },
});
