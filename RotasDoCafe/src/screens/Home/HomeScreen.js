import { View, Text, StyleSheet, Alert } from 'react-native'
import Button from '../../components/Button/Button'
import styles from './styles'

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
        <Text style={styles.message}>
          Você está autenticado e pronto para usar o aplicativo.
        </Text>
      </View>

      <Button.Danger
        title="Logout"
        onPress={handleLogout}
      />
    </View>
  )
}

