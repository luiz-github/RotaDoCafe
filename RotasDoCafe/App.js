import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { use, useEffect, useState, UseState } from 'react';

export function TelaSegura() {
  const [ access, setAcess ] = useState(false)

  useEffect(() => {
    (async () => {
      const authentication = await LocalAuthentication.authenticateAsync()
      if (authentication.success)
        setAccess(true)
      else
        setAcess(false)
    })()
  }, [])

  return (
        <View style={styles.container}>

      {acess && (
        <Text>Usuário logado com sucesso!</Text>
      )}
      <StatusBar style="auto" />
    </View>
  )
}

export default function App() {

  const [biometria, setBiometria] = useState(false)
  const [render, setRender] = useState(false)

  const changeRender = () => setRender(true)

  useEffect (() => {
    (async () => {
      const compativel = await LocalAuthentication.hasHardwareAsync();
      setBiometria(compativel)
    })();



  }, []);

  if (render) {
    renturn(
      <TelaSegura/>
    )
  } else {
  return (
    <View style={styles.container}>
      <Text>
        {biometria
          ? 'Faça o login com biometria'
          : 'Dispositivo não compativel'
        }
      </Text>
      <TouchableOpacity onPress={changeRender}><text></text></TouchableOpacity>

    </View>
  );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
