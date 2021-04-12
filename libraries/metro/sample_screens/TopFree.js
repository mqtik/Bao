import React, { Component } from 'react';
import { StyleSheet, View, Text, FlatList, Image } from 'react-native';

const sampleStoreData = [
  {
    key: '1',
    title: 'Alice in Wonderland',
    developer: 'Lewis Carrol',
    icon: 'https://uncorkedcanvas.com/blog/wp-content/uploads/2016/05/Alice-Wonderland.jpg',
    cost: 0
  },
  {
    key: '2',
    title: 'La tregua',
    developer: 'Mario Benedetti',
    icon:
      'https://images-na.ssl-images-amazon.com/images/I/71HOkkAjInL.jpg',
    cost: 0
  },
  {
    key: '3',
    title: 'Test 2',
    developer: 'Mati',
    icon:
      'https://m.media-amazon.com/images/M/MV5BOTgwMzFiMWYtZDhlNS00ODNkLWJiODAtZDVhNzgyNzJhYjQ4L2ltYWdlXkEyXkFqcGdeQXVyNzEzOTYxNTQ@._V1_.jpg',
    cost: 0
  },
  {
    key: '4',
    title: 'Test 4',
    developer: 'Mati',
    icon:
      'https://images-na.ssl-images-amazon.com/images/I/81fUMJAwwkL.jpg',
    cost: 0
  }
];

export default class TopFree extends Component {
  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={sampleStoreData}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: 'row',
                marginStart: 10,
                marginBottom: 10
              }}
            >
              <Image
                source={{ uri: item.icon }}
                style={{ height: 100, width: 100 }}
              />
              <View style={{ marginStart: 10 }}>
                <Text
                  style={{ color: 'white', fontSize: 25, fontWeight: '300' }}
                >
                  {item.title}
                </Text>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 13,
                    fontWeight: '300',
                    marginTop: 3
                  }}
                >
                  {item.developer}
                </Text>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 13,
                    fontWeight: '300',
                    marginTop: 3
                  }}
                >
                  {item.cost ? `$${item.cost}` : 'free'}
                </Text>
              </View>
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
    backgroundColor: 'black'
  }
});
