import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Picker, ScrollView } from 'react-native';
import Parse from 'parse';  // Importando o Parse
import { useRouter } from 'expo-router';

Parse.initialize('Ls0ZDWnnZDKmeGDU84muTYUqsjf9LqvInr72n9wa', 'wpIgdQHgVdu2jZfuzfn17KzH1JFv02ZfqtU9mluB');
Parse.serverURL = 'https://Parseapi.back4app.com/';

export default function criarpost() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [contact, setContact] = useState('');
  const [category, setCategory] = useState('');
  const router = useRouter();

  const createPost = async () => {
    try {
      const Post = Parse.Object.extend('Post');
      const newPost = new Post();
      newPost.set('title', title);
      newPost.set('description', description);
      newPost.set('price', price);
      newPost.set('contact', contact);
      newPost.set('category', category);

      const currentUser = await Parse.User.current();
      if (currentUser) {
        newPost.set('username', currentUser.get('username'));
      } else {
        Alert.alert('Erro', 'Você precisa estar logado para criar um post.');
        return;
      }

      await newPost.save();
      Alert.alert('Sucesso', 'Post criado com sucesso!');
      router.push('/Home');
    } catch (error) {
      console.error('Erro ao criar o post:', error);
      Alert.alert('Erro', 'Não foi possível criar o post.');
    }
  };

  const handleCreatePost = () => {
    if (title.trim() === '' || description.trim() === '' || price.trim() === '' || contact.trim() === '' || category.trim() === '') {
      Alert.alert('Erro', 'Todos os campos devem ser preenchidos!');
      return;
    }
    createPost();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Criar Post</Text>

      <Text style={styles.label}>Título do Post</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Digite o título aqui"
      />

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Digite a descrição do post"
        multiline={true}
      />

      <Text style={styles.label}>Preço</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        placeholder="Digite o preço"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Contato</Text>
      <TextInput
        style={styles.input}
        value={contact}
        onChangeText={setContact}
        placeholder="Digite o contato"
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Categoria</Text>
      <Picker
        selectedValue={category}
        onValueChange={setCategory}
        style={styles.picker}
      >
        <Picker.Item label="Selecione a Categoria" value="" />
        <Picker.Item label="Desenvolvimento Web" value="Desenvolvimento Web" />
        <Picker.Item label="Design Gráfico" value="Design Gráfico" />
        <Picker.Item label="Marketing Digital" value="Marketing Digital" />
        <Picker.Item label="Escrita e Tradução" value="Escrita e Tradução" />
      </Picker>

      <TouchableOpacity style={styles.btn} onPress={handleCreatePost}>
        <Text style={styles.btnText}>Criar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#333',
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#fff',
  },
  input: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingLeft: 10,
    backgroundColor: '#fff',
  },
  textarea: {
    height: 120,
    textAlignVertical: 'top',
  },
  picker: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  btn: {
    backgroundColor: '#007aff',
    paddingVertical: 12,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
