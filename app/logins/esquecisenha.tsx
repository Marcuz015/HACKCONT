import React, { useState } from 'react';
import parse from 'parse';
import { useRouter } from "expo-router";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

parse.initialize('Ls0ZDWnnZDKmeGDU84muTYUqsjf9LqvInr72n9wa', 'wpIgdQHgVdu2jZfuzfn17KzH1JFv02ZfqtU9mluB');
parse.serverURL = 'https://parseapi.back4app.com/';

const esquecisenha: React.FC = () => {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert('Erro', 'Por favor, insira um email válido.');
      return;
    }

    try {
      await parse.User.requestPasswordReset(email);
      Alert.alert('Sucesso', 'Email de redefinição de senha enviado com sucesso!');
      router.push('/logins/login'); // Redireciona para a página de login após enviar o email
    } catch (error: any) {
      Alert.alert('Erro', `Erro: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.tituloCadastro}>Esqueci a Senha</Text>
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            required
          />
        </View>

        <TouchableOpacity style={styles.submit} onPress={handlePasswordReset}>
          <Text style={styles.submitText}>Enviar Email de Redefinição</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/logins/login')}>
          <Text style={styles.linkText}>Voltar para Login</Text>
        </TouchableOpacity>
      </View>
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
  form: {
    width: '100%',
    maxWidth: 400,
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#3a4c54',
    color: '#fff',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  submit: {
    backgroundColor: '#007aff', // Mudança para a cor azul
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  submitText: {
    color: '#fff',
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


export default esquecisenha;
