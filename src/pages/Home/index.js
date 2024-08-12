import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import {child, get, getDatabase, ref, remove} from 'firebase/database';
import {firebaseInit} from '../../config/firebaseInit';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allContact: {},
      contactKey: [],
    };
  }

  componentDidMount = () => {
    this.initApi();
  };

  initApi = () => {
    const db = ref(getDatabase(firebaseInit));
    get(child(db, 'Contact')).then(snapshot => {
      if (snapshot.exists()) {
        this.setState({
          allContact: snapshot.val(),
          contactKey: Object.keys(snapshot.val()),
        });
      } else {
        console.log('No Data Available');
      }
    });
  };

  handleDelete = contactKey => {
    const db = getDatabase();
    remove(ref(db, 'Contact/' + contactKey))
      .then(() => {
        Alert.alert('Info', 'Data berhasil terhapus permanen');
        this.setState({
          allContact: {},
          contactKey: [],
        });
      })
      .catch(error => console.log('Error :', error));
    this.initApi();
  };

  handleAlertDelete = contactKey => {
    console.log('HARD DELETE', contactKey);
    Alert.alert(
      'Perhatian',
      'Data ini akan dihapus secara permanen. Apa kamu yakin?',
      [
        {text: 'Batal'},
        {text: 'OK', onPress: () => this.handleDelete(contactKey)},
      ],
    );
  };

  handleRenderList = () => {
    if (Object.keys(this.state.allContact).length > 0) {
      console.log('masuk if', this.state.allContact);
      return this.state.contactKey.map(item => {
        const contact = {
          idno: this.state.allContact[item].idno,
          name: this.state.allContact[item].name,
          phoneno: this.state.allContact[item].phoneno,
        };
        return (
          <TouchableOpacity
            key={item}
            style={styles.buttonItem}
            onPress={() =>
              this.props.navigation.navigate('Add', {action: 'view', contact})
            }>
            <View>
              <Text>{this.state.allContact[item].idno}</Text>
              <Text>{this.state.allContact[item].name}</Text>
              <Text>{this.state.allContact[item].phoneno}</Text>
            </View>
            <View style={styles.viewButton}>
              <TouchableOpacity
                style={styles.buttonEdit}
                onPress={() =>
                  this.props.navigation.navigate('Add', {
                    contact,
                    contactKey: item,
                  })
                }>
                <Text>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonDelete}
                onPress={() => this.handleAlertDelete(item)}>
                <Text>Hapus</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        );
      });
    } else {
      console.log('masuk else');
      return (
        <View>
          <Text style={styles.textNoData}>Belum ada data</Text>
        </View>
      );
    }
  };

  render() {
    return (
      <View style={styles.viewContainer}>
        <ScrollView>{this.handleRenderList()}</ScrollView>
        <TouchableOpacity
          style={styles.buttonAdd}
          onPress={() =>
            this.props.navigation.navigate('Add', {action: 'add'})
          }>
          <Text style={styles.textAdd}> + </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
  },
  buttonAdd: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    right: 0,
    margin: 10,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'darkblue',
    borderRadius: 100,
  },
  textAdd: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  buttonItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'darkblue',
    padding: 10,
    margin: 10,
    borderRadius: 6,
  },
  viewButton: {
    flexDirection: 'row',
  },
  buttonEdit: {
    backgroundColor: 'green',
    alignItems: 'center',
    margin: 2,
    padding: 4,
    borderRadius: 3,
  },
  buttonDelete: {
    backgroundColor: 'red',
    alignItems: 'center',
    margin: 2,
    padding: 4,
    borderRadius: 3,
  },
  textNoData: {
    color: 'darkgrey',
    textAlign: 'center',
    margin: 30,
  },
});
