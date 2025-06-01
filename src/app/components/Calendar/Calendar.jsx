import { FiCalendar, FiFilter, FiX } from "react-icons/fi";
import "./calendar.css";

export default function Calendar({
  dataInicio,
  setDataInicio,
  dataFim,
  setDataFim,
  onFilter,
}) {
  return (
    <div className="filters">
      <div className="date-inputs">
        <label>
          <FiCalendar size={18} /> Início:
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
          />
        </label>

        <label>
          <FiCalendar size={18} /> Fim:
          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
          />
        </label>
      </div>

      <div className="button-group">
        <button className="filter-btn" onClick={onFilter}>
          <FiFilter size={16} />
          Filtrar
        </button>
        <button 
          className="clear-btn" 
          onClick={() => {
            setDataInicio('');
            setDataFim('');
          }}
        >
          <FiX size={16} />
          Limpar
        </button>
      </div>
    </div>
  );
}
