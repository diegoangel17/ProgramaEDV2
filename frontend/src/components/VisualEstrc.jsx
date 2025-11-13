
import { useState, useEffect } from 'react';


function VisualizarDatos({
    datos,
    arbol, 
    estructuraSeleccionada, 
    ResBusqueda,
    nodes,
    setNodes,
    edges,
    setEdges,
    selectedFrom,
    setSelectedFrom, 
    setNodeCounter,
    mostrarGrafo, 
    elementoSeleccionado,
    manejarSeleccion
}){
    const [weight, setWeight]=useState(0)
    const [flagPeso, setFlagPeso]=useState(false)
    const [selectedTo, setSelectedTo] = useState(null);


    // Sincronizar datos con nodos cuando la estructura es grafo
    useEffect(() => {
        if (estructuraSeleccionada === 'grafo' && datos && datos.length > 0) {
            // Convertir datos a nodos si es necesario
            const nuevosNodos = datos.map((dato, index) => ({
                id: index + 1,
                name: dato
            }));

            // Mantener solo edges válidos
            const nodosValidos = nuevosNodos.map(n => n.id);
            const edgesFiltrados = edges.filter(
                e => nodosValidos.includes(e.from) && nodosValidos.includes(e.to)
            );

            setNodes(nuevosNodos);
            setEdges(edgesFiltrados)
            setNodeCounter(datos.length + 1);
        } else if (estructuraSeleccionada === 'grafo' && (!datos || datos.length === 0)) {
            setNodes([]);
            setEdges([]);
            setSelectedFrom(null);
            setNodeCounter(1);
        }
    }, [datos, estructuraSeleccionada]);

    useEffect(() => {
    mostrarGrafo();
    }, [edges]);

    const addEdge = () => {
        if (selectedFrom && selectedFrom !== selectedTo) {
            const edgeExists = edges.some(
                e => (e.from === selectedFrom && e.to === selectedTo)
            );
            
            if (!edgeExists) {
                setEdges([...edges, { from: selectedFrom, to: selectedTo , theWeight:weight}]);
            }
            setSelectedFrom(null)
            setFlagPeso(false)
            setSelectedTo(null);
            setWeight(0)
        }
    };

    const removeEdge = (from, to) => {
        setEdges(edges.filter(e => !(e.from === from && e.to === to)));
    };


    function aristaPeso(){
        if (flagPeso){
            return(
                <>
                <input
                type="number"
                value={weight}
                maxLength={5}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Ingrese el peso"
                className="w-full px-3 py-2 border border-gray-300 rounded mb-3"
                />
                <button
                onClick={()=> addEdge()}
                className=" mb-1 px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
                >
                    Agregar conexión
                </button>
                </>
            )
        }
    }
    
    if (['pila', 'cola', 'lista'].includes(estructuraSeleccionada)||(estructuraSeleccionada=="arbol"&&ResBusqueda)||(estructuraSeleccionada=="grafo"&&ResBusqueda)){
        return(
        <div className="border border-gray-300 rounded p-3 min-h-[300px] bg-gray-50">
        {!datos || datos.length === 0 ? (
            <p className="text-gray-400 text-center">La {estructuraSeleccionada} está vacía</p>
        ) : (
            <div className="space-y-1">
            {(() => {
                // Determinar qué elementos mostrar
                let elementosAMostrar = ResBusqueda && ResBusqueda.length > 0
                ? ResBusqueda.map(index => ({ index, dato: datos[index] }))
                : datos.map((dato, index) => ({ index, dato }));

                // Función para renderizar según la estructura
                const renderElemento = ({ index, dato }) => {
                const isHighlighted = ResBusqueda && ResBusqueda.includes(index);
                const estructura = estructuraSeleccionada.toLowerCase();
                
                
                let etiqueta = '';
                let colorClase = 'bg-white border-gray-200';
                
                if (isHighlighted) {
                    colorClase = 'bg-yellow-200 border-yellow-400 font-bold';
                }

                // Determinar etiquetas según la estructura
                if (estructura.includes('pila') || estructura.includes('stack')) {
                    colorClase = isHighlighted ? 'bg-yellow-200 border-yellow-400' : 'bg-blue-100 border-blue-300';
                    return (
                    <div 
                    key={index} 
                    className={`border px-3 py-2 rounded ${colorClase} flex justify-between items-center`}
                    >
                    <span>{dato}</span>
                    {etiqueta && <span className="text-xs font-bold text-gray-600">{etiqueta}</span>}
                    </div>
                );
                } else if (estructura.includes('cola') || estructura.includes('queue')) {
                    colorClase = isHighlighted ? 'bg-yellow-200 border-yellow-400' : 'bg-green-100 border-green-300';
                    return (
                    <div 
                    key={index} 
                    className={`border px-3 py-2 rounded ${colorClase} flex justify-between items-center`}
                    >
                    <span>{dato}</span>
                    {etiqueta && <span className="text-xs font-bold text-gray-600">{etiqueta}</span>}
                    </div>
                );
                }else if(estructura.includes('arbol')) {
                    colorClase = isHighlighted ? 'bg-[#31D492] border-brown-400' : 'bg-white border-gray-200';

                    return (
                    <div 
                    key={index} 
                    className={`border px-3 py-2 rounded ${colorClase} flex justify-between items-center`}
                    >
                    <span>{dato}</span>
                    {etiqueta && <span className="text-xs font-bold text-gray-600">{etiqueta}</span>}
                    </div>
                );
                }else {
                    colorClase = isHighlighted ? 'bg-yellow-200 border-yellow-400' : 'bg-white border-gray-200';

                    return (
                    <div 
                    key={index} 
                    className={`border px-3 py-2 rounded ${colorClase} flex justify-between items-center`}
                    >
                    <span>[{index}] : {dato}</span>
                    {etiqueta && <span className="text-xs font-bold text-gray-600">{etiqueta}</span>}
                    </div>
                );
                }
                };

                // Ordenar según la estructura
                const estructura = estructuraSeleccionada.toLowerCase();
                
                if (estructura.includes('pila') || estructura.includes('stack')) {
                // PILA: Mostrar del último al primero (LIFO)
                return [...elementosAMostrar].reverse().map((elem, idx) => 
                    renderElemento(elem, idx, elementosAMostrar.length)
                );
                } else if (estructura.includes('cola') || estructura.includes('queue')) {
                // COLA: Mostrar del primero al último (FIFO)
                return elementosAMostrar.map((elem, idx) => 
                    renderElemento(elem, idx, elementosAMostrar.length)
                );
                } else {
                // LISTA: Mostrar en orden normal
                return elementosAMostrar.map((elem, idx) => 
                    renderElemento(elem, idx, elementosAMostrar.length)
                );
                }
            })()}
            
            {ResBusqueda && ResBusqueda.length === 0 && (
                <p className="text-red-500 text-center">No se encontraron resultados</p>
            )}
        </div>
        )}
    </div>
    );
    }


    if (['arbol'].includes(estructuraSeleccionada)){
        
        return (
            <div className="max-w-xl mx-auto p-4 bg-white shadow-md rounded-2xl">
                <h2 className="text-xl font-semibold mb-3">Arbol por Niveles</h2>
                {/* Mostrar elemento seleccionado */}
                {elementoSeleccionado && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-700">
                            Elemento seleccionado: Nivel {elementoSeleccionado.nivel + 1}, 
                            Posición {elementoSeleccionado.indice + 1}, 
                            Valor: {elementoSeleccionado.valor}
                        </p>
                    </div>
                )}
                <div className="space-y-3">
                    {arbol.map((sublist, i) => (
                        <div
                            key={i}
                            className="border rounded-lg p-3 flex items-start justify-between gap-4"
                            >
                            <div>
                                <div className="text-sm text-gray-500">Nivel {i + 1}</div>
                                <ul className="mt-2 flex flex-wrap gap-2">
                                {sublist.map((num, j) => {
                                    const estaSeleccionado = 
                                        elementoSeleccionado && 
                                        elementoSeleccionado.nivel === i && 
                                        elementoSeleccionado.indice === j;
                                    return(
                                <li
                                key={j}
                                className={
                                    `px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-all duration-200 ${
                                    estaSeleccionado
                                        ? 'bg-blue-500 text-white ring-2 ring-blue-300'
                                        : 'bg-gray-100 hover:bg-gray-200'
                                }`}
                                onClick={() => manejarSeleccion(i, j, num)}
                                >
                                {num}
                                </li>
                                )})}
                                </ul>
                            </div>
                        </div>
                    ))}
                    
                </div>
            </div>
        );
    }

        if (estructuraSeleccionada === 'grafo') {
        return (
            <div className="p-4">
                <h2 className="text-xl font-bold mb-4">Constructor de Grafos</h2>

                {/* Lista de Nodos */}
                <div className="mb-4">
                    <h3 className="font-semibold mb-2 flex items-center justify-between">
                        <span>Nodos ({nodes.length})</span>
                        {selectedFrom && (
                            <button
                                onClick={() => {setSelectedFrom(null), setSelectedTo(null), setFlagPeso(false)}}
                                className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                            >
                                Cancelar selección
                            </button>
                        )}
                    </h3>
                    
                    {nodes.length === 0 ? (
                        <p className="text-gray-400 text-center py-4 border border-dashed rounded">
                            No hay nodos. Agrega caracteres para crear nodos.
                        </p>
                    ) : (
                        <div className="grid grid-cols-2 gap-2">
                            {nodes.map(node => (
                                <div 
                                    key={node.id}
                                    className={`p-3 border rounded cursor-pointer transition-all ${
                                        selectedFrom === node.id
                                            ? 'bg-blue-500 text-white border-blue-600 shadow-lg'
                                        : selectedTo === node.id
                                            ? 'bg-green-500 text-white border-green-600 shadow-lg'
                                        : 'bg-gray-100 hover:bg-gray-200 border-gray-300'
                                    }`}
                                    onClick={() => {
                                        if (!selectedFrom) {
                                            setSelectedFrom(node.id);
                                        } else{
                                            setSelectedTo(node.id)
                                            setFlagPeso(true);
                                        }
                                    }}
                                >
                                    <div className="font-bold text-center text-lg">
                                        {node.name}
                                    </div>
                                    {selectedFrom === node.id && (
                                        <div className="text-xs text-center mt-1">
                                            ✓ Origen
                                        </div>
                                    )}
                                    {selectedTo === node.id && (
                                        <div className="text-xs text-center mt-1">✓ Destino</div>
                                    )}
                                </div>
                            ))}
                            
                        </div>
                    )}
                <br />
                            {aristaPeso()}
                </div>

                {/* Conexiones */}
                <div>
                    <h3 className="font-semibold mb-2">
                        Conexiones ({edges.length})
                    </h3>
                    {edges.length === 0 ? (
                        <p className="text-gray-400 text-center py-3 border border-dashed rounded">
                            No hay conexiones
                        </p>
                    ) : (
                        <div className="space-y-1 max-h-[200px] overflow-y-auto">
                            {edges.map((edge, idx) => {
                                const fromNode = nodes.find(n => n.id === edge.from);
                                const toNode = nodes.find(n => n.id === edge.to);
                                return (
                                    <div 
                                        key={idx} 
                                        className="p-2 bg-green-100 border border-green-300 rounded flex justify-between items-center"
                                    >
                                        <span className="font-medium">
                                            {fromNode?.name} -- {toNode?.name}:  ({edge.theWeight})
                                        </span>
                                        <button
                                            onClick={() => removeEdge(edge.from, edge.to)}
                                            className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Representación como lista de adyacencia */}
                {nodes.length > 0 && (
                    <div className="mt-4 p-3 bg-gray-50 rounded border">
                        <h4 className="font-semibold text-sm mb-2">Lista de Adyacencia:</h4>
                        <div className="space-y-1 text-xs font-mono">
                            {nodes.map(node => {
                                const conexiones = edges
                                    .filter(e => e.from === node.id)
                                    .map(e => nodes.find(n => n.id === e.to)?.name);
                                return (
                                    <div key={node.id} className="flex">
                                        <span className="font-bold min-w-[30px]">{node.name}:</span>
                                        <span className="text-gray-600">
                                            {conexiones.length > 0 
                                                ? `[${conexiones.join(', ')}]` 
                                                : '[]'}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        );
    }
    
    
    
    
}
export default VisualizarDatos;