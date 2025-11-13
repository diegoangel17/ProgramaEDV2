from binarytree import build

def createTree(datos):
    datos_ascii=[ord(elemento) for elemento in datos]
    arbol=build(datos_ascii)
    return arbol

def porNiveles(arbol):
    niveles_con_nodos=arbol.levels
    niveles_valores = [[nodo.value for nodo in nivel] for nivel in niveles_con_nodos]
    nivles_char=[[chr(x) for x in nivel] for nivel in niveles_valores]
    return nivles_char


def recorridoArbol(tipo, arbol):
    listaNodos=[]
    
    if tipo=='Posorden':
        listaNodos=arbol.postorder
    elif tipo=='Preorden':
        listaNodos=arbol.preorder
    elif tipo=='Inorden':
        listaNodos=arbol.inorder
    
    lista=[chr(nodo.value) for nodo in listaNodos]
    return lista
    

