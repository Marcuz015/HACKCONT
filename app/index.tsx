import React, { useEffect, useState } from "react";
import { Button, Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyComponent: React.FC = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Verificar se há um usuário logado
  useEffect(() => {
    const checkUserLogin = async () => {
      const currentUser = await AsyncStorage.getItem('currentUser');
      if (currentUser) {
        setIsLoggedIn(true);  // Usuário logado
      } else {
        setIsLoggedIn(false);  // Usuário não logado
      }
    };
    checkUserLogin();
  }, []);

  const handleNavigation = () => {
    if (isLoggedIn) {
      router.push("/Home");  // Redireciona para a página Home
    } else {
      router.push("/logins/cadastro");  // Redireciona para a página de Cadastro
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logo.png')} style={styles.img} />
      <Text style={styles.title}>Bem-vindo ao aplicativo</Text>
      <TouchableOpacity style={styles.botao} onPress={handleNavigation}>
        <Text style={styles.botaoTexto}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#333',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff', // Cor do texto para visibilidade
  },
  img: {
    width: '80%',
    height: '50%',
  },
  botao: {
    backgroundColor: '#007aff',
    width: '80%',
    height: 35,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoTexto: {
    color: '#fff', // Cor do texto dentro do botão
    fontSize: 18,
    textAlign: 'center', // Garantir que o texto esteja centralizado
  },
});

export default MyComponent;
