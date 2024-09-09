import './style.css'
import Thrash from '../../assets/red-trash.svg'
import api from '../../services/api'
import React, { useEffect, useState, useRef} from 'react'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//JS
function Home() {
  const inputNome  = useRef();
  const inputCarteira = useRef();
  const inputPlano  = useRef();
  const inputEspecialidade = useRef();
  const [users, setUsers] = useState([]); // Estado para armazenar users(pacientes)
  const [selectedUser, setSelectedUser] = useState(null);
  const [busca, setBusca] = useState("");
  const [especialidades, setEspecialidades] = useState([]); // Estado para armazenar especialidades
  const [planos, setPlanos] = useState([]); // Estado para armazenar planos
  const [selectedEspecialidade, setSelectedEspecialidade] = useState('');
  const [selectedPlano, setSelectedPlano] = useState('');
  
  async function getUsers(){
    const usersAPi = await api.get('/pacientes')
    setUsers(usersAPi.data)
  }

  useEffect(() =>{
    async function fetchData() {
      try {
        const especialidadesResponse = await api.get('/especialidades');
        setEspecialidades(especialidadesResponse.data);

        const planosResponse = await api.get('/planos');
        setPlanos(planosResponse.data);
      } catch (error) {
        toast.error('Erro ao carregar especialidades e planos.');
      }
    }
    fetchData(); 
    getUsers()
  }, [])

  async function createUsers() {
    try {
      const response = await api.post('/pacientes', {
        nome: inputNome.current.value,
        carteira: inputCarteira.current.value,
        plano: selectedPlano,
        especialidade: selectedEspecialidade
      });
      toast.success(response.data.message);
      getUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao cadastrar o paciente.');
    }
  }
  //método para atualizar o paciente
  async function updateUser() {
    if (!selectedUser) return;

    try {
      //no selecteduser, ele pega pelo id do user selecionado
      const response = await api.put(`/pacientes/${selectedUser.id}`, {
        nome: inputNome.current.value,
        carteira: inputCarteira.current.value,
        plano: selectedPlano,
        especialidade: selectedEspecialidade
      });
      toast.success('Paciente atualizado com sucesso!');
      setSelectedUser(null); // Reseta o formulário após editar
      getUsers();
    } catch (error) {
      toast.error('Erro ao atualizar o paciente.');
    }
  }

  // Preenche o formulário com os dados do paciente selecionado para edição
  function handleEdit(user) {
    setSelectedUser(user); // Armazena o paciente que está sendo editado
    inputNome.current.value = user.nome;
    inputCarteira.current.value = user.carteira;
    inputPlano.current.value = user.plano;
    inputEspecialidade.current.value = user.especialidade;
  }

  // Método DELETE para remover um paciente
  async function deleteUsers(id){
    await api.delete(`/pacientes/${id}`);
    toast.success('Paciente deletado com sucesso!');
    getUsers();
  }

  const buscaLowerCase = busca.toLowerCase();
  const usersFiltrados = users.filter((user) => user.nome.toLowerCase().includes(buscaLowerCase));

  return (
    <div className='container'>
      <form action="">
        <h1>{selectedUser ? 'Editar Paciente' : 'Cadastro de Pacientes'}</h1>
        <input placeholder='Nome' name='nome' type="text" ref={inputNome}/>
        <input placeholder='Carteira' name='carteira' type="number" ref={inputCarteira}/>
        
        
         <select placeholder='Plano' value={selectedPlano} onChange={(e) => setSelectedPlano(e.target.value)}>
          <option value="">Selecione um plano</option>
          {planos.map((plano) => (
            <option key={plano.id} value={plano.nome}>{plano.nome}</option>
          ))}
        </select>

     
        <select placeholder='Especialidade'value={selectedEspecialidade} onChange={(e) => setSelectedEspecialidade(e.target.value)}>
          <option value="">Selecione uma especialidade</option>
          {especialidades.map((especialidade) => (
            <option key={especialidade.id} value={especialidade.nome}>{especialidade.nome}</option>
          ))}
        </select>

        
        {selectedUser ? (
          <button type='button' onClick={updateUser}>Salvar Alterações</button>
        ) : (
          <button type='button' onClick={createUsers}>Cadastrar</button>
        )}
      </form>

      <ToastContainer />

      <p className='titulocard'>Pacientes cadastrados</p>

      <input
        placeholder='Pesquisar por nome'
        value={busca}
        name='search'
        type="search"
        className='search'
        onChange={(ev) => setBusca(ev.target.value)}
      />

      {usersFiltrados.map((user) => (
        <div key={user.id} className='card'>
          <div>
            <p>Nome: <span>{user.nome}</span></p>
            <p>N carteira: <span>{user.carteira}</span></p>
            <p>Plano: <span>{user.plano}</span></p>
            <p>Especialidade: <span>{user.especialidade}</span></p>
          </div>

          {/* Botão para deletar */}
          <button onClick={() => deleteUsers(user.id)}>
            <img className='thrash' src={Thrash} alt="thrash" />
          </button>

          {/* Botão para editar */}
          <button onClick={() => handleEdit(user)}>Editar</button>
        </div>
      ))}
    </div>
  )
}

export default Home;
