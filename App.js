//Importações de navegações e telas
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

//Importação de Páginas
import Task from './pages/task_page';
import AddEdit from './pages/add_edit_page';

//Definição do Stack
const Stack = createStackNavigator();

//Função principal e tela principal
export default function App(){
  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Task'>
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}