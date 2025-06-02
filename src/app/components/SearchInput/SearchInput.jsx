import { FiSearch } from 'react-icons/fi';

export default function SearchInput({ searchTerm, setSearchTerm }) {
  return (
    <div style={{ position: "absolute", width: "100%", maxWidth: "400px" }}>
      <input
        type="text"
        placeholder="Busque por cliente ou assunto..."
        value={searchTerm}
        maxLength={40}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          position: "relative",  
          width: "100%",
          padding: "12px 40px 12px 16px",
          borderRadius: "25px",
          border: "2px solid var(--border-color)",
          outline: "none",
          fontSize: "16px",
          transition: "0.3s",
          boxShadow: "0 2px 5px var(--border-color)",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#0056b3")}
        onBlur={(e) => (e.target.style.borderColor = "#007bff")}
      />
      <FiSearch
        style={{
          position: "absolute",
          right: "15px",
          top: "50%",
          transform: "translateY(-50%)",
          color: "#007bff",
          fontSize: "20px",
          cursor: "pointer",
        }}
      />
    </div>
  );
}
