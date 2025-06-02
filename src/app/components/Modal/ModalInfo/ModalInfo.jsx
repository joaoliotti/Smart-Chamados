import { FiX } from 'react-icons/fi'
import "./modal.css"

export default function ModalInfo({ content: conteudo, close }) {
    return (
        <div className='modal'>
            <div className='container'>
                <button className='close' onClick={close} >
                    <FiX size={25} color="#fff" />
                    Voltar
                </button>

                <main>
                    <h2>Detalhes do chamado</h2>

                    <div className='row'>
                        <span>
                            Cliente: <i>{conteudo.cliente}</i>
                        </span>
                    </div>

                    <div className='row'>
                        <span>
                            Número da Torre: <i>{conteudo.numberTower}</i>
                        </span>
                    </div>

                    <div className='row'>
                        <span>
                            Assunto: <i>{conteudo.assunto}</i>
                        </span>
                        <span>
                            Cadastrado em: <i> {conteudo.createdFormat} </i>
                        </span>
                    </div>

                    <div className='row'>
                        <span>
                            Status:
                            <i style={{
                                color:
                                    conteudo.status === 'Aberto' ? 'var(--status-open)' :
                                        conteudo.status === 'Atendido' ? 'var(--status-close)' :
                                            '#0275d8' ? 'var(--status-progress)' : '#FFF'
                            }}>
                                {conteudo.status}
                            </i>
                        </span>
                    </div>

                    <>
                        <h3>Descrição</h3>
                        <p>
                            {conteudo.complemento}
                        </p>
                    </>

                </main>
            </div>
        </div >
    )
}