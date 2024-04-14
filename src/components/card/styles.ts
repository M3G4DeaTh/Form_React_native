import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    height: 80,
    width: '100%',
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#E3E3E3',
    borderWidth: 1,
    paddingLeft: 22,
    marginBottom: 8,
    borderRadius: 4
  },
  content: {
    flex: 1,
    padding: 22,
  },
  nome: {
    fontSize: 15,
    lineHeight: 18,
    color: '#3D434D',
    fontWeight: 'bold',
  },
  sobrenome: {
    fontSize: 15,
    lineHeight: 18,
    color: '#3D434D',
    fontWeight: 'bold',
    
  },
  email: {
    color: '#888D97',
    fontSize: 13,
  },
  cep: {
    fontSize: 13,
    color: '#3D434D',
    
  },
  estado: {
    fontSize: 13,
    color: '#3D434D',
    
  },
  rua: {
    fontSize: 13,
    color: '#3D434D'
    
  },
  cidade: {
    fontSize: 13,
    color: '#3D434D',
    
  },
  numero: {
    fontSize: 13,
    color: '#3D434D',
    
  },
  user: {
    color: '#888D97',
    fontSize: 13,
  },
  button: {
    height: 80,
    width: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#E3E3E3',
  }
});
