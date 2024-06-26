import React, { useCallback, useState } from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, CardProps } from '../../components/card';
import { AspectRatio, FlatList, Image, Input } from 'native-base';
import { useFocusEffect} from '@react-navigation/native'
import coverImg from "../../assets/street.jpg";
type Props = {
  navigation: any
}

export const Home = ({ navigation }: Props) => {
  const [data, setData] = useState<CardProps[]>([]);

  useFocusEffect(useCallback(() => {
    handleFetchData()
  },[]))

  function handleEdit(id: string){
    navigation.navigate('Usuario', { id: id})
  }
  async function handleFetchData() {
    try{
      const jsonValue = await AsyncStorage.getItem('@crud_form:usuario')
      const data =jsonValue ? JSON.parse(jsonValue) : [];
      setData(data);
      return jsonValue
    }catch(error){
      console.log(error);
    }  
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image style={styles.img}source={coverImg} alt="coverimg" />
        <Input  placeholder='Pesquisar'>
        </Input>
      </View>
        
        <FlatList
          data={data}
          keyExtractor={item=>item.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          renderItem={({item})  =>
          <Card
            data={item}
            onPress={() => handleEdit(item.id)}
          />
        }
        />
    </View>
  );
}
