from flask import Flask, jsonify, request
from flask_cors import CORS
from estructuras.estructuras_lineales import EstructuraLineal,ordenamiento_burbuja, quicksort, ordenamiento_shell, convertir_Ascii, convertir_Char,busqueda_lineal, funcion_hash
from estructuras.arboles import createTree, porNiveles, recorridoArbol
from estructuras.grafos import Grafos
import time
import numpy as np

app = Flask(__name__)
CORS(app)

@app.route('/api/ingresar', methods=['POST'])
def ingresar_datos():
    #datos recibidos
    data = request.get_json()
    valor = data.get("inputValue", "")
    tipo_estructura = data.get("estructuraSeleccionada", "Desconocido")
    datos = data.get("datos", [])
    #procesos
    estructura=EstructuraLineal()
    estructura.ingresar_datos(datos)
    estructura.agregar(valor)
    datos = estructura.elementos
    datosArbol=[]

    if tipo_estructura=="arbol":
        arbol=createTree(datos)
        datosArbol=porNiveles(arbol)

    return jsonify({
        "estructura": datos,
        "arbol":datosArbol
    })


@app.route('/api/eliminar', methods=['POST'])
def eliminar():
    data = request.get_json()
    tipo_estructura = data.get("estructuraSeleccionada", "Desconocido")
    datos = data.get("datos", [])
    datosArbol=[]
    estructura=EstructuraLineal()
    estructura.ingresar_datos(datos)

    if not datos or len(datos) == 0:
        return jsonify({
            "error": "La estructura está vacía",
            "estructura": []
        }), 400
    
    if tipo_estructura in ['pila', 'lista', 'grafo']:
        estructura.desapilar()
        datos = estructura.elementos
    elif tipo_estructura == "cola":
        estructura.eliminar_Cola()
        datos = estructura.elementos
    elif tipo_estructura == "arbol":
        estructura.desapilar()
        datos = estructura.elementos
        arbol=createTree(datos)
        datosArbol=porNiveles(arbol)

    

    return jsonify({
        "estructura": datos,
        "arbol":datosArbol
    })

@app.route('/api/ordenar', methods=['POST'])
def ordenar():
    data = request.get_json()
    tipo_estructura = data.get("estructuraSeleccionada", "Desconocido")
    datos = data.get("datos", [])
    tipo_ordenamiento = data.get("tipo_Ordenamiento", "Desconocido")
    datosArbol=[]
    if not datos or len(datos) == 0:
        return jsonify({
            "error": "La estructura está vacía",
            "estructura": []
        }), 400
    
    pila_ascii = convertir_Ascii(datos)
    tiempoEjecucion = 0
    
    if tipo_ordenamiento == "burbuja":
        paquete= ordenamiento_burbuja(pila_ascii)
        datos=convertir_Char(paquete[0])
        tiempoEjecucion=paquete[1]

    elif tipo_ordenamiento == "quicksort":
        inicio = time.perf_counter()
        datos = convertir_Char(quicksort(pila_ascii))
        fin = time.perf_counter()
        tiempoEjecucion = fin - inicio
        
    elif tipo_ordenamiento == "shell":
        paquete = ordenamiento_shell(pila_ascii)
        datos=convertir_Char(paquete[0])
        tiempoEjecucion=paquete[1]

    if tipo_estructura=="arbol":
        arbol=createTree(datos)
        datosArbol=porNiveles(arbol)

    return jsonify({
        "estructura": datos,
        "tiempo": tiempoEjecucion,
        "arbol":datosArbol
    })


@app.route('/api/buscar', methods=['POST'])
def buscar():
    data = request.get_json()
    datos = data.get("datos", [])
    tipo_Busqueda = data.get("tipo_Busqueda", "Desconocido")
    valor_buscado = data.get("inputValue", "")

    if not datos or len(datos) == 0:
        return jsonify({
            "error": "La estructura está vacía",
            "estructura": []
        }), 400
    
    if tipo_Busqueda == "lineal":
        indice_encontrado, tiempoEjecucion = busqueda_lineal(datos, valor_buscado)
    elif tipo_Busqueda == "binaria":
        indice_encontrado, tiempoEjecucion = busqueda_lineal(datos, valor_buscado)
    elif tipo_Busqueda == "hash":
        inicio = time.perf_counter()
        indice_encontrado = funcion_hash(datos,valor_buscado)
        if -1 in indice_encontrado:
            indice_encontrado = []
        fin = time.perf_counter()
        tiempoEjecucion = fin - inicio
    return jsonify({
        "indices": indice_encontrado,
        "tiempo": tiempoEjecucion
    })

@app.route('/api/recorrer', methods=['POST'])
def recorrer():
    #datos recibidos
    data = request.get_json()
    datos = data.get("datos", [])
    estructuraSeleccionada= data.get("estructuraSeleccionada", "Desconocido")
    tipo_recorrido= data.get("tipo_Recorrido","Desconocido")
    aristas = data.get("aristas", [])
    origen=data.get("origen","Desconocido")
    nodos=data.get("nodos",[])
    #procesos
    estructura=EstructuraLineal()
    estructura.ingresar_datos(datos)
    datos = estructura.elementos
    recorrido=[]
    distancia={}
    caminos={}
    dist = None
    next_node = None
    idx_map = None

    if estructuraSeleccionada=="arbol":
        arbol=createTree(datos)
        recorrido=recorridoArbol(tipo_recorrido,arbol)
    elif estructuraSeleccionada=="grafo":
        grafo=Grafos()
        grafo.ingresar(aristas,nodos)
        if tipo_recorrido=="Dijkstra":
            distancia,caminos=grafo.dijkstra(origen)
        elif tipo_recorrido=="Bellman Ford":
            distancia,caminos=grafo.bellman_ford(origen)
        elif tipo_recorrido == "Floyd Warshall":
            dist, next_node, idx_map = grafo.floyd_warshall()
            dist=dist.tolist()
            next_node=next_node.tolist()
            dist = [["INF" if x == float('inf') else x for x in row] for row in dist]

    return jsonify({
        "recorrido": recorrido,
        "distancias":distancia,
        "caminos":caminos,
        "dist": dist,    
        "next_node": next_node, 
        "idx_map": idx_map       
    })
        

@app.route('/api/mostrarGrafo', methods=['POST'])
def mostrarGrafo():
    #datos recibidos
    data = request.get_json()
    aristas = data.get("aristas", [])
    nodos=data.get("nodos",[])
    #procesos
    grafo=Grafos()
    grafo.ingresar(aristas,nodos)
    imagen_grafo = grafo.visualizar(guardar=False)

    return jsonify({
        "imagen": imagen_grafo
    })

    

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)
