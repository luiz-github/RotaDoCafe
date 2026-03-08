import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6F4E37',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
  },
  welcome: {
    fontSize: 20,
    color: '#DDD',
    marginBottom: 30,
  },
  content: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 10,
    marginBottom: 40,
    width: '100%',
  },
  message: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
})