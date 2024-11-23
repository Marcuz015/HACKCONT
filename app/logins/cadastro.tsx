import React, { useState } from 'react';
import parse from 'parse';
import { useRouter } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

parse.initialize('Ls0ZDWnnZDKmeGDU84muTYUqsjf9LqvInr72n9wa', 'wpIgdQHgVdu2jZfuzfn17KzH1JFv02ZfqtU9mluB');
parse.serverURL = 'https://parseapi.back4app.com/';

const cadastro: React.FC = () => {
  const [username, setUsername] = useState('');
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  const handleCadastro = async () => {
    if (!username || !nome || !sobrenome || !email || !password) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios.');
      return;
    }

    parse.User.logOut();

    try {
      // Verificar se o username já existe
      const usernameQuery = new parse.Query(parse.User);
      usernameQuery.equalTo('username', username);
      const existingUserByUsername = await usernameQuery.first();

      if (existingUserByUsername) {
        Alert.alert('Erro', 'Este username já está em uso.');
        return;
      }

      const user = new parse.User();
      user.set('username', username);
      user.set('nome', nome);
      user.set('sobrenome', sobrenome);
      user.set('email', email);
      user.set('password', password);
      user.set('role', 'user'); // Isso não vai afetar a criação da role se não for validado no Parse

      // Tenta salvar o usuário
      await user.signUp();
      Alert.alert('Cadastro realizado com sucesso!');

      // Log para verificar se o código chegou até aqui
      console.log('Usuário cadastrado com sucesso! Redirecionando para login...');

      // Navegar para a página de login após o cadastro bem-sucedido
      router.push('/logins/login');
    } catch (err: any) {
      console.error('Erro ao cadastrar usuário:', err);
      Alert.alert('Erro', `Erro ao cadastrar usuário: ${err.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.tituloCadastro}>Cadastro de Usuário</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          style={styles.input}
          placeholder="Sobrenome"
          value={sobrenome}
          onChangeText={setSobrenome}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.submit} onPress={handleCadastro}>
          <Text style={styles.submitText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.push('/logins/login')}>
        <Text style={styles.linkText}>Já tem uma conta? Faça login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/logins/cadastroFreelancer')}>
        <Text style={styles.linkText}>Cadastrar como Freelancer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222222', // Cor de fundo mais clara
    padding: 20,
  },
  tituloCadastro: {
    color: '#007aff', // Cor do título (um tom de azul)
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  form: {
    width: '100%',
    maxWidth: 400,
  },
  input: {
    backgroundColor: '#FFFFFF', // Cor de fundo dos inputs (branco)
    color: '#333333', // Cor do texto dentro dos inputs (escuro)
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1, // Adicionando borda fina
    borderColor: '#D1D1D1', // Cor da borda dos inputs (cinza claro)
  },
  submit: {
    backgroundColor: '#007aff', // Cor do botão de submit (um tom de azul)
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  submitText: {
    color: '#fff', // Cor do texto do botão (branco)
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#007aff', // Cor dos links (azul)
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    textDecorationLine: 'underline', // Sublinhado para links
  },
});

export default cadastro;
