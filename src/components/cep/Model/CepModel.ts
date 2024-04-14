export default class CepModel{
    cep: string;
    logradouro: string;
    bairro: string;
    localidade: string;
    uf: string;

    constructor(
    cep: string,
    logradouro: string,
    bairro: string,
    localidade: string,
    uf: string,
    ){
        this.cep = cep;
        this.logradouro = logradouro;
        this.bairro = bairro;
        this.localidade = localidade;
        this.uf = uf;
    }
}
