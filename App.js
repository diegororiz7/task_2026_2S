//Importações de navegações e telas
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

//Importação de Páginas
import Task from './pages/task_page';
import AddEdit from './pages/add_edit_page';
import { title } from 'node:process';

//Definição do Stack
const Stack = createStackNavigator();

//Função principal e tela principal
export default function App(){
  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Task'>
        <Stack.Screen
          name = 'Task'
          component = {Task}
          options = {{
            title: 'Lista de Tarefas',
            headerTintColor: '#FFF',
            headerStyle:{
              backgroundColor: '#007BFF'
            }
          }}
        />

        <Stack.Screen
          name = 'AddEdit'
          component = {AddEdit}
          options = {({route}) => ({
            title: route?.params?.id ? 'Editar Tarefa' : 'Adicionar Tarefa',
            headerTintColor: '#FFF',
            headerStyle:{
              backgroundColor: '#007BFF'
            }
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}