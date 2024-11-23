import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Parse from 'parse';  // Importando o Parse

Parse.initialize('Ls0ZDWnnZDKmeGDU84muTYUqsjf9LqvInr72n9wa', 'wpIgdQHgVdu2jZfuzfn17KzH1JFv02ZfqtU9mluB');
Parse.serverURL = 'https://Parseapi.back4app.com/';

export default function TelaFree() {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedPrice, setEditedPrice] = useState('');
  const [editedContact, setEditedContact] = useState('');
  const [editedCategory, setEditedCategory] = useState('');
  const router = useRouter();

  // Função para buscar os posts salvos no Parse
  const fetchPosts = async () => {
    try {
      const currentUser = await Parse.User.current();
      if (currentUser) {
        const username = currentUser.get('username');
        const query = new Parse.Query('Post');
        query.equalTo('username', username); // Filtra posts pelo username
        const userPosts = await query.find(); // Busca posts do usuário

        if (userPosts.length > 0) {
          setPosts(userPosts); // Atualiza os posts
        } else {
          Alert.alert('Sem Posts', 'Não há posts cadastrados para esse usuário.');
        }
      } else {
        Alert.alert('Usuário não logado', 'Você precisa estar logado para ver seus posts.');
      }
    } catch (error) {
      console.error('Erro ao carregar os posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts(); // Carrega os posts assim que o componente for montado
  }, []); // Esse hook é chamado apenas uma vez, quando o componente é montado

  // Função para editar post
  const handleEdit = (post) => {
    setEditingPost(post);
    setEditedTitle(post.get('title'));
    setEditedDescription(post.get('description'));
    setEditedPrice(post.get('price'));
    setEditedContact(post.get('contact'));
    setEditedCategory(post.get('category'));
  };

  // Função para salvar a edição
  const saveEditedPost = async () => {
    try {
      if (!editedTitle || !editedDescription || !editedPrice || !editedContact || !editedCategory) {
        Alert.alert('Erro', 'Todos os campos devem ser preenchidos');
        return;
      }

      const updatedPost = editingPost;
      updatedPost.set('title', editedTitle);
      updatedPost.set('description', editedDescription);
      updatedPost.set('price', editedPrice);
      updatedPost.set('contact', editedContact);
      updatedPost.set('category', editedCategory);
      await updatedPost.save();

      fetchPosts(); // Recarrega os posts após salvar
      setEditingPost(null); // Limpa o estado de edição
      Alert.alert('Sucesso', 'Post atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar a edição:', error);
    }
  };

  // Função para deletar um post
  const deletePost = async (post) => {
    try {
      await post.destroy();
      fetchPosts(); // Recarrega os posts após excluir
      Alert.alert('Sucesso', 'Post deletado com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar o post:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.btnContainer}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => router.push('/reutiliza/criarpost')}
        >
          <Text style={styles.btnText}>Criar Post</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Postagens</Text>

      {posts.length > 0 ? (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.postCard}>
              <Text style={styles.postTitle}>{item.get('title')}</Text>
              <Text>{item.get('description')}</Text>
              <Text>{item.get('price')}</Text>
              <Text>{item.get('contact')}</Text>
              <Text>{item.get('category')}</Text>

              <TouchableOpacity
                style={styles.btn}
                onPress={() => handleEdit(item)}
              >
                <Text style={styles.btnText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnDel}
                onPress={() => deletePost(item)}
              >
                <Text style={styles.btnText}>Deletar</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noPosts}>Nenhum post encontrado.</Text>
      )}

      {editingPost && (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.input}
            value={editedTitle}
            onChangeText={setEditedTitle}
            placeholder="Título"
          />
          <TextInput
            style={styles.input}
            value={editedDescription}
            onChangeText={setEditedDescription}
            placeholder="Descrição"
          />
          <TextInput
            style={styles.input}
            value={editedPrice}
            onChangeText={setEditedPrice}
            placeholder="Preço"
          />
          <TextInput
            style={styles.input}
            value={editedContact}
            onChangeText={setEditedContact}
            placeholder="Contato"
          />
          <TextInput
            style={styles.input}
            value={editedCategory}
            onChangeText={setEditedCategory}
            placeholder="Categoria"
          />

          <TouchableOpacity
            style={styles.btn}
            onPress={saveEditedPost}
          >
            <Text style={styles.btnText}>Salvar Alterações</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#333',
  },
  btnContainer: {
    marginBottom: 20,
  },
  btn: {
    backgroundColor: '#007aff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10, // Adicionando marginTop aos botões
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
  },
  postCard: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  postTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  noPosts: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
  },
  editContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
  },
  title: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 20,
  },
  btnDel: {
    backgroundColor: 'red', // Cor vermelha para o botão de deletar
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10, // Adicionando marginTop aos botões
  },
});

