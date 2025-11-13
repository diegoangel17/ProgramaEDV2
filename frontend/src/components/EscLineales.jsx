import { useState, useEffect, useRef } from 'react'
import VisualizarDatos from './VisualEstrc.jsx';

function EstructuraLineal({volverMenu, estructuraSeleccionada}) {
  const [inputValue, setInputValue] = useState('');
  const [datos, setDatos] = useState([]);

  const [tipo_Ordenamiento, setOrden] = useState(null);
  const [tipo_Busqueda, setBusqueda] = useState(null);
  const [tipo_Recorrido, setTipoRecorrido] = useState(null);

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedFrom, setSelectedFrom] = useState(null);
  const [nodeCounter, setNodeCounter] = useState(1);
  const [distancias, setDistancias]= useState(null)
  const [caminos, setCaminos]= useState(null)
  const [idx_map, setIdx_Map]= useState(null)
  const [dist, setDist]= useState(null)
  const [next_node, setNext_Node]= useState(null)
  

  const[tiempoEjecucion, setTiempoEjecucion] = useState(null);
  const [ResBusqueda, setResBusqueda] = useState(null);
  const [recorrido, setRecorrido]=useState([])
  const inputRef = useRef(null);
  const [arbol, setArbol]= useState([])
  const [imagenGrafo, setImagenGrafo]= useState(null)

  const [elementoSeleccionado, setElementoSeleccionado] = useState(null);
    
    const manejarSeleccion = (nivel, indice, valor) => {
        const nuevaSeleccion = { nivel, indice, valor };
        
        // Si ya está seleccionado, lo deselecciona
        if (elementoSeleccionado && 
            elementoSeleccionado.nivel === nivel && 
            elementoSeleccionado.indice === indice) {
            setElementoSeleccionado(null);
        } else {
            setElementoSeleccionado(nuevaSeleccion);
        }
    };
  
  function limpiarTodo(){
    setDatos([]),
    setResBusqueda(null), 
    setTiempoEjecucion(null), 
    setCaminos(null),
    setDistancias(null), 
    setArbol([])
    setRecorrido([])
  }
  const enviarDatos = async () => {
    if (estructuraSeleccionada === "grafo") {
        if (datos.includes(inputValue)) {
            alert("El nodo ya existe en el grafo");
            setInputValue('')
            return;
        }
    }
    try{const res = await fetch("http://127.0.0.1:5000/api/ingresar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inputValue, estructuraSeleccionada,datos }),
    })
    const data = await res.json()
    setDatos(data.estructura)
    setArbol(data.arbol)
    setInputValue('')
    inputRef.current?.focus();
    }catch (err) {
      console.error("Error:", err);
    }
  }
  const eliminarDatos = async () => {
    try{const res = await fetch("http://127.0.0.1:5000/api/eliminar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estructuraSeleccionada,datos}),
    })
    const data = await res.json()
    setDatos(data.estructura)
    setArbol(data.arbol)
    }catch (err) {
      console.error("Error:", err);
    }
  }

  const ordenarDatos = async (tipo) => {
    setOrden(tipo)
    try{const res = await fetch("http://127.0.0.1:5000/api/ordenar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estructuraSeleccionada,datos, tipo_Ordenamiento:tipo}),
    })
    const data = await res.json()
    setResBusqueda(null);  
    setDatos(data.estructura)
    setTiempoEjecucion(data.tiempo)
    setArbol(data.arbol)
    console.log(data.estructura)
    }catch (err) {
      console.error("Error:", err);
    }
  }

  const buscarDato = async (tipo) => {
    if (!inputValue || inputValue.trim() === '') return;

    setBusqueda(tipo)
    try{const res = await fetch("http://127.0.0.1:5000/api/buscar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estructuraSeleccionada,datos, tipo_Busqueda:tipo, inputValue}),
    })
    const data = await res.json()
    setResBusqueda(data.indices)
    setTiempoEjecucion(data.tiempo)
    }catch (err) {
      console.error("Error:", err);
    }
  }
  const handleKeyDown = (e) => {
  if (e.key === 'Enter' && inputValue && inputValue.trim() !== '') {
    enviarDatos();
  }
  };

  const recorrer = async (tipo) => {
    setTipoRecorrido(tipo)
    const grafoData = {
        nodos: nodes.map(n => n.name),
        aristas: edges.map(e => ({
            origen: nodes.find(n => n.id === e.from)?.name,
            destino: nodes.find(n => n.id === e.to)?.name,
            peso: e.theWeight
        }))
    };
    const fromNode = nodes.find(n => n.id === selectedFrom)?.name;

    try{const res = await fetch("http://127.0.0.1:5000/api/recorrer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({datos,
        tipo_Recorrido:tipo,
        estructuraSeleccionada,
        origen:fromNode,
      ...grafoData}),
    })

    const data = await res.json()
    setRecorrido([]);
    setDistancias(null);
    setDist(null);
    setCaminos(null);
    setNext_Node(null);
    setIdx_Map(null);
    if (data.next_node && data.idx_map && data.dist) {
      setDist(data.dist);
      setNext_Node(data.next_node);
      setIdx_Map(data.idx_map);
      console.log(data.dist)
      return;
    }
    setRecorrido(data.recorrido)
    setDistancias(data.distancias);
    setCaminos(data.caminos);
    
    }catch (err) {
      console.error("Error:", err);
    }
  }

  const mostrarGrafo = async () => {
    const grafoData = {
        nodos: nodes.map(n => n.name),
        aristas: edges.map(e => ({
            origen: nodes.find(n => n.id === e.from)?.name,
            destino: nodes.find(n => n.id === e.to)?.name,
            peso: e.theWeight
        }))
    };
    try{const res = await fetch("http://127.0.0.1:5000/api/mostrarGrafo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({...grafoData}),
    })
    const data = await res.json()
    setImagenGrafo(data.imagen)
    }catch (err) {
      console.error("Error:", err);
    }
  }

  


  function recorridos(){
    const opciones = {
    arbol: ['Preorden', 'Inorden', 'Posorden'],
    grafo: ['Dijkstra', 'Bellman Ford', 'Floyd Warshall']
    };
    const clasRecorridos = opciones[estructuraSeleccionada] || [];

    if (["arbol", "grafo"].includes(estructuraSeleccionada)){
      return(
      <div className="border-t pt-3">
        <p className="font-semibold mb-2 text-sm">Recorridos:</p>
        {clasRecorridos.map((recorrido, index) => (
          <button
            key={recorrido}
            disabled={
              !datos || datos.length === 0 ||
              (estructuraSeleccionada === "grafo" &&
              recorrido !== "Floyd Warshall" &&
              !selectedFrom)
            }
            onClick={() => recorrer(recorrido)}
            className={`w-full px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm ${
              index < clasRecorridos.length - 1 ? 'mb-1' : ''
            }`}
          >
            {recorrido}
          </button>
        ))}
      </div>
    );
    }
    
    
  }
  function mostrarRecorrido(){
    
    if(estructuraSeleccionada=="arbol"){
      if (recorrido.length>0){
        return(
            <>
            <br />
            <div className="border border-gray-300 rounded p-3 min-h-[300px] bg-gray-50">
              <h1 className="font-bold mb-3 text-orange-600">Recorrido</h1>
              <ul className="space-y-4">
                {recorrido.map((caracter, i) => (
                  <li key={i} className="bg-green-100 px-3 py-1 rounded-lg">{caracter}</li>
                ))}
              </ul>
            </div>
            </>
        );
      }
    } else if ( estructuraSeleccionada=="grafo" && caminos && distancias) {
      
      return(
        <div className="space-y-3">
          {/* Distancias */}
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-3">
            <h3 className="font-bold text-blue-800 text-sm mb-2"> Distancias</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(distancias).map(([nodo, distancia]) => (
                <div key={nodo} className="flex justify-between bg-white rounded px-2 py-1 text-sm">
                  <span className="font-medium">{nodo}:</span>
                  <span className="font-bold text-blue-600">
                    {distancia === Infinity ? '∞' : distancia}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Caminos */}
          <div className="bg-purple-50 border-l-4 border-purple-500 rounded-r-lg p-3">
            <h3 className="font-bold text-purple-800 text-sm mb-2"> Caminos</h3>
            <div className="space-y-1">
              {Object.entries(caminos).map(([nodo, camino]) => (
                <div key={nodo} className="bg-white rounded px-2 py-1 text-xs">
                  <span className="font-semibold text-gray-600">{nodo}:</span>{" "}
                  <span className="text-gray-700">{camino.join(" → ")}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
    else if ( estructuraSeleccionada=="grafo" && dist && next_node && idx_map ){
      return(
        <>
        <div className="p-3 bg-gray-100 rounded">
          <h3 className="font-bold mb-2">Matriz de distancias</h3>

          <table className="table-auto border-collapse">
            <thead>
              <tr>
                <th></th>
                {Object.keys(idx_map).map(nodo => (
                  <th key={nodo} className="px-2">{nodo}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {Object.keys(idx_map).map((nodoI, i) => (
                <tr key={nodoI}>
                  <td className="font-bold px-2">{nodoI}</td>

                  {Object.keys(idx_map).map((nodoJ, j) => (
                    <td key={nodoJ} className="border px-2 py-1 text-center">
                      {dist[i][j] === "INF" ? "INF" : dist[i][j].toFixed(1)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        </>

      );
    }
  }

  
  


    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => {volverMenu(),limpiarTodo()}}
            className="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            ← Volver al Menú Principal
          </button>
          
          <h1 className="text-2xl font-bold mb-4 text-gray-800 uppercase">
            {estructuraSeleccionada}
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-md p-3">
              <h3 className="font-bold mb-3 text-green-600">OPERACIONES</h3>
              
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                maxLength={1}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ingrese el carácter"
                className="w-full px-3 py-2 border border-gray-300 rounded mb-3"
              />
              
              <div className="space-y-3">
                <button
                  onClick={enviarDatos}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  disabled={!inputValue || inputValue.trim() === ''}
                >
                  Agregar Dato
                </button>
                
                <button
                  onClick={eliminarDatos}
                  className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  disabled={!datos || datos.length === 0}
                >
                  Eliminar Dato
                </button>
                
                <div className="border-t pt-3">
                  <p className="font-semibold mb-2 text-sm">Ordenar:</p>
                  <button
                    disabled={!datos || datos.length === 0}
                    onClick={() => ordenarDatos('burbuja')}
                    className="w-full mb-1 px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
                  >
                    Burbuja
                  </button>
                  <button
                    disabled={!datos || datos.length === 0}
                    onClick={() => ordenarDatos('shell')}
                    className="w-full mb-1 px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
                  >
                    Shell
                  </button>
                  <button
                    disabled={!datos || datos.length === 0}
                    onClick={() => ordenarDatos('quicksort')}
                    className="w-full px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
                  >
                    Quick Sort
                  </button>
                </div>

                <div className="border-t pt-3">
                  <p className="font-semibold mb-2 text-sm">Buscar:</p>
                  <button
                    disabled={!datos || datos.length === 0}
                    onClick={()=> buscarDato('lineal')}
                    className="w-full mb-1 px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
                  >
                    Busqueda Secuencial
                  </button>
                  <button
                    disabled={!datos || datos.length === 0}
                    onClick={()=> buscarDato('binaria')}
                    className="w-full mb-1 px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
                  >
                    Busqueda Binaria
                  </button>
                  <button
                    disabled={!datos || datos.length === 0}
                    onClick={() => buscarDato('hash')}
                    className="w-full px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
                  >
                    Funciones Hash
                  </button>
                </div>

                {recorridos()}

                <button
                  onClick={() => limpiarTodo()}
                  disabled={!datos || datos.length === 0}
                  className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Limpiar {estructuraSeleccionada}
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-bold mb-3 text-orange-600">VISUALIZACIÓN</h3>
              
              <VisualizarDatos 
                datos={datos}
                arbol={arbol}
                estructuraSeleccionada={estructuraSeleccionada}
                ResBusqueda={ResBusqueda}
                inputValue={inputValue}
                nodes={nodes}
                setNodes={setNodes}
                edges={edges}
                setEdges={setEdges}
                selectedFrom={selectedFrom}
                setSelectedFrom={setSelectedFrom}
                setNodeCounter={setNodeCounter}
                mostrarGrafo={mostrarGrafo}
                elementoSeleccionado={elementoSeleccionado}
                manejarSeleccion={manejarSeleccion}
                />

              {ResBusqueda && (
                <button
                onClick={() => {setResBusqueda(null), setTiempoEjecucion(null)}}
                className="mt-2 w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
              Mostrar Todo
              </button>
              )}
              
              {tiempoEjecucion && tiempoEjecucion > 0? (
              <h1>Tiempo de ejecución: {tiempoEjecucion}</h1>
              ) : null}

              {mostrarRecorrido()}

              

              {imagenGrafo && estructuraSeleccionada=="grafo"&& (
                <div className="mt-4">
                  <h3 className="font-bold mb-2">Visualización del Grafo:</h3>
                  <img 
                    src={`data:image/png;base64,${imagenGrafo}`} 
                    alt="Grafo visualizado"
                    className="w-full border rounded"
                  />
                </div>
              )}
              
              
              
              
              
            </div>
          </div>
        </div>
      </div>
    );
}
export default EstructuraLineal;


