import React, {Component} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import WebView from 'react-native-webview';

export default class DocumentLeave extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const pdfUrl =
      'https://drive.google.com/file/d/1WzHu8ByMfOgyKcB2sz2pqClMB5tVQTzk';

    return (
      <View style={styles.container}>
        <WebView
          source={{uri: pdfUrl}}
          style={styles.webview}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.viewLoading}>
              <ActivityIndicator size={'large'} />
            </View>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  viewLoading: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
});
