import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import Parse from 'parse/react-native';

export default function teluser() {
  const [posts, setPosts] = useState<any[]>([]);  // Para armazenar os posts de todos os usuários
  const [searchQuery, setSearchQuery] = useState<string>('');  // Para armazenar a pesquisa do usuário
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);  // Para armazenar os posts filtrados pela pesquisa

  useEffect(() => {
    // Função para carregar os posts
    const loadPosts = async () => {
      try {
        const Post = Parse.Object.extend('Post');  // Classe "Post" no Parse
        const query = new Parse.Query(Post);
        query.limit(100);  // Limite de 100 posts (ajustável)
        const allPosts = await query.find();  // Busca todos os posts

        console.log('Posts carregados:', allPosts);  // Verificando se os posts estão sendo carregados corretamente

        if (allPosts.length === 0) {
          console.log('Nenhum post encontrado.');
        }

        // Convertendo os objetos Parse para objetos simples
        const postData = allPosts.map(post => {
          const title = post.get('title') || '';  // Garantir que title seja uma string
          const description = post.get('description') || '';  // Garantir que description seja uma string
          const price = post.get('price') || 'N/A';  // Valor padrão para preço
          const contact = post.get('contact') || 'N/A';  // Valor padrão para contato
          const category = post.get('category') || 'N/A';  // Valor padrão para categoria

          return {
            id: post.id,
            title,
            description,
            price,
            contact,
            category,
          };
        });

        setPosts(postData);  // Armazena todos os posts no estado
        setFilteredPosts(postData);  // Inicialmente, todos os posts são exibidos
      } catch (error) {
        console.error('Erro ao carregar posts:', error);
      }
    };

    loadPosts();  // Chama a função para carregar os posts
  }, []);  // Carrega os posts apenas uma vez ao inicializar

  // Função para filtrar os posts com base na pesquisa
  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredPosts(posts);  // Se a pesquisa estiver vazia, exibe todos os posts
    } else {
      const filtered = posts.filter(post =>
        post.title.toLowerCase().includes(query.toLowerCase())  // Filtra pelo título do post
      );
      setFilteredPosts(filtered);
    }
  };

  const openWhatsApp = (contact: string) => {
      // Verifica se o número de contato começa com o código do Brasil e adiciona o prefixo necessário
      const phoneNumber = `55${contact.replace(/\D/g, '')}`;  // Remove qualquer caractere não numérico, sem o "+"
      const url = `https://wa.me/${phoneNumber}`;  // Link para o wa.me
  
      Linking.openURL(url)
        .catch(err => console.error('Erro ao tentar abrir o WhatsApp:', err));
  };
  

  return (
    <View style={styles.container}>
      {/* Barra de Pesquisa */}
      <TextInput
        style={styles.searchInput}
        placeholder="Pesquisar por título"
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {/* Lista de Posts */}
      <FlatList
        data={filteredPosts}  // Exibe os posts filtrados
        keyExtractor={(item) => item.id}  // Usando o ID do post como chave
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text>{item.description}</Text>  {/* Exemplo de um campo do post */}
            <Text>Preço: {item.price}</Text>
            <Text>Categoria: {item.category}</Text>
            <Text>Contato: {item.contact}</Text>

            {/* Botão para abrir o WhatsApp */}
            {item.contact && (
              <TouchableOpacity style={styles.button} onPress={() => openWhatsApp(item.contact)}>
                <Text style={styles.buttonText}>Abrir no WhatsApp</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />

      {filteredPosts.length === 0 && <Text style={styles.noPosts}>Nenhum post encontrado.</Text>} {/* Exibe mensagem caso não haja posts */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
    backgroundColor: '#333',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  postContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  noPosts: {
    textAlign: 'center',
    fontSize: 18,
    color: '#666',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#25D366',  // Cor do WhatsApp
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
