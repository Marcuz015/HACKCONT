// Home.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Parse from 'parse/react-native';

import TelaFree from './reutiliza/telafree';
import TelaUser from './reutiliza/telauser';

export default function Home() {
  Parse.initialize('Ls0ZDWnnZDKmeGDU84muTYUqsjf9LqvInr72n9wa', 'wpIgdQHgVdu2jZfuzfn17KzH1JFv02ZfqtU9mluB');
  Parse.serverURL = 'https://parseapi.back4app.com/';

  const [categoryStatus, setCategoryStatus] = useState<JSX.Element | null>(null);
  const [userRoleMessage, setUserRoleMessage] = useState<JSX.Element | string | null>(null);

  useEffect(() => {
    const checkCategoryAndRole = async () => {
      try {
        const currentUser = await Parse.User.currentAsync();

        if (!currentUser) {
          setCategoryStatus(<Text style={styles.statusText}>Você não está logado.</Text>);
          setUserRoleMessage(null);  // Nenhuma tela deve ser renderizada se o usuário não estiver logado
          return;
        }

        // Verificar se o usuário tem a categoria (classe 'categoria')
        const categoryQuery = new Parse.Query('categoria');
        categoryQuery.equalTo('User', currentUser);
        const category = await categoryQuery.first();

        // Verificar a role do usuário (campo 'role')
        const userRole = currentUser.get('role');
        console.log('Role do usuário:', userRole);  // Para verificar o valor exato

        // Comparando as roles de forma case-insensitive
        if (userRole && userRole.toLowerCase() === 'freelancer') {
          setCategoryStatus(
            <Text style={styles.statusText}>Bem-vindo, Freelancer <Text style={styles.username}>{currentUser.get('username')}</Text></Text>
          );
          console.log('Role do usuário:', userRole);  // Para verificar o valor exato
          setUserRoleMessage(<TelaFree/>);  // Exibir a tela de Freelancer
        } else if (userRole && userRole.toLowerCase() === 'user') {
          setCategoryStatus(
            <Text style={styles.statusText}>Bem-vindo, Usuário <Text style={styles.username}>{currentUser.get('username')}</Text></Text>
          );
          console.log('Role do usuário:', userRole);  // Para verificar o valor exato
          setUserRoleMessage(<TelaUser/>);  // Exibir a tela de usuário
        } else {
          setCategoryStatus(<Text style={styles.statusText}>Erro ao identificar o papel do usuário.</Text>);
          setUserRoleMessage('Erro ao identificar o papel do usuário.');
        }
      } catch (error) {
        setCategoryStatus(<Text style={styles.statusText}>Erro ao verificar categoria.</Text>);
        setUserRoleMessage('Erro ao verificar papel.');
        console.error('Erro ao verificar role do usuário:', error);
      }
    };

    checkCategoryAndRole();
  }, []);


  return (
    <View style={styles.container}>
      <View>{categoryStatus}</View>
      <View>{userRoleMessage}</View>  {/* Agora pode renderizar JSX ou string */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#333',
  },
  statusText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',  // Centraliza o texto
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007aff',  // Cor destacada para o nome de usuário
  },
});
