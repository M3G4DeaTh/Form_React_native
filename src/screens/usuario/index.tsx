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
import {ActivityIndicator, TouchableOpacity} from 'react-native'
import { ExcluirItemDialog } from '../../components/dialog';
import { CepController } from '../../components/cep/Controller/CepController';
import CepModel from '../../components/cep/Model/CepModel';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './styles';

type FormDataProps = {
  id: any
  nome:string;
  sobrenome:string;
  email:string;
  cep:string;
  rua:string;
  numero:string;
  bairro: string;
  cidade: string;
  estado: string;
}

const schemaRegister = yup.object({
  nome: yup.string().required("Nome é obrigatório").min(3, "Informe no minimo 3 digitos"),
  sobrenome: yup.string().required("sobrenome é obrigatório").min(3, "Informe no minimo 3 digitos"),
  email: yup.string().required("Email é obrigatório").min(6, "Informe no minimo 6 digitos").email("E-mail informado não é valido"),
  cep: yup.string().required("Cep é obrigatorio").min(8,"Infome no minimo 8 digitos"),
  rua: yup.string(),
  numero: yup.string(),
  bairro: yup.string(),
  cidade: yup.string(),
  estado: yup.string()
})
type UsuarioRouteProp = BottomTabScreenProps<RootTabParamList, 'Usuario'>;
export const Usuario = ({route, navigation}: UsuarioRouteProp) => {

  const {control, handleSubmit, reset, setValue, formState: {errors}}  = useForm<FormDataProps>({
      resolver: yupResolver(schemaRegister) as any
  });
  const[loading, setLoading] = useState(true);
  const[adress0, setAdress0] = useState('none');
  const[adress1, setAdress1] = useState('none');
  const[adress2, setAdress2] = useState('none');
  const[adress3, setAdress3] = useState('none');
  const[idC, setId] = useState('none');
  const [ceps, setCeps] = useState<CepModel[]>([]);
  const isEditing = !!route?.params?.id;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [searcheID, setSearchID] = useState(false);

  useEffect(()=> {
    if(isEditing){
      handlerSearcher(route.params.id)
    }
    else{
      reset();
      setAdress0('none')
      setAdress1('none')
      setAdress2('none')
      setAdress3('none')
      setLoading(false);
      setSearchID(false);
    }
    return ()=> setLoading(true);
  }, [route, isEditing])
  useEffect(() =>{
    if(route?.params?.id) handlerSearcher(route?.params?.id)
    else{
      reset();
      setAdress0('none')
      setAdress1('none')
      setAdress2('none')
      setAdress3('none')
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
        setId(id)
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
  async function handlerCep(data:FormDataProps) {
    const handlerSeacherCep= async (cep: string)=>{
      try{
          setLoading(true);
          await CepController.fetchCep(cep);
          const newCeps = [...CepController.getCeps()];
          setCeps(newCeps)
      }catch(error){
          console.error('Erro fetching data:', error)
      }finally{
          setLoading(false);
      }
    }
    data.id = uuid.v4().toString();
    
    try{
      // setLoading(true)
      const cep = data.cep
      const responseCep = handlerSeacherCep(cep)

      
      if (idC != 'none'){
        data.id = idC
      }
      else{
        setId(data.id)
      }
      setAdress0(ceps[ceps.length-1].logradouro)
      setAdress1(ceps[ceps.length-1].bairro)
      setAdress2(ceps[ceps.length-1].localidade)
      setAdress3(ceps[ceps.length-1].uf)
      data.bairro = adress1
      data.cidade = adress2
      data.estado = adress3
      data.rua = adress0
      


    }catch(e){
      console.log(e)

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
    reset();
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
            name="sobrenome"
            defaultValue=''
            render={({field: {onChange, value}})=>(
            <Input
              placeholder='Sobrenome'
              onChangeText={onChange}
              errorMessage={errors.sobrenome?.message}
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
            name="cep"
            defaultValue=''
            render={({field: {onChange, value}})=>(
            <Input
              placeholder='Cep'
              onChangeText={onChange}
              errorMessage={errors.cep?.message}
              value={value}
            />
            )}
          />
          {/* <Button title='Buscar' color='green.700' onPress={} /> */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit(handlerCep)}
          >
            <MaterialIcons
              name="search"
              size={22}
              color="#888D97"
            />
          </TouchableOpacity>
          {searcheID ? (
            <Controller 
            control={control}
            name="rua"
            defaultValue=''
            render={({field: {onChange, value}})=>(
              <Input
                placeholder='Rua'
                onChangeText={onChange}
                
                errorMessage={errors.rua?.message}
                
                value={value}
              />
            )}
            />
          ):(
            <Controller 
            control={control}
            name="rua"
            defaultValue={adress0}
            render={({field: {onChange, value}})=>(
              <Input
                placeholder={adress0}
                onChangeText={onChange}
                editable={false}
                errorMessage={errors.rua?.message}
                value={value = adress0}
                
              />
            )}
            />
          )}
          
          <Controller 
            control={control}
            name="numero"
            defaultValue=''
            render={({field: {onChange, value}})=>(
              <Input
                placeholder='Numero'
                onChangeText={onChange}
                
                errorMessage={errors.numero?.message}
                value={value}
              />
            )}
          />
          {searcheID ? (
            <Controller 
            control={control}
            name="bairro"
            defaultValue=''
            render={({field: {onChange, value}})=>(
              <Input
                placeholder='Bairro'
                onChangeText={onChange}
                
                errorMessage={errors.bairro?.message}
                value={value}
              />
            )}
            />
          ):(
            <Controller 
            control={control}
            name="bairro"
            defaultValue={adress1}
            render={({field: {onChange, value}})=>(
              <Input
                placeholder={adress1}
                onChangeText={onChange}
                editable={false}
                errorMessage={errors.bairro?.message}
                value={value = adress1}
              />
            )}
            />
          )}
          {searcheID ?(
            <Controller 
            control={control}
            name="cidade"
            defaultValue=''
            render={({field: {onChange, value}})=>(
            <Input
              placeholder='Cidade'
              onChangeText={onChange}
              
              errorMessage={errors.cidade?.message}
              value={value}
            />
            )}
          />
          ):(
            <Controller 
            control={control}
            name="cidade"
            defaultValue={adress2}
            render={({field: {onChange, value}})=>(
            <Input
              placeholder={adress2}
              onChangeText={onChange}
              editable={false}
              errorMessage={errors.cidade?.message}
              value={value = adress2}
            />
            )}
          />
          )}
          {searcheID ? (
            <Controller 
            control={control}
            name="estado"
            defaultValue=''
            render={({field: {onChange, value}})=>(
            <Input
              placeholder='Estado'
              onChangeText={onChange}
              
              errorMessage={errors.estado?.message}
              value={value}
            />
            )}
          />
          ):(
            <Controller 
            control={control}
            name="estado"
            defaultValue={adress3}
            render={({field: {onChange, value }})=>(
            <Input
              placeholder={adress3}
              onChangeText={onChange}
              editable={false}
              errorMessage={errors.estado?.message}
              value={value = adress3}
            />
            )}
          />
          )}
          
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

