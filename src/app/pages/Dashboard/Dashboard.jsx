import { useEffect, useState } from "react";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { db } from "../../../services/firebaseConnection";
import Header from "../../components/Header/Header";
import DateFilter from "../../components/Calendar/Calendar";
import Title from "../../components/Title/Title";
import { FiHome, FiUsers, FiFileText, FiCheckCircle, FiClock, FiTrendingUp, FiMapPin } from "react-icons/fi";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import "./Dashboard.css";

function formatarData(dataFirebase) {
  try {
    let data;
    if (dataFirebase instanceof Timestamp) {
      data = dataFirebase.toDate();
    } else if (dataFirebase instanceof Date) {
      data = dataFirebase;
    } else {
      return "Desconhecido";
    }

    const opcoes = { month: "short", year: "numeric" };
    return data.toLocaleDateString("pt-BR", opcoes).replace(".", "");
  } catch (error) {
    return "Desconhecido";
  }
}

export default function Dashboard() {
  const [totalChamados, setTotalChamados] = useState(0);
  const [chamadosAbertos, setChamadosAbertos] = useState(0);
  const [chamadosProgresso, setChamadosProgresso] = useState(0);
  const [chamadosAtendidos, setChamadosAtendidos] = useState(0);
  const [totalClientes, setTotalClientes] = useState(0);
  const [dadosGrafico, setDadosGrafico] = useState([]);
  const [cityRanking, setCityRanking] = useState([]);
  const [stateRanking, setStateRanking] = useState([]);
  const [rankingLimit, setRankingLimit] = useState(3);

  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  useEffect(() => {
    fetchChamados();
  }, []);

  async function fetchChamados() {
    const chamadosRef = collection(db, "chamados");
    const clientesRef = collection(db, "customers");

    let q = chamadosRef;

    if (dataInicio && dataFim) {
      const inicioTimestamp = Timestamp.fromDate(new Date(dataInicio));
      const fimTimestamp = Timestamp.fromDate(new Date(dataFim + "T23:59:59"));

      q = query(chamadosRef, where("created", ">=", inicioTimestamp), where("created", "<=", fimTimestamp));
    }

    const chamadosSnapshot = await getDocs(q);
    const clientesSnapshot = await getDocs(clientesRef);

    // Process chamados data
    let abertos = 0;
    let emProgresso = 0;
    let atendidos = 0;
    let dataMap = {};

    chamadosSnapshot.forEach((doc) => {
      const { status, created } = doc.data();
      const statusFormatado = status?.trim().toLowerCase();
      const dataFormatada = formatarData(created);

      if (!dataMap[dataFormatada]) {
        dataMap[dataFormatada] = { name: dataFormatada, aberto: 0, progresso: 0, atendido: 0 };
      }

      if (statusFormatado === "aberto") {
        abertos++;
        dataMap[dataFormatada].aberto++;
      } else if (statusFormatado === "progresso") {
        emProgresso++;
        dataMap[dataFormatada].progresso++;
      } else if (statusFormatado === "atendido") {
        atendidos++;
        dataMap[dataFormatada].atendido++;
      }
    });

    // Process city and state rankings
    const cityCount = {};
    const stateCount = {};

    clientesSnapshot.forEach((doc) => {
      const { city, state } = doc.data();
      if (city) {
        cityCount[city] = (cityCount[city] || 0) + 1;
      }
      if (state) {
        stateCount[state] = (stateCount[state] || 0) + 1;
      }
    });

    // Convert to arrays and sort
    const cityRankingData = Object.entries(cityCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, rankingLimit);

    const stateRankingData = Object.entries(stateCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, rankingLimit);

    setTotalChamados(chamadosSnapshot.size);
    setChamadosAbertos(abertos);
    setChamadosProgresso(emProgresso);
    setChamadosAtendidos(atendidos);
    setTotalClientes(clientesSnapshot.size);
    setDadosGrafico(Object.values(dataMap));
    setCityRanking(cityRankingData);
    setStateRanking(stateRankingData);
  }

  return (
    <div className="dashboard-container">
      <Header />
      <main className="dashboard-main">
        <div className="dashboard-content">
          <div className="dashboard-header">
            <Title name="Dashboard">
              <FiHome size={25} />
            </Title>
          </div>

          {/* Filtros de Data */}
          <DateFilter
            dataInicio={dataInicio}
            setDataInicio={setDataInicio}
            dataFim={dataFim}
            setDataFim={setDataFim}
            onFilter={fetchChamados}
          />

          <div className="dashboard-cards">
            <div className="card">
              <FiFileText size={30} />
              <h3>Total de Chamados</h3>
              <p>{totalChamados}</p>
            </div>

            <div className="card">
              <FiClock size={30} />
              <h3>Abertos</h3>
              <p>{chamadosAbertos}</p>
            </div>

            <div className="card">
              <FiTrendingUp size={30} />
              <h3>Progresso</h3>
              <p>{chamadosProgresso}</p>
            </div>

            <div className="card">
              <FiCheckCircle size={30} />
              <h3>Atendidos</h3>
              <p>{chamadosAtendidos}</p>
            </div>

            <div className="card">
              <FiUsers size={30} />
              <h3>Total de Clientes</h3>
              <p>{totalClientes}</p>
            </div>
          </div>

          <div className="ranking-controls">
            <h2>Ranking de Cidades e Estados</h2>
            <div className="ranking-buttons">
              <button 
                className={rankingLimit === 3 ? 'active' : ''} 
                onClick={() => setRankingLimit(3)}>
                Top 3
              </button>
              <button 
                className={rankingLimit === 10 ? 'active' : ''} 
                onClick={() => setRankingLimit(10)}>
                Top 10
              </button>
              <button 
                className={rankingLimit === 999 ? 'active' : ''} 
                onClick={() => setRankingLimit(999)}>
                Todos
              </button>
            </div>
          </div>
          <div className="charts-container">
            <div className="dashboard-chart">
              <h2>Ranking de Cidades</h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={cityRanking} layout="vertical" margin={{ left: 120, right: 20, top: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    stroke="black"
                    width={110}
                    style={{ fontSize: '12px' }}
                  />
                  <XAxis type="number" stroke="black" allowDecimals={false}/>
                  <Tooltip />
                  <Bar dataKey="count" fill="#00BFFF" name="Clientes" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="dashboard-chart">
              <h2>Ranking de Estados</h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={stateRanking} layout="vertical" margin={{ left: 50, right: 20, top: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    stroke="black"
                    width={40}
                    style={{ fontSize: '12px' }}
                  />
                  <XAxis type="number" stroke="black" allowDecimals={false}/>
                  <Tooltip />
                  <Bar dataKey="count" fill="#32CD32" name="Clientes" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="dashboard-chart">
            <h2>Histórico de Chamados</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dadosGrafico}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" stroke="black" />
                <YAxis stroke="black" allowDecimals={false} />
                <Tooltip />
                <Area type="monotone" dataKey="aberto" stroke="#FFD700" fill="#FFD700" fillOpacity={0.6} />
                <Area type="monotone" dataKey="progresso" stroke="#00BFFF" fill="#00BFFF" fillOpacity={0.6} />
                <Area type="monotone" dataKey="atendido" stroke="#32CD32" fill="#32CD32" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}
