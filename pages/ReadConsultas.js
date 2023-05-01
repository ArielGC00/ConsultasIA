import { useState, useEffect } from "react";

function ReadConsultas() {
    const [consultas, setConsultas] = useState([]);
    useEffect(() => {
        fetch('http://localhost:8800/chatgpt')
          .then(response => response.json())
          .then(data => setConsultas(data))
          .catch(error => console.log(error));
      }, []);

    return(
        <div className="listaConsulta" style={{ maxHeight: '300px', overflowY: 'scroll' }}>
            <ul>
            {consultas.map(consulta => (
                <li key={consulta.id}>
                    <p>Id de la consulta: {consulta.idConsulta}</p> 
                    <p>Diagnostico de la consulta: {consulta.dagnositcoConsulta}</p>
                </li>
            ))}
            </ul>
        </div>
    );

}
export default ReadConsultas;