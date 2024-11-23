import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Animated } from 'react-native';
import Parse from 'parse/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

// Inicialização do Parse
Parse.setAsyncStorage(AsyncStorage);
Parse.initialize('Ls0ZDWnnZDKmeGDU84muTYUqsjf9LqvInr72n9wa', 'wpIgdQHgVdu2jZfuzfn17KzH1JFv02ZfqtU9mluB');
Parse.serverURL = 'https://parseapi.back4app.com'; // URL correta

const Login: React.FC = () => {
  const router = useRouter();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isFreelaLogin, setIsFreelaLogin] = useState<boolean>(false); // Estado para alternar entre telas
  const rotateValue = new Animated.Value(0); // Animação de rotação

  // Função para iniciar a rotação do card
  const startCardRotation = () => {
    Animated.timing(rotateValue, {
      toValue: isFreelaLogin ? 0 : 1, // Alterna entre 0 e 1 para o efeito de rotação
      duration: 500,
      useNativeDriver: true,
    }).start();
    setIsFreelaLogin(!isFreelaLogin); // Alterna a tela de login
  };

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    try {
      const user = await Parse.User.logIn(username, password);
      console.log('Usuário autenticado:', user);
      if (user) {
        router.push('/Home');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      Alert.alert('Erro', 'Usuário ou senha incorretos.');
    }
  };

  const handleLoginFreela = async () => {
    if (!username || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }
  
    try {
      const Freelancer = await Parse.User.logIn(username, password);
      console.log('Usuário autenticado como freela:', Freelancer);
  
      if (Freelancer) {
        // Verifica o campo 'role' ou outro campo para identificar se é um freelancer
        const FreelancerRole = Freelancer.get('role'); // Certifique-se de que o campo 'role' está presente no banco de dados
        if (FreelancerRole && FreelancerRole.toLowerCase() === 'freelancer') {
          console.log('Autenticado como freelancer');
          router.replace('/Home'); // Tente usar replace para garantir que a navegação funcione corretamente
        } else {
          Alert.alert('Erro', 'Você não é um freelancer.');
        }
      }
    } catch (error) {
      console.error('Erro ao fazer login como freela:', error);
      Alert.alert('Erro', 'Usuário ou senha incorretos.');
    }
  };

  // Animação de rotação
  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'], // Efeito de rotação
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.card, { transform: [{ rotateY: rotate }] }]} >
        <Text style={styles.tituloCadastro}>Login {isFreelaLogin ? 'como Freelancer' : ''}</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#ccc"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#ccc"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.submit} onPress={isFreelaLogin ? handleLoginFreela : handleLogin}>
            <Text style={styles.submitText}>Entrar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.submit} onPress={startCardRotation}>
            <Text style={styles.submitText}>
              {isFreelaLogin ? 'Voltar ao Login de Usuário' : 'Entrar como Freelancer'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/logins/cadastro')}>
            <Text style={styles.linkText}>Não possui conta? Cadastre-se</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/logins/esquecisenha')}>
            <Text style={styles.linkText}>Esqueci a senha</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222222',
    padding: 20,
  },
  tituloCadastro: {
    color: '#007aff', // Mudança para a cor azul
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#3a4c54',
    borderRadius: 10,
    padding: 20,
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: '#3a4c54',
    color: '#fff',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1
  },
  submit: {
    backgroundColor: '#007aff', // Mudança para a cor azul
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  submitText: {
    color: '#fff', // Cor preta
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#007aff', // Mudança para a cor azul
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
});

export default Login;
