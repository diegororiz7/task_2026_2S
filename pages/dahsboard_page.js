//Importações de componentes e navegação
import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import database from '../config/firebase_config';

export default function({navigation}){

    //Variáveis iniciais
    const [task, setTask] = useState([]);

    //Carregar as informações do banco de dados (Firebase)
    useEffect(() => {
        const unsubscribe = database.collection('Tasks')
                                .onSnapshot((snapshot) => {
                                    const list = [];

                                    snapshot.forEach((doc) => {
                                        list.push({...doc.data(), id: doc.id});
                                    });

                                    setTask(list);
                                });
        return () => unsubscribe();
    },[]);

    //Indicadores a serem apresentados
    const total = task.length;

    const completed = task.filter(t => t.finished).length;

    const pending = task.filter(t => !t.finished).length;

    //Função para buscar data
    function getDate(date){
        if(!date) return null;

        return date.toDate ? date.toDate() : new Date(date);
    }

    //Função para tarefas atrasadas
    function isOverdue(task){
        if(task.finished) return false;

        const date = getDate(task.date);

        const today = new Date();
        today.setHours(0,0,0,0);

        date.setHours(0,0,0,0);

        return date < today;
    }

    const overdue = (isOverdue).length;

    //Cálculo de porcentagem
    const percentage = total > 0 ?
        Math.round((completed / total) * 100) : 0;

    //Função do card
    function Card({title, value, color}){
        return(
            <View style = {{
                width: '47%',
                backgroundColor: '#FFF',
                padding: 15,
                borderRadius: 10,
                marginBottom: 12,
                borderLeftWidth: 5,
                borderLeftColor: color
            }}>
                <Text style = {{color: '#666', fontSize: 14}}>
                    {title}
                </Text>

                <Text style = {{
                    fontSize: 28,
                    fontWeight: 'bold',
                    color: color,
                    marginTop: 5
                }}>
                    {value}
                </Text>
            </View>
        );
    }

    return(
        //Apresentação do dashboard
        <ScrollView style = {{
            flex: 1,
            backgroundColor: '#F2F4F7',
            padding: 15
        }}>
            <Text style = {{
                fontSize: 23,
                fontWeight: 'bold',
                marginBottom: 5
            }}>
                Olá! Bem-vindo ao App Tasks!
            </Text>

            <Text style = {{
                color: '#666',
                marginBottom: 20
            }}>
                Confira o resumo das suas tarefas!
            </Text>

            <TouchableOpacity
                style = {{
                    backgroundColor: '#007BFF',
                    padding: 15,
                    borderRadius: 8,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                onPress = {() => navigation.navigate('Task')}
                >
                    <Text style = {{
                        color: '#FFF',
                        fontWeight: 'bold',
                        fontSize: 16
                    }}>
                        Visualizar lista de tarefas
                    </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}