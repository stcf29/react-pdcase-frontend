import './style.css'
import Thrash from '../../assets/red-trash.svg'
import api from '../../services/api'
import React, { useEffect, useState, useRef} from 'react'
import ReactDOM from 'react-dom';
import { Link, useNavigate} from 'react-router-dom';
import { BrowserRouter, Route, Routes} from "react-router-dom"


//JS
function Home() {
  
  const inputNome  = useRef();
  const inputCarteira = useRef();
  const inputPlano  = useRef();
  const inputEspecialidade = useRef();

  const [users, setUsers] = useState([]);

  async function getUsers(){
    const usersAPi = await api.get('/pacientes')
    setUsers(usersAPi.data)
  }

  useEffect(() =>{
    getUsers()
  }, [])

  //método POST
  async function createUsers() {
    await api.post('/pacientes',{
      nome: inputNome.current.value,
      carteira: inputCarteira.current.value,
      plano: inputPlano.current.value,
      especialidade: inputEspecialidade.current.value
    });
    
    //quando insere o paciente novo, precisa atualizar a pagina, o getusers faz isso
    getUsers()
  }

  //método DELETE
  async function deleteUsers(id){
    await api.delete(`/pacientes/${id}`)
    getUsers()
  }

  const [busca, setBusca] = React.useState("");
  const buscaLowerCase = busca.toLowerCase();
  const usersFiltrados = users.filter((user) => user.nome.toLowerCase().includes(buscaLowerCase));

  //HTML
  return (
    <div className='container'>
      <form action="">
        <h1>Cadastro de Pacientes</h1>
        <input placeholder='Nome' name='nome' type="text" ref={inputNome}/>
        <input placeholder='Carteira' name='carteira' type="number" ref={inputCarteira}/>
        <input placeholder='Plano' name='plano' type="text" ref={inputPlano}/>
        <input placeholder='Especialidade' name='especialidade' type="text"ref={inputEspecialidade} />
        <button type='button' onClick={createUsers}>Cadastrar</button>
      </form>

      <p className='titulocard'>Pacientes cadastrados</p>

      <input placeholder='Pesquisar por nome' value={busca} 
      name='search' type="search" className='search' 
      onChange={(ev => setBusca(ev.target.value))}/>

      {usersFiltrados.map((user => (   
        <div key={user.id} className='card'>
          <div>
            <p>Nome: <span>{user.nome}</span></p>
            <p>N carteira: <span>{user.carteira}</span></p>
            <p>Plano: <span>{user.plano}</span></p>
            <p>Especialidade: <span>{user.especialidade}</span></p>
          </div>
            
          <button onClick={() => deleteUsers(user.id)}>
            <img className='thrash' src={Thrash} alt="thrash" />
          </button>
        </div>

      )))}
    </div>


  )
}

export default Home
