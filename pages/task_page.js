//Importações dos componentes e Firebase
import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, TouchableOpacity,
        Modal, Switch, Alert, FlatList
} from 'react-native';
import database from '../config/firebase_config';
import {Picker} from '@react-native-picker/picker';
import { FontAwesome } from '@expo/vector-icons';
import styles from '../styles/styles_task';

//Função principal (Listar, ordenar, buscar e manipular)
export default function({navigation}){

    //Variáveis iniciais
    const [task, setTask] = useState([]);
    const [showDeleteMotal, setShowDeleteModal] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [hideFinished, setHideFinished] = useState(false);
    const [filteredTask, setFilteredTask] = useState([]);
    const [sortOption, setSortOption] = useState('priority');
    const [searchText, setSeacrhText] = useState('');

    //Função para alterar o status da tarefa
    function toggleTaskStatus(id, currentStatus){
        database.collection('Tasks').doc(id).update({
            finished: !currentStatus
        })
    }

    //Função para confirmar a exclusão da tarefa
    function confirmDeleteTask(id){
        setTaskToDelete(id);
        setShowDeleteModal(true);
    }

    //Função para cancelar a exclusão da tarefa
    function cancelDelete(){
        setShowDeleteModal(false);
    }

    //Função para excluir a tarefa
    function deleteTask(){
        if(taskToDelete){
            database.collection('Tasks').doc(taskToDelete).delete();
            setTask(prevTask => prevTask.filter(
                task => task.id !== taskToDelete
            ))
            setShowDeleteModal(false);
        }
    }

    //Função para formata a data
    function formatDate(dateString){
        const date = dateString instanceof Date ?
            dateString :
                new Date(dateString.toDate ?
                    dateString.toDate() : dateString);
        return date.toISOString().split('T')[0].split('-').reverse().join('/');
    }

    //Função para atribuir cor das prioridades
    function getPriorityColor(priority){
        switch(priority){
            case 'Urgente': return '#D32F2F';
            case 'Alta': return '#F75C00';
            case 'Média': return '#F8C02B';
            case 'Baixa': return '#6B8E23';
            default: return '#000';
        }
    }

    //Função para comparar e classificar as tarefas
    function compareTasks(a,b){
        if(sortOption == 'date'){
            const dateA = new Date(a.date.toDate ? a.date.toDate() :  a.date);
            const dateB = new Date(b.date.toDate ? b.date.toDate() :  b.date);
            return dateA - dateB;
        }else if(sortOption == 'priority'){
            const priorityOrder = {
                'Urgente': 1,
                'Alta': 2,
                'Média': 3,
                'Baixa': 4
            }
            return (priorityOrder[a.priority] || 5) - (priorityOrder[b.priority] || 5);
        }
        return 0;
    }

    //Função de contagem de likes
    function handleLike(id, currentLikes){
        database.collection('Tasks').doc(id).update({
            likes: (currentLikes || 0) + 1
        })
    }

    //Função de contagem de deslikes
    function handleDeslike(id, currentDeslikes){
        database.collection('Tasks').doc(id).update({
            deslikes: (currentDeslikes || 0) + 1
        })
    }

    //Função para buscar informações do Firebase
    useEffect(() => {
        const unsubscibe = database.collection('Tasks')
                            .onSnapshot((QuerySnapshot) => {
                                const list = [];
                                QuerySnapshot.forEach((doc) => {
                                    list.push({...doc.data(), id: doc.id})
                                })
                                setTask(list);
                            })
                            return () => unsubscibe();
    },[]);

    //Função para filtrar e ordenar
    useEffect(() => {
        const filtered = task.filter((t) => {
            const matchStatus = hideFinished ? !t.finished : true;
            const matchSearch = t.description.toLowerCase().includes(
                searchText.toLowerCase()
            );
            return matchStatus && matchSearch;
        });
        const sorted = [...filtered].sort(compareTasks);
        setFilteredTask(sorted);
    },[task, hideFinished, searchText, sortOption]);

    return(
        <View style = {{flex: 1}}>
            {/*Ocultar tarefas finalizadas*/}
            <View style = {{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 15,
                marginBottom: 10,
                marginRight: 10
            }}>

            </View>
        </View>
    );
}
