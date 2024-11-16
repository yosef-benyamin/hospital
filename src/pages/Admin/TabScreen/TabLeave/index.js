import React, {Component} from 'react';
import {Text, StyleSheet, View, TouchableOpacity, Image} from 'react-native';
import {
  COLOR_BLUE,
  COLOR_GREEN,
  COLOR_RED,
} from '../../../../component/Constant';
import {getLeavesByRoom} from '../../../../firestore/Spv/TabLeave';
import {FlashList} from '@shopify/flash-list';
import SmallCard from '../../../../component/SmallCard';
import {MMKV} from 'react-native-mmkv';

export default class TabLeave extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: 1,
      leavesWaiting: [],
      leavesNotWaiting: [],
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
    const leavesWaiting = [];
    const leavesNotWaiting = [];
    const querySnapshot = await getLeavesByRoom(employee.Room);
    querySnapshot.forEach(doc => {
      if (doc.data().approval === 'waiting') {
        leavesWaiting.push({...doc.data(), key: doc.id});
      } else {
        leavesNotWaiting.push({...doc.data(), key: doc.id});
      }
    });
    this.setState({leavesWaiting, leavesNotWaiting});
  };

  handleRenderNoData = () => {
    return (
      <View style={styles.viewMiddle}>
        <Image
          source={require('../../../../../assets/noData.png')}
          style={styles.image}
        />
        <View style={styles.wrapperText}>
          <Text style={styles.textHugeCenter}>Belum ada yang</Text>
          <Text style={styles.textHugeCenter}>mengajukan cuti</Text>
        </View>
      </View>
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

  textLeave = leave => {
    switch (leave) {
      case 'Annual':
        return 'Cuti Tahunan';
      case 'Sick':
        return 'Cuti Sakit';
      case 'Urgent':
        return 'Cuti Alasan Penting';
      case 'Holiday':
        return 'Cuti Besar';
      case 'Maternity':
        return 'Cuti Melahirkan';
      case 'Unpaid':
        return 'Cuti di Luar Tanggungan';
      default:
        return leave;
    }
  };

  handleWaiting = ({item}) => {
    if (item.approval === 'waiting') {
      return (
        <TouchableOpacity
          style={styles.viewCard}
          key={item.key}
          onPress={() =>
            this.props.navigation.navigate('FormApproval', {
              id: item.key,
              ...item,
            })
          }>
          <View>
            <Text style={styles.textTitle}>{item.Name}</Text>
            <Text style={styles.textTitle}>{item.Room}</Text>
            <Text style={styles.textGrey}>{this.handleDate(item.date)}</Text>
            <Text style={styles.textGrey}>{this.textLeave(item.onLeave)}</Text>
          </View>
          <SmallCard text={'Lihat'} color={'blue'} />
        </TouchableOpacity>
      );
    }
  };

  handleLeave = ({item}) => {
    if (item.approval !== 'waiting') {
      return (
        <TouchableOpacity
          style={styles.viewCard}
          key={item.key}
          onPress={() =>
            this.props.navigation.navigate('FormApproval', {
              id: item.key,
              ...item,
            })
          }>
          <View style={styles.viewDesc}>
            <Text style={styles.textTitle}>{item.Name}</Text>
            <Text style={styles.textTitle}>{item.Room}</Text>
            <Text style={styles.textGrey}>{this.handleDate(item.date)}</Text>
            <Text style={styles.textGrey}>{this.textLeave(item.onLeave)}</Text>
            {item.approval === 'rejected' && (
              <Text style={styles.red}>{item.reasonReject}</Text>
            )}
          </View>
          <View>{this.handleStatus(item.approval)}</View>
        </TouchableOpacity>
      );
    }
  };

  handleRenderData = () => {
    switch (this.state.tab) {
      case 1:
        return (
          <View style={styles.viewFlashList}>
            <FlashList
              data={this.state.leavesWaiting}
              renderItem={this.handleWaiting}
              estimatedItemSize={30}
              onRefresh={() => this.initApi(this.state.employee)}
              refreshing={false}
              ListEmptyComponent={this.handleRenderNoData}
            />
          </View>
        );
      case 2:
        return (
          <View style={styles.viewFlashList}>
            <FlashList
              data={this.state.leavesNotWaiting}
              renderItem={this.handleLeave}
              estimatedItemSize={30}
              onRefresh={() => this.initApi(this.state.employee)}
              refreshing={false}
              ListEmptyComponent={this.handleRenderNoData}
            />
          </View>
        );
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
          <Text style={this.handleStyleActive(1)}>Pengajuan Cuti</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnTab}
          onPress={() => this.setState({tab: 2})}>
          <Text style={this.handleStyleActive(2)}>Disetujui/Ditolak</Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.viewContainer}>
        <Text style={styles.textTitleBold}>Cuti</Text>
        {this.handleRenderContent()}
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
  viewContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    marginBottom: 16,
    padding: 4,
  },
  btnTab: {
    width: '50%',
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
    height: '100%',
    width: '100%',
    padding: 16,
  },
  viewDesc: {
    width: '70%',
  },
});
