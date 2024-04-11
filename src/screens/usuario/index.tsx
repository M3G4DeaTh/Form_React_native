import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Center,  HStack,  Heading, Modal, VStack } from "native-base";
import { Input } from '../../components/input/Input';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from '../../components/button/Button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from 'react-native-tiny-toast';
import uuid from 'react-native-uuid';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootTabParamList } from '../../router';
import {ActivityIndicator} from 'react-native'
import { ExcluirItemDialog } from '../../components/dialog';

type FormDataProps = {
  id: any
  nome:string;
  email:string;
  senha:string;
  confirmaSenha: string;
}

const schemaRegister = yup.object({
  nome: yup.string().required("Nome é obrigatório").min(3, "Informe no minimo 3 digitos"),
  email: yup.string().required("Email é obrigatório").min(6, "Informe no minimo 6 digitos").email("E-mail informado não é valido"),
  senha: yup.string().required("Senha é obrigatório").min(3, "Informe no minimo 3 digitos"),
  confirmaSenha: yup.string()
    .required("Confirmação de senha é obrigatório")
    .oneOf([yup.ref('senha')], "As senha devem coindir"),
})
type UsuarioRouteProp = BottomTabScreenProps<RootTabParamList, 'Usuario'>;
export const Usuario = ({route, navigation}: UsuarioRouteProp) => {

  const {control, handleSubmit, reset, setValue, formState: {errors}}  = useForm<FormDataProps>({
      resolver: yupResolver(schemaRegister) as any
  });
  const[loading, setLoading] = useState(true);
  const isEditing = !!route?.params?.id;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [searcheID, setSearchID] = useState(false);

  useEffect(()=> {
    if(isEditing){
      handlerSearcher(route.params.id)
    }
    else{
      reset();
      setLoading(false);
      setSearchID(false);
    }
    return ()=> setLoading(true);
  }, [route, isEditing])
  useEffect(() =>{
    if(route?.params?.id) handlerSearcher(route?.params?.id)
    else{
      reset();
      setLoading(false);
    }
    return ()=> setLoading(true);
  }, [route])

  async function handlerRegister(data:FormDataProps){
    data.id = uuid.v4().toString();
    //console.log(data);
    try{
      const reponseData =  await AsyncStorage.getItem('@crud_form:usuario')
      const dbData = reponseData ? JSON.parse(reponseData!) : [];
      console.log(dbData);
      const previewData = [...dbData, data];

      await AsyncStorage.setItem('@crud_form:usuario', JSON.stringify(previewData))
      reset();
      handleList();
      Toast.showSuccess("Usuário registrado com sucesso")
    }catch (e){
      Toast.showSuccess("Erro ao registrar usuário "+e)
    }


  }

  async function handlerSearcher(id:string) {
    try{
      setLoading(true)
      const responseData = await AsyncStorage.getItem('@crud_form:usuario')
      const dbData: FormDataProps[] = responseData? JSON.parse(responseData): [];
      const itemEncontrado = dbData?.find(item => item.id === id)
      if(itemEncontrado){
        Object.keys(itemEncontrado).forEach((key)=> setValue(
          key as keyof FormDataProps,
        itemEncontrado?.[key as keyof FormDataProps] as string)
      );setSearchID(true);
      }
      setLoading(false);
    }catch(e){
      console.log(e)
      setSearchID(false);
    }
  }
  async function handlerAlterRegister(data:FormDataProps) {
    try{
      const responseData = await AsyncStorage.getItem('@crud_form:usuario')
      const dbData: FormDataProps[] = responseData? JSON.parse(responseData): [];
      const indexRemove = dbData?.findIndex(item => item.id === data.id)
      if(indexRemove !== -1){
        dbData.splice(indexRemove, 1);
        const previewData = [...dbData, data];
        await AsyncStorage.setItem('@crud_form:usuario', JSON.stringify(previewData))
        Toast.showSuccess("Usuario alterado com sucesso");
        setLoading(false);
        setSearchID(false);
        reset();
        handleList();
      }else{
        Toast.show("Registro não localizado")
      }
      setLoading(true)
    }catch(e){
      setLoading(false);
      console.log(e)
    }
  }
  function handleList() {
    navigation.navigate('Home');
  }
  async function handleDelete(data:FormDataProps) {
    try{
      setLoading(true)
      const responseData = await AsyncStorage.getItem('@crud_form:usuario')
      const dbData: FormDataProps[] = responseData? JSON.parse(responseData): [];
      const indexRemove = dbData?.findIndex(item => item.id === data.id)
      if(indexRemove !== -1){
        dbData.splice(indexRemove, 1);
        await AsyncStorage.setItem('@crud_form:usuario', JSON.stringify(dbData))
        Toast.showSuccess("Usuario excluido com sucesso");
        setLoading(false);
        setShowDeleteDialog(false);
        setSearchID(false);
        reset();
        handleList();
      }else{
        Toast.show("Registro não localizado")
      }
    }catch(e){

    }
  }

  if(loading) return <ActivityIndicator size="large" color="#000fff"/>
  return (
    <KeyboardAwareScrollView>
    <VStack bgColor="gray.300" flex={1} px={5} pb={100}>
        <Center>
            <Heading my={5}>
                Cadastro de Usuários
            </Heading>
          <Controller 
            control={control}
            name="nome"
            defaultValue=''
            render={({field: {onChange, value}})=>(
            <Input
              placeholder='Nome'
              onChangeText={onChange}
              errorMessage={errors.nome?.message}
              value={value}
            />
            )}
          />
          <Controller 
            control={control}
            name="email"
            defaultValue=''
            render={({field: {onChange, value}})=>(
            <Input
              placeholder='E-mail'
              onChangeText={onChange}
              errorMessage={errors.email?.message}
              value={value}
            />
            )}
          />
          <Controller 
            control={control}
            name="senha"
            defaultValue=''
            render={({field: {onChange, value}})=>(
            <Input
              placeholder='Senha'
              onChangeText={onChange}
              secureTextEntry
              errorMessage={errors.senha?.message}
              value={value}
            />
            )}
          />
          <Controller 
            control={control}
            name="confirmaSenha"
            defaultValue=''
            render={({field: {onChange, value}})=>(
            <Input
              placeholder='Confirma Senha'
              onChangeText={onChange}
              secureTextEntry
              errorMessage={errors.confirmaSenha?.message}
              value={value}
            />
            )}
          />
          {searcheID ? (
            <VStack>
            <HStack>
              <Button rounded="md" shadow={3} title='Alterar' color='#F48B20' onPress={handleSubmit(handlerAlterRegister)} />
            </HStack>
            <HStack paddingTop={5}>
              <Button rounded="md" shadow={3} title='Excluir' color='#CC0707' onPress={() => setShowDeleteDialog(true)} />
            </HStack>
            </VStack>
          ) : (
            <Button title='Cadastrar' color='green.700' onPress={handleSubmit(handlerRegister)} />
          )}
        </Center>
      </VStack>
      <Modal isOpen={showDeleteDialog} onClose={()=> setShowDeleteDialog(false)}>
        <ExcluirItemDialog
        isVisible = {showDeleteDialog}
        onCancel={()=> setShowDeleteDialog(false)}
        onConfirm={handleSubmit(handleDelete)}
        />
      </Modal>
    </KeyboardAwareScrollView>
      
  );
}

