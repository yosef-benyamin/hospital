import React, {Component} from 'react';
import {Text, StyleSheet, View, TouchableOpacity, Image} from 'react-native';
import {
  COLOR_BLUE,
  COLOR_GREEN,
  COLOR_RED,
} from '../../../../component/Constant';
import {child, get, getDatabase, ref} from 'firebase/database';
import {FlashList} from '@shopify/flash-list';
import SmallCard from '../../../../component/SmallCard';

export default class TabLeave extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: 1,
      leaves: {},
    };
  }

  componentDidMount = () => {
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
      case 'annual':
        return 'Cuti Tahunan';
      case 'sick':
        return 'Cuti Sakit';
      case 'urgent':
        return 'Cuti Alasan Penting';
      case 'holiday':
        return 'Cuti Besar';
      case 'maternity':
        return 'Cuti Melahirkan';
      case 'unpaid':
        return 'Cuti di Luar Tanggungan';
      default:
        return '-';
    }
  };

  handleWaiting = (item, key, val) => {
    return (
      <TouchableOpacity
        style={styles.viewCard}
        key={`${item[0]} ${key}`}
        onPress={() =>
          this.props.navigation.navigate('FormApproval', {
            date: item[0],
            id: key,
            ...val,
          })
        }>
        <View>
          <Text style={styles.textTitle}>{val.name}</Text>
          <Text style={styles.textTitle}>{val.department}</Text>
          <Text style={styles.textGrey}>{this.handleDate(item[0])}</Text>
          <Text style={styles.textGrey}>{this.textLeave(val.onLeave)}</Text>
        </View>
        <SmallCard text={'Lihat'} color={'blue'} />
      </TouchableOpacity>
    );
  };

  handleLeave = ({item}) => {
    return Object.entries(item[1]).map(([key, val]) => {
      if (val.approval === 'waiting' && this.state.tab === 1) {
        return this.handleWaiting(item, key, val);
      }

      if (val.approval !== 'waiting' && this.state.tab === 2) {
        return (
          <TouchableOpacity
            style={styles.viewCard}
            key={`${item[0]} ${key}`}
            onPress={() =>
              this.props.navigation.navigate('FormApproval', {
                date: item[0],
                id: key,
                ...val,
              })
            }>
            <View>
              <Text style={styles.textTitle}>{val.name}</Text>
              <Text style={styles.textTitle}>{val.department}</Text>
              <Text style={styles.textGrey}>{this.handleDate(item[0])}</Text>
              <Text style={styles.textGrey}>{this.textLeave(val.onLeave)}</Text>
              {val.approval === 'rejected' && (
                <Text style={styles.red}>{val.reasonReject}</Text>
              )}
            </View>
            <View>{this.handleStatus(val.approval)}</View>
          </TouchableOpacity>
        );
      }
    });
  };

  handleRenderData = () => {
    return (
      <>
        <View style={styles.viewFlashList}>
          <FlashList
            data={Object.entries(this.state.leaves)}
            renderItem={this.handleLeave}
            estimatedItemSize={30}
            onRefresh={this.initApi}
            refreshing={false}
            ListEmptyComponent={this.handleRenderNoData}
          />
        </View>
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
});
