import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { styles } from './styles';

export type CardProps = {
    id: any;
    nome: string;
    sobrenome:string;
    email:string;
    cep:string;
    rua:string;
    numero:string;
    bairro: string;
    cidade: string;
    estado: string;
}
type Props = {
  data: CardProps;
  onPress: () => void;
}

export function Card({ data, onPress }: Props) {

//console.log(data.nome)
  


  return (
    <View style={styles.container}>


      <View style={styles.content}>
        <View>
          <Text style={styles.nome}>
            {data.nome}
            
          </Text>
          <Text style={styles.estado}>
            {data.estado}
          </Text>

        </View>
      </View>
      <View style={styles.content}>
        <View>
        <Text style={styles.cep}>
            {data.cep}
          </Text>
          <Text style={styles.cidade}>
            {data.cidade}
          </Text>

        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
      >
        <MaterialIcons
          name="edit"
          size={22}
          color="#888D97"
        />
      </TouchableOpacity>
    </View>
  );
}