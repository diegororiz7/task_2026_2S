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

    return(
        <View style = {styles.container}>
            
        </View>
    );
}