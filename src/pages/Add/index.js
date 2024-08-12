import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {getDatabase, ref, set} from 'firebase/database';
import uuid from 'react-native-uuid';

export default class Add extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idno: '',
      name: '',
      phoneno: '',
    };
  }

  componentDidMount = () => {
    if (this.props.route.params) {
      if (this.props.route.params.contact) {
        const {contact} = this.props.route.params;
        this.setState({
          idno: contact.idno,
          name: contact.name,
          phoneno: contact.phoneno,
        });
      }
    }
  };

  onChangeText = (stateName, value) => {
    this.setState({[stateName]: value});
  };

  goHome = () => {
    this.props.navigation.reset({
      index: 0,
      routes: [{name: 'Home'}],
    });
  };

  onSubmit = () => {
    const {idno, name, phoneno} = this.state;
    let contactKey = uuid.v4();
    if (this.props.route.params) {
      if (this.props.route.params.contactKey) {
        contactKey = this.props.route.params.contactKey;
      }
    }
    if (this.state.idno && this.state.name && this.state.phoneno) {
      const contact = {
        idno,
        name,
        phoneno,
      };

      const db = getDatabase();
      set(ref(db, 'Contact/' + contactKey), contact)
        .then(() => {
          Alert.alert('Sukses', 'Kontak Berhasil disimpan', [
            {text: 'OK', onPress: () => this.goHome()},
          ]);
        })
        .catch(error => console.log('Error :', error));
    } else {
      Alert.alert('Perhatian', 'NIP, Nama dan Nomor HP Wajib diisi');
    }
  };

  handleRenderInput = () => {
    let editable = true;
    if (this.props.route.params) {
      editable = this.props.route.params.action === 'view' ? false : true;
    }
    return (
      <>
        <TextInput
          style={styles.textInput}
          placeholder="NIP"
          placeholderTextColor="grey"
          onChangeText={value => this.onChangeText('idno', value)}
          value={this.state.idno}
          editable={editable}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Nama Karyawan"
          placeholderTextColor="grey"
          onChangeText={value => this.onChangeText('name', value)}
          value={this.state.name}
          editable={editable}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Nomor HP"
          placeholderTextColor="grey"
          onChangeText={value => this.onChangeText('phoneno', value)}
          value={this.state.phoneno}
          editable={editable}
          keyboardType="number-pad"
        />
      </>
    );
  };

  handleRenderButton = () => {
    if (this.props.route.params) {
      if (this.props.route.params.action !== 'view') {
        return (
          <TouchableOpacity style={styles.buttonSubmit} onPress={this.onSubmit}>
            <Text style={styles.textSubmit}>Simpan</Text>
          </TouchableOpacity>
        );
      }
    }
  };

  render() {
    return (
      <View style={styles.viewContainer}>
        {this.handleRenderInput()}
        {this.handleRenderButton()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewContainer: {
    alignItems: 'center',
  },
  textInput: {
    borderWidth: 1,
    margin: 16,
    padding: 10,
    borderRadius: 30,
    width: '90%',
    color: 'black',
  },
  buttonSubmit: {
    backgroundColor: 'darkblue',
    margin: 16,
    padding: 10,
    borderRadius: 30,
    width: '50%',
  },
  textSubmit: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
