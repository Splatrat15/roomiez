import { StyleSheet, Text, View } from 'react-native';

export default function SwipeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>SWIPE</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 32,
    fontWeight: '700',
  },
});
