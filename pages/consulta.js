
import { useState } from "react";
import styles from "./consulta.module.css";
import ReadConsultas from "./ReadConsultas";
import axios from 'axios';

export default function Home() {
  const [diagnosticoInput, setdiagnosticoInput] = useState("");
  const [result, setResult] = useState();
  const [dagnositcoConsulta, setdagnositcoConsulta] = useState("");
  // una función que se ejecuta cuando el usuario envía el formulario. La función se define como async porque 
  // utiliza fetch para hacer una llamada asíncrona a un servidor. Toma el objeto event como argumento para prevenir el 
  async function onSubmit(event) {
    event.preventDefault();
    try {
      // una función que se utiliza para hacer una solicitud HTTP a un servidor. En este caso, se utiliza 
      // para hacer una solicitud POST a la ruta /api/generate con los datos del formulario en formato JSON.
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ diagnostico: diagnosticoInput }),
      });
      // una variable que almacena la respuesta del servidor en formato JSON.
      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setdiagnosticoInput("");
    } catch(error) {
      
      console.error(error);
      alert(error.message);
    }
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:8800/chatgpt`, {
      
      method: 'POST',// Método por el cual se enviaran los datos
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ //Cuerpo del JSON que se envia a la API
        diagnostico: result
      })
    })
      .then(response => {
        if (response.ok) {
          alert('Consulta realizada exitosamente');
          window.location.reload(); // recarga la página
        } else {
          alert('Error al registrar consulta');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error al registrar consulta');
      });
  };

  // Devuelve un fragmento de JSX que representa el componente.
  //Incluye un formulario que llama a onSubmit cuando se envía y muestra 
  // el resultado obtenido debajo del formulario.
  return (
    <div>
      <ReadConsultas/>
      <main className={styles.main}>
        <h3>Indica tus síntomas</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="diagnostico"
            placeholder="Ingrese sus síntomas"
            value={diagnosticoInput}
            // un evento que se activa cuando el usuario cambia el valor de un elemento de formulario, en este caso, el input para ingresar el diagnóstico.
            onChange={(e) => setdiagnosticoInput(e.target.value)}
          />
          <input type="submit" value="Mostrar diagnostico"/>
        </form>
        <div className={styles.result}>{result}</div>
        <form onSubmit={handleSubmit}>
          <input type="submit" value="Guardar diagnostico"/>
        </form>
      </main>
    </div>
  );
}
