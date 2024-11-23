import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Button, View } from 'react-native';
import Parse from 'parse/react-native';
import { useNavigation } from '@react-navigation/native'; // Usando useNavigation

export default function RootLayout() {
  const [showDrawer, setShowDrawer] = useState(true);
  const navigation = useNavigation(); // Obtendo navegação para acessar o estado da navegação

  useEffect(() => {
    // Identificar a tela ativa e ocultar o Drawer conforme necessário
    const currentRoute = navigation.getState().routes[navigation.getState().index]?.name;

    const hiddenDrawerScreens = ['cadastro', 'login', 'esquecisenha', 'telafree', 'telauser', 'criarpost'];

    // Mostrar ou esconder o Drawer com base na tela atual
    setShowDrawer(!hiddenDrawerScreens.includes(currentRoute));
  }, [navigation]);

  const handleLogout = async () => {
    try {
      await Parse.User.logOut();
      console.log('Usuário deslogado');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {showDrawer && (
        <Drawer
          screenOptions={{
            drawerStyle: {
              backgroundColor: '#f4f4f4',
              width: 250,
            },
            headerStyle: {
              backgroundColor: '#56a4d9',
            },
            headerTintColor: '#fff',
          }}
        >
          <Drawer.Screen
            name="Home"
            options={{
              drawerLabel: 'Home',
              title: 'Visão Geral',
            }}
          />
          <Drawer.Screen
            name="Perfil"
            options={{
              drawerLabel: 'Perfil',
              title: 'Meu Perfil',
            }}
          />
          {/* Telas ocultas no menu */}
          <Drawer.Screen
            name="cadastro"
            options={{
              drawerItemStyle: { display: 'none' },
            }}
          />
          <Drawer.Screen
            name="login"
            options={{
              drawerItemStyle: { display: 'none' },
            }}
          />
          <Drawer.Screen
            name="esquecisenha"
            options={{
              drawerItemStyle: { display: 'none' },
            }}
          />
          <Drawer.Screen
            name="telafree"
            options={{
              drawerItemStyle: { display: 'none' },
            }}
          />
          <Drawer.Screen
            name="telauser"
            options={{
              drawerItemStyle: { display: 'none' },
            }}
          />
          <Drawer.Screen
            name="criarpost"
            options={{
              drawerItemStyle: { display: 'none' },
            }}
          />
          
          {/* Botão de Logout */}
          <Drawer.Screen
            name="logout"
            options={{
              drawerLabel: () => (
                <View style={{ padding: 10 }}>
                  <Button title="Logout" onPress={handleLogout} color="#FF3B30" />
                </View>
              ),
              drawerItemStyle: { marginTop: 'auto' },
            }}
          />
        </Drawer>
      )}
    </GestureHandlerRootView>
  );
}
