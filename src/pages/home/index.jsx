import './style.css'
import Thrash from '../../assets/red-trash.svg'
import api from '../../services/api'
import React, { useEffect, useState, useRef} from 'react'
import ReactDOM from 'react-dom';
import { Link, useNavigate} from 'react-router-dom';
import { BrowserRouter, Route, Routes} from "react-router-dom"
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//JS
function Home() {
  
  const inputNome  = useRef();
  const inputCarteira = useRef();
  const inputPlano  = useRef();
  const inputEspecialidade = useRef();

  const [users, setUsers] = useState([]);

  const [message, setMessage] = useState('');

  async function getUsers(){
    const usersAPi = await api.get('/pacientes')
    setUsers(usersAPi.data)
  }
  //método para atualizar os pacientes após cadastrar ou apagar, ou quando entrar na pag
  useEffect(() =>{
    getUsers()
  }, [])

  //método POST
  async function createUsers() {
    try {
      
      const response = await api.post('/pacientes', {
        nome: inputNome.current.value,
        carteira: inputCarteira.current.value,
        plano: inputPlano.current.value,
        especialidade: inputEspecialidade.current.value
      });
      toast.success(response.data.message);
  
      // Atualiza a lista de pacientes
      getUsers();
  
    } catch (error) {
      if (error.response && error.response.data.message) {

        toast.error(`Erro: ${error.response.data.message}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.error('Erro ao cadastrar o paciente. Tente novamente.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
  }
}

  //método DELETE
  async function deleteUsers(id){
    await api.delete(`/pacientes/${id}`)
    toast.success('Paciente deletado com sucesso!')
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

      <ToastContainer></ToastContainer>

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
