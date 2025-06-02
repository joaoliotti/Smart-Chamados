import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../../context/auth"

import Header from "../../components/Header/Header"
import ModalInfo from "../../components/Modal/ModalInfo/ModalInfo"
import Title from '../../components/Title/Title'
import { FiPlus, FiMessageSquare, FiSearch, FiEdit2, FiTrash, FiInfo } from 'react-icons/fi'

import { Link } from 'react-router-dom'
import { collection, getDocs, orderBy, limit, startAfter, query, onSnapshot  } from "firebase/firestore"
import { db } from "../../../services/firebaseConnection"
import { doc, deleteDoc } from "firebase/firestore";

import { format } from "date-fns"
import Swal from 'sweetalert2';
import SearchInput from '../../components/SearchInput/SearchInput';

import './Called.css'

const listRef = collection(db, "chamados")

export default function Called() {
  const { logout } = useContext(AuthContext);

  const [chamados, setChamados] = useState([])
  const [loading, setLoading] = useState(true)

  const [isEmpty, setIsEmpty] = useState(false)
  const [lastDocs, setLastDocs] = useState()
  const [loadingMore, setLoadingMore] = useState(false);

  const [showPostModal, setShowPostModal] = useState(false);
  const [detail, setDetail] = useState()

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const q = query(listRef, orderBy('created', 'desc'), limit(50));
    const unsub = onSnapshot(q, (querySnapshot) => {
    setChamados([]);
    updateState(querySnapshot);
    setLoading(false);
  });

  return () => unsub();
}, []);

  async function updateState(querySnapshot) {
    const isCollectionEmpty = querySnapshot.size === 0;

    if (!isCollectionEmpty) {
      let lista = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.status !== "Atendido") {
        lista.push({
          id: doc.id,
          chamado: doc.data().chamado,
          assunto: doc.data().assunto,
          cliente: doc.data().cliente,
          clienteId: doc.data().clienteId,
          numberTower: doc.data().numberTower,
          created: doc.data().created,
          createdFormat: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
          status: doc.data().status,
          complemento: doc.data().complemento,
          numberTower: doc.data().numberTower || '',
        })
      }
      })
      //pegando o ultimo item
      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1]

      setChamados(chamados => [...chamados, ...lista])
      setLastDocs(lastDoc);

    } else {
      setIsEmpty(true);
    }

    setLoadingMore(false);
  }

  async function handleDelete(id) {
    Swal.fire({
      title: 'Tem certeza?',
      text: "Deseja realmente excluir este chamado? Esta ação é irreversível!",
      icon: 'warning',
      background: 'var(--background-login)',
      color: 'var(--text-white)',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const docRef = doc(db, 'chamados', id);
        await deleteDoc(docRef)
          .then(() => {
            Swal.fire('Excluído!', 'Chamado excluído com sucesso.', 'success');
            setChamados(chamados => chamados.filter(chamado => chamado.id !== id));
          })
          .catch((error) => {
            console.error(error);
            Swal.fire('Erro!', 'Erro ao excluir chamado.', 'error');
          });
      }
    });
  }


  async function handleMore() {
    setLoadingMore(true);

    const q = query(listRef, orderBy('created', 'desc'), startAfter(lastDocs), limit());
    const querySnapshot = await getDocs(q);
    await updateState(querySnapshot);

  }

  function toggleModal(item) {
    setShowPostModal(!showPostModal)
    setDetail(item)
  }


  if (loading) {
    return (
      <div>
        <Header />

        <div className="content">
          <Title name="Chamados Abertos">
            <FiMessageSquare size={25} />
          </Title>

          <div className="container called">
            <span>Buscando chamados...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header />
      <div className="content">
        <div className="dashboard-header">
          <Title name="Chamados Abertos">
            <FiMessageSquare size={25} />
          </Title>
        </div>

        <>

          {chamados.length === 0 ? (
            <div className="container called">
              <span>Nenhum chamado encontrado!</span>
              <Link to="/new" className="new">
                <FiPlus color="#fff" size={25} />
                Novo chamado
              </Link>
            </div>
          ) : (
            <>
              <SearchInput 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />

              <Link to="/new" className="new">
                <FiPlus color="#fff" size={25} />
                Novo chamado
              </Link>
              <table>
                <thead>
                  <tr>
                    <th scope="col">Chamado</th>
                    <th scope="col">Cliente</th>
                    <th scope="col">Assunto</th>
                    <th scope="col">Número da Torre</th>
                    <th scope="col">Status</th>
                    <th scope="col">Criado em</th>
                    <th scope="col">Ações</th>
                  </tr>
                </thead>

                <tbody>

                  {chamados.filter((item) =>
                    item.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.assunto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.numberTower.toLowerCase().includes(searchTerm.toLowerCase())
                  ).length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center", padding: "10px", fontSize: "16px", color: "#888" }}>
                        Não foram encontrados chamados
                      </td>
                    </tr>
                  ) : (
                    chamados
                      .filter((item) =>
                        item.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.assunto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.numberTower.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((item) => (
                        <tr key={item.id}>
                          <td data-labe="chamado">{item.chamado}</td>
                          <td data-label="Cliente">{item.cliente}</td>
                          <td data-label="Assunto">{item.assunto}</td>
                          <td data-label="Número da Torre">{item.numberTower}</td>
                          <td data-label="Status">
                            <span
                              className="badge"
                              style={{
                                backgroundColor:
                                  item.status === "Aberto"
                                    ? "var(--status-open)"
                                    : item.status === "Atendido"
                                      ? "var(--status-close)"
                                      :
                                      item.status === "Em Progresso"
                                        ? "black" : "var(--status-progress)",
                              }}
                            >
                              {item.status}
                            </span>
                          </td>

                          <td data-label="Cadastrado"> {item.createdFormat} </td>
                          <td data-label="#">
                            <button
                              className="action"
                              style={{ backgroundColor: "#3583f6" }}
                              onClick={() => toggleModal(item)}
                            >
                              <FiInfo color="#FFF" size={20} />
                            </button>
                            <Link
                              to={`/new/${item.id}`}
                              className="action"
                              style={{ backgroundColor: "#f6a935" }}
                            >
                              <FiEdit2 color="#FFF" size={20} />
                            </Link>
                            <button
                              className="action"
                              style={{ backgroundColor: "#e63946" }}
                              onClick={() => handleDelete(item.id)}
                            >
                              <FiTrash color="#FFF" size={20} />
                            </button>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>

              {loadingMore && <h3>Buscando mais chamados...</h3>}
              {!loadingMore && !isEmpty && chamados.length === 50 && <button className="btn-more" onClick={handleMore}>Mostrar mais</button>}

            </>
          )}
        </>
      </div>
      {showPostModal && (
        <ModalInfo
          content={detail}
          close={() => setShowPostModal(!showPostModal)}
        />
      )}
    </div>
  )
}