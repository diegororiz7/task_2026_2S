//Importações dos componentes e Firebase
import React, {useState} from 'react';
import {View, Text, TextInput, Alert,
        TouchableOpacity, Platform
} from 'react-native';
import database from '../config/firebase_config';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from '../styles/styles_add_edit';

//Função principal (Criar e Editar tarefa)
export default function AddEdit({navigation, route}){

    //Verificar se é edição ou inclusão
    const isEdit = route?.params?.id ? true : false;

    //Variáveis a serem manipuladas
    const [description, setDescription] = useState(route?.params?.description || '');
    const [priority, setPriority] = useState(route?.params?.priority || 'Média');

    //Manipulação inicial data
    const initialDate = 
        route?.params?.date?.toDate
        ? route.params.date.toDate()
        : route?.params?.date
        ? new Date(route.params.date)
        : new Date();
    
    //Variáveis a serem manipuladas
    const [date, setDate] = useState(initialDate);
    const [showDatePicker, setShowDatePicker] = useState(false);

    //Função para validar os inputs
    const validateInputs = () => {
        if(!description.trim()){
            Platform.OS === 'web'
            ? window.alert('Informe a descrição da tarefa!')
            : Alert.alert('Erro', 'Informe a descrição da terefa!');
            return false;
        }

        if(!priority.trim()){
            Alert.alert('Selecione a prioridade da tarefa!');
            return false;
        }

        if(!date){
            Alert.alert('Selecione a data da tarefa!');
            return false;
        }

        return true;
    }

    //Função única para salvar/editar a tarefa
    const handleSave = () => {
        if(!validateInputs()) return;

        const taskDate = new Date(date);
        taskDate.setHours(0,0,0,0);

        if(isEdit){
            //Editando tarefa
            database.collection('Tasks').doc(route.params.id).update({
                description: description,
                priority: priority,
                date: taskDate
            })
        }else{
            //Adicionando tarefa
            database.collection('Tasks').add({
                description: description,
                priority: priority,
                date: taskDate,
                finished: false
            })
        }

        navigation.navigate('Task');
    }

    //Função para selecionar data (web)
    const handleWebDateChange = (e) => {
        const [year, month, day] = e.target.value.split('-').map(Number);
        const newDate = new Date(year, month - 1, day);
        setDate(newDate);
    }

    //Função para selecionar data (mobile)
    const onDateChange = (event, selectedDate) => {
        if(selectedDate){
            setDate(selectedDate);
        }

        setShowDatePicker(false);
    }

    return(
        <View style = {styles.container}>
            <Text style = {styles.label}>Descrição</Text>

            <TextInput
                value = {description}
                onChangeText = {setDescription}
                style = {styles.inputText}
                placeholder = 'Informe a tarefa (Ex.: Estudar React Native)'
            />

            <Text style={styles.label}>Prioridade</Text>

            <Picker
                style = {styles.inputText}
                value = {priority}
                onValueChange = {(itemValue) => setPriority(itemValue)}
            >
                <Picker.Item label = 'Urgente' value = 'Urgente'/>
                <Picker.Item label = 'Alta' value = 'Alta'/>
                <Picker.Item label = 'Média' value = 'Média'/>
                <Picker.Item label = 'Baixa' value = 'Baixa'/>
            </Picker>

            <Text style = {styles.label}>Data</Text>
            {/*Verificar se é Web ou Mobile*/}
            {Platform.OS === 'web' ? (
                <input
                    type = 'date'
                    value = {date.toISOString().split('T')[0]}
                    onChange = {handleWebDateChange}
                    onKeyDown = {(e) => e.preventDefault()}    
                    min = '2025-01-01'
                    max = '2030-12-31'
                    style = {{
                        width: '90%',
                        marginTop: 10,
                        padding: 10,
                        borderBottomColor: '#007BFF',
                        border: 'none',
                        borderBottom: '1 px solid #007BFF',
                        outline: 'none',
                        fontSize: 16,
                        boxSizing: 'border-box',
                        marginLeft: 'auto',
                        marginRight: 'auto'
                    }}                
                />
            ) : (
                <>
                    <TouchableOpacity
                        onPress = {() => setShowDatePicker(true)}
                        style = {{
                            ...styles.inputText,
                            justifyContent: 'center',
                            paddingHorizontal: 10
                        }}
                    >
                        <Text>{date.toLocaleDateString()}</Text>
                    </TouchableOpacity>

                    {showDatePicker && 
                        <DateTimePicker
                            value = {date}
                            mode = 'date'
                            display = 'default'
                            minimumDate = {new Date('2025-01-01')}
                            maximumDate = {new Date('2030-12-31')}
                            onChange = {onDateChange}
                        />
                    }
                </>
            )}
        </View>
    );
}