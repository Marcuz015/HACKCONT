import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Parse from 'parse/react-native';

Parse.initialize('Ls0ZDWnnZDKmeGDU84muTYUqsjf9LqvInr72n9wa', 'wpIgdQHgVdu2jZfuzfn17KzH1JFv02ZfqtU9mluB');
Parse.serverURL = 'https://parseapi.back4app.com/';

export default function Perfil() {
  const [userData, setUserData] = useState<any>(null); // Para armazenar os dados do usuário
  const [userRoleMessage, setUserRoleMessage] = useState<string | null>(null); // Para armazenar a role do usuário

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = await Parse.User.currentAsync(); // Alterado para currentAsync()

      if (!currentUser) {
        Alert.alert('Erro', 'Usuário não encontrado!');
        return;
      }

      try {
        // Obtendo os dados do usuário
        const username = currentUser.get('username');
        const nome = currentUser.get('nome');
        const sobrenome = currentUser.get('sobrenome');
        const email = currentUser.get('email');
        
        // Armazenando os dados
        setUserData({
          username,
          nome,
          sobrenome,
          email,
        });

        // Verificando a role do usuário
        const userRole = currentUser.get('role');
        if (userRole) {
          if (userRole.toLowerCase() === 'freelancer') {
            setUserRoleMessage('Você é um Freelancer');
          } else if (userRole.toLowerCase() === 'user') {
            setUserRoleMessage('Você é um Usuário');
          } else {
            setUserRoleMessage('Papel de usuário não identificado');
          }
        } else {
          setUserRoleMessage('Papel não atribuído');
        }
      } catch (error) {
        Alert.alert('Erro', 'Erro ao carregar dados do usuário');
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      {userData ? (
        <>
          <Text style={styles.text}>Username: {userData.username}</Text>
          <Text style={styles.text}>Nome: {userData.nome}</Text>
          <Text style={styles.text}>Sobrenome: {userData.sobrenome}</Text>
          <Text style={styles.text}>Email: {userData.email}</Text>
          <Text style={styles.text}>{userRoleMessage}</Text>
        </>
      ) : (
        <Text style={styles.text}>Carregando dados...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
});
