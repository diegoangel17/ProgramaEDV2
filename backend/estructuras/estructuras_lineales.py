import time

class EstructuraLineal:
    def __init__(self):
        self.elementos = []

    def esta_vacia(self):
        return len(self.elementos) == 0
    
    def ingresar_datos(self, datos):
        self.elementos=datos

    def agregar(self, valor):
        self.elementos.append(valor)
        return self.elementos
    
    def desapilar(self):
        if self.esta_vacia():
            raise IndexError("Desapilar de una estructura vacía")
        self.elementos.pop()
        return self.elementos
    
    
    def eliminar_Cola(self):
        if self.esta_vacia():
            raise IndexError("Eliminar de una cola vacía")
        self.elementos.pop(0)
        return self.elementos
    
    


def convertir_Ascii(pila):
    return [ord(elemento) for elemento in pila]

def convertir_Char(pila):
    return [chr(elemento) for elemento in pila]

def ordenamiento_burbuja(pila):
    inicio = time.perf_counter()
    n = len(pila)
    for i in range(n - 1):
        hubo_intercambio = False
        for j in range(0, n - i - 1):
            if pila[j] > pila[j+1]:
                pila[j], pila[j+1] = pila[j+1], pila[j]
                hubo_intercambio = True
        if not hubo_intercambio:
            break
    fin = time.perf_counter()
    time_taken = fin - inicio
    return pila, time_taken

def ordenamiento_shell(pila_ascii):
    inicio = time.perf_counter()    
    n = len(pila_ascii)
    gap = n // 2
    while gap > 0:
        for i in range(gap, n):
            temp = pila_ascii[i]
            j = i
            while j >= gap and pila_ascii[j - gap] > temp:
                pila_ascii[j] = pila_ascii[j - gap]
                j -= gap
            pila_ascii[j] = temp
        gap //= 2
    fin = time.perf_counter()
    time_taken = fin - inicio
    return pila_ascii, time_taken

def quicksort(pila_ascii):
    if len(pila_ascii) <= 1:
        return pila_ascii
    else:
        pivote = pila_ascii[0]
        menores = [i for i in pila_ascii[1:] if i <= pivote]
        mayores = [i for i in pila_ascii[1:] if i > pivote]
        return quicksort(menores) + [pivote] + quicksort(mayores)
    

def busqueda_lineal(pila, objetivo):
    inicio = time.perf_counter()
    
    indices= []
    for index, elemento in enumerate(pila):
        if elemento == objetivo:
            indices.append(index)
    fin = time.perf_counter()
    time_taken = fin - inicio
    return indices, time_taken
    
def busqueda_binaria(lista_ordenada, objetivo):
    inicio = time.perf_counter()
    indices= []
    izquierda = 0
    derecha = len(lista_ordenada) - 1
    while izquierda <= derecha:
        medio = (izquierda + derecha) // 2
        elemento_medio = lista_ordenada[medio]
        if elemento_medio == objetivo:
            indices.append(medio)
        elif objetivo < elemento_medio:
            derecha = medio - 1
        else:
            izquierda = medio + 1

    fin = time.perf_counter()
    time_taken = fin - inicio
    return indices, time_taken

def funcion_hash(datos,clave):
    tabla_hash = {}
    for i in range(len(datos)):
        tabla_hash[datos[i]] = i
    return [tabla_hash.get(clave, -1)]
        




