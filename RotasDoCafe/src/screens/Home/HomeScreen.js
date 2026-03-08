import { View, Text, StyleSheet, Alert } from 'react-native'
import Button from '../../components/Button'

export default function HomeScreen({ navigation }) {
  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja realmente sair do aplicativo?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => navigation.replace('Auth'),
      },
    ])
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rotas do Café</Text>
      <Text style={styles.welcome}>Bem-vindo à Home!</Text>

      <View style={styles.content}>
        <Text style={styles.message}>Você está autenticado e pronto para usar o aplicativo.</Text>
      </View>

      <Button title="Logout" onPress={handleLogout} variant="danger" />
    </View>
  )
}

const styles = StyleSheet.create({
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
