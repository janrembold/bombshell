import React from 'react';
import { Dimensions, Text, View, ScrollView, StyleSheet, TouchableWithoutFeedback } from 'react-native';

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'Links',
  };

  constructor(props) {
    super(props)
    this.state = { x: 0, y: 0 }
  }

  render() {
    // const { width } = Dimensions.get('window')

    return (
      <TouchableWithoutFeedback
        onPressIn={(event) => this.setState({ x: event.nativeEvent.locationX })}
        onPressOut={(event) => this.setState({ y: event.nativeEvent.locationX })}
      >
        <View style={styles.container} >
          <View style={styles.fixedRatio} >
            <Text>Click Area</Text>
            <Text>In x = {this.state.x} - Out x = {this.state.y}</Text>
          </View></View>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  fixedRatio: {
    backgroundColor: 'rebeccapurple',
    flex: 1,
    aspectRatio: 1,
    backgroundColor: '#ff00ff',
  }
});
