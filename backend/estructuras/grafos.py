import networkx as nx
import os
import io
import base64
from matplotlib.figure import Figure
from matplotlib.backends.backend_agg import FigureCanvasAgg
import numpy as np


class Grafos:
    def __init__(self, ):
        self.grafo=nx.Graph()
    
    def ingresar(self,aristas, nodos):
        for nodo in nodos:
            self.grafo.add_node(nodo)
        for arista in aristas:
            origen = arista['origen']  # String: 'A'
            destino = arista['destino']  # String: 'B'
            peso = float(arista.get('peso', 1))  # Peso por defecto es 1 si no se especifica
            
            self.grafo.add_edge(origen, destino, weight=peso)
            print(f"Conexión: {origen} -> {destino} (peso: {peso})")


    def visualizar(self, guardar=False):
        """Método para visualizar el grafo con pesos"""
        fig = Figure(figsize=(8, 6))
        ax = fig.add_subplot(111)
        
        pos = nx.spring_layout(self.grafo)
        
        # Dibujar nodos
        nx.draw_networkx_nodes(self.grafo, pos, node_color='lightblue', 
                            node_size=500, ax=ax)
        
        # Dibujar etiquetas de nodos
        nx.draw_networkx_labels(self.grafo, pos, font_size=12, 
                            font_weight='bold', ax=ax)
        
        # Dibujar aristas con pesos
        edges = self.grafo.edges()
        weights = [self.grafo[u][v]['weight'] for u, v in edges]
        
        nx.draw_networkx_edges(self.grafo, pos, edgelist=edges, 
                            width=2, alpha=0.7, ax=ax)
        
        # Dibujar etiquetas de pesos
        edge_labels = {(u, v): f"{self.grafo[u][v]['weight']}" 
                    for u, v in edges}
        nx.draw_networkx_edge_labels(self.grafo, pos, 
                                    edge_labels=edge_labels, ax=ax)
        
        ax.set_title("")
        ax.axis('off')
        
        if guardar:
            # Guardar en archivo
            os.makedirs('static/grafos', exist_ok=True)
            filepath = 'static/grafos/grafo_temp.png'
            fig.savefig(filepath, bbox_inches='tight', dpi=150)
            return filepath
        else:
            # Retornar como base64
            buf = io.BytesIO()
            fig.savefig(buf, format='png', bbox_inches='tight', dpi=150)
            buf.seek(0)
            img_base64 = base64.b64encode(buf.read()).decode('utf-8')
            buf.close()
            
            return img_base64
        
        
    
    def dijkstra(self, origen):
        """
        Algoritmo de Dijkstra para encontrar los caminos más cortos
        desde un nodo origen a todos los demás nodos.
        """
        try:
            # Usamos NetworkX para Dijkstra
            caminos = nx.single_source_dijkstra_path(self.grafo, origen)
            distancias = nx.single_source_dijkstra_path_length(self.grafo, origen)
            
            print(f"\n--- DIJKSTRA desde nodo '{origen}' ---")
            print("Distancias más cortas:")
            for nodo, distancia in distancias.items():
                print(f"  {origen} -> {nodo}: {distancia}")
            
            print("\nCaminos más cortos:")
            for nodo, camino in caminos.items():
                print(f"  {origen} -> {nodo}: {' -> '.join(camino)}")
            
            return distancias, caminos
        
        except nx.NetworkXNoPath:
            print(f"No hay camino desde {origen} a algunos nodos")
            return None, None
        except Exception as e:
            print(f"Error en Dijkstra: {e}")
            return None, None
        
    def bellman_ford(self, origen):
        """
        Algoritmo de Bellman-Ford para encontrar los caminos más cortos
        Funciona con pesos negativos pero detecta ciclos negativos.
        """
        try:
            # Convertir a grafo dirigido para Bellman-Ford
            grafo_dirigido = self.grafo.to_directed()
            
            # Verificar si el nodo origen existe
            if origen not in grafo_dirigido.nodes:
                print(f"El nodo {origen} no existe en el grafo")
                return None, None
            
            # Bellman-Ford manual
            distancias = {nodo: float('inf') for nodo in grafo_dirigido.nodes}
            predecesores = {nodo: None for nodo in grafo_dirigido.nodes}
            distancias[origen] = 0
            
            # Relajar todas las aristas |V| - 1 veces
            for _ in range(len(grafo_dirigido.nodes) - 1):
                cambios = False
                for u, v, data in grafo_dirigido.edges(data=True):
                    peso = data['weight']
                    if distancias[u] + peso < distancias[v]:
                        distancias[v] = distancias[u] + peso
                        predecesores[v] = u
                        cambios = True
                if not cambios:
                    break
            
            # Verificar ciclos negativos
            for u, v, data in grafo_dirigido.edges(data=True):
                peso = data['weight']
                if distancias[u] + peso < distancias[v]:
                    print("¡ADVERTENCIA: El grafo contiene ciclos negativos!")
                    return None, None
            
            # Reconstruir caminos
            caminos = {}
            for nodo in grafo_dirigido.nodes:
                camino = []
                actual = nodo
                while actual is not None:
                    camino.insert(0, actual)
                    actual = predecesores[actual]
                caminos[nodo] = camino if camino[0] == origen else []
            
            print(f"\n--- BELLMAN-FORD desde nodo '{origen}' ---")
            print("Distancias más cortas:")

            for nodo, distancia in distancias.items():
                if distancia == float('inf'):
                    print(f"  {origen} -> {nodo}:{distancia}")
                else:
                    print(f"  {origen} -> {nodo}: {distancia}")
            
            print("\nCaminos más cortos:")
            for nodo, camino in caminos.items():
                if camino and camino[0] == origen:
                    print(f"  {origen} -> {nodo}: {' -> '.join(camino)}")
                else:
                    print(f"  {origen} -> {nodo}: No alcanzable")
            # Filtrar distancias infinitas (no alcanzables)
            distancias = {n: d for n, d in distancias.items() if d != float('inf')}

            # Filtrar caminos vacíos (no alcanzables)
            caminos = {n: c for n, c in caminos.items() if c and c[0] == origen}
            return distancias, caminos
            
        except Exception as e:
            print(f"Error en Bellman-Ford: {e}")
            return None, None
    
    def floyd_warshall(self):
        """
        Algoritmo de Floyd-Warshall para encontrar todos los caminos más cortos
        entre todos los pares de nodos.
        """
        try:
            nodos = list(self.grafo.nodes())
            n = len(nodos)
            
            # Matrices de distancias y predecesores
            dist = np.full((n, n), float('inf'))
            next_node = np.full((n, n), -1, dtype=int)
            
            # Mapeo de índices
            idx_map = {nodo: i for i, nodo in enumerate(nodos)}
            
            # Inicializar matriz de distancias
            for i in range(n):
                dist[i][i] = 0
                
            for u, v, data in self.grafo.edges(data=True):
                i, j = idx_map[u], idx_map[v]
                peso = data['weight']
                dist[i][j] = peso
                dist[j][i] = peso  # Para grafo no dirigido
                next_node[i][j] = j
                next_node[j][i] = i
            
            # Algoritmo Floyd-Warshall
            for k in range(n):
                for i in range(n):
                    for j in range(n):
                        if dist[i][j] > dist[i][k] + dist[k][j]:
                            dist[i][j] = dist[i][k] + dist[k][j]
                            next_node[i][j] = next_node[i][k]
            
            # Reconstruir caminos
            def reconstruir_camino(i, j):
                if next_node[i][j] == -1:
                    return []
                camino = [nodos[i]]
                while i != j:
                    i = next_node[i][j]
                    camino.append(nodos[i])
                return camino
            
            print(f"\n--- FLOYD-WARSHALL ---")
            print("Matriz de distancias más cortas:")
            print("    " + "   ".join(nodos))
            for i, nodo_i in enumerate(nodos):
                fila = [f"{dist[i][j]:.1f}" if dist[i][j] != float('inf') else "INF" 
                       for j in range(n)]
                print(f"{nodo_i}:  " + "  ".join(fila))
            
            print("\nAlgunos caminos más cortos:")
            for i in range(min(3, n)):
                for j in range(min(3, n)):
                    if i != j and dist[i][j] != float('inf'):
                        camino = reconstruir_camino(i, j)
                        print(f"  {nodos[i]} -> {nodos[j]}: {' -> '.join(camino)} (distancia: {dist[i][j]})")
            
            return dist, next_node, idx_map
            
        except Exception as e:
            print(f"Error en Floyd-Warshall: {e}")
            return None, None, None
    

"""
aristas = [
  {"origen": "A", "destino": "B", "peso": "9"},
  {"origen": "A", "destino": "C", "peso": "7"},
  {"origen": "B", "destino": "C", "peso": "5"}
]
G=Grafos()
G.ingresar(aristas)
G.visualizar()
distancia={}
caminos={}
distancia,caminos=G.dijkstra("A")
print(caminos)
print(distancia)"""

"""
G = nx.Graph()

G.add_nodes_from(["A", "h", "u"])
G.add_weighted_edges_from([("u", "h",9), ("A", "u",8)])


# Diseño del grafo
pos = nx.spring_layout(G)  # Diseño de resorte

# Dibujar el grafo
nx.draw_networkx_nodes(G, pos, node_size=500, node_color='lightblue')
nx.draw_networkx_edges(G, pos, width=2, alpha=0.6)
nx.draw_networkx_labels(G, pos, font_size=12, font_weight='bold')
edge_labels = nx.get_edge_attributes(G, 'weight')
nx.draw_networkx_edge_labels(G, pos, edge_labels=edge_labels)

plt.title("Grafo Simple con NetworkX", fontsize=16)
plt.axis('off')  # Ocultar ejes
plt.tight_layout()
plt.show()"""