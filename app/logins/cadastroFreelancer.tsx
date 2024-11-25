import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Picker } from 'react-native';
import Parse from 'parse';
import { useRouter } from 'expo-router';

const CadastroFreelancer: React.FC = () => {

  const router = useRouter();

  // Inicialização do Parse
  Parse.initialize('Ls0ZDWnnZDKmeGDU84muTYUqsjf9LqvInr72n9wa', 'wpIgdQHgVdu2jZfuzfn17KzH1JFv02ZfqtU9mluB');
  Parse.serverURL = 'https://parseapi.back4app.com/';

  // Estado para armazenar os dados do formulário
  const [username, setUsername] = useState('');
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [categoria, setCategoria] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Função para tratar o envio do formulário
  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    // Verificar se os campos obrigatórios estão preenchidos
    if (!username || !nome || !sobrenome || !email || !password || !categoria) {
      setError('Todos os campos são obrigatórios!');
      setLoading(false);
      return;
    }

    // Verificar se o email é válido
    const isValidEmail = /\S+@\S+\.\S+/.test(email);
    if (!isValidEmail) {
      setError('Por favor, insira um email válido!');
      setLoading(false);
      return;
    }

    // Limpa qualquer sessão anterior
    Parse.User.logOut();

    // Criar um novo usuário (freelancer)
    const freelancer = new Parse.User();
    freelancer.set('username', username);
    freelancer.set('nome', nome);
    freelancer.set('sobrenome', sobrenome);
    freelancer.set('email', email);
    freelancer.set('password', password); // Armazene a senha com segurança
    freelancer.set('role', 'freelancer'); // Atribuindo o papel 'Freelancer'
    freelancer.set('categoria', categoria);

    try {
      // Tenta salvar o freelancer
      await freelancer.signUp();
      Alert.alert('Cadastro realizado com sucesso!');
      router.push('/logins/login'); // Redireciona para a página de login após o cadastro
    } catch (err: any) {
      console.error('Erro ao cadastrar freelancer:', err);
      setError(`Erro ao cadastrar: ${err.message}`);
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.tituloCadastro}>Cadastro de Freelancer</Text>
      {error && <Text style={{ color: 'red' }}>{error}</Text>}

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

        {/* Select de Categoria */}
        <Picker
          selectedValue={categoria}
          style={styles.input}
          onValueChange={(itemValue) => setCategoria(itemValue)}
        >
          <Picker.Item label="Selecione a Categoria" value="" />
          <Picker.Item label="Desenvolvimento Web" value="Desenvolvimento Web" />
          <Picker.Item label="Design Gráfico" value="Design Gráfico" />
          <Picker.Item label="Marketing Digital" value="Marketing Digital" />
          <Picker.Item label="Escrita e Tradução" value="Escrita e Tradução" />
          {/* Adicione mais opções conforme necessário */}
        </Picker>

        <TouchableOpacity
          style={styles.submit}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitText}>{loading ? 'Cadastrando...' : 'Cadastrar'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/logins/login')}>
          <Text style={styles.linkText}>Já tem uma conta? Faça login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/logins/cadastro')}>
          <Text style={styles.linkText}>Cadastrar como User</Text>
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


export default CadastroFreelancer;
