
import { ChevronRight } from 'lucide-react';


function Menu({setMenuPrincipal, setEstructuraSeleccionada}) {

  const seleccionarEstructura = (estructura) => {
    setEstructuraSeleccionada(estructura);
    setMenuPrincipal(false);
  };


    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            PROGRAMA DE ESTRUCTURAS DE DATOS
          </h1>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 text-green-600">MENÚ PRINCIPAL</h2>
            
            <div className="space-y-2">
              <button
                onClick={() => seleccionarEstructura('pila')}
                className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded flex items-center"
              >
                <ChevronRight className="mr-2" size={20} />
                <span className="font-semibold">1. PILAS</span>
              </button>
              
              <button
                onClick={() => seleccionarEstructura('cola')}
                className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded flex items-center"
              >
                <ChevronRight className="mr-2" size={20} />
                <span className="font-semibold">2. COLAS</span>
              </button>
              
              <button
                onClick={() => seleccionarEstructura('lista')}
                className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded flex items-center"
              >
                <ChevronRight className="mr-2" size={20} />
                <span className="font-semibold">3. LISTAS</span>
              </button>
              
              <button
                onClick={() => seleccionarEstructura('arbol')}
                className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded flex items-center"
              >
                <ChevronRight className="mr-2" size={20} />
                <span className="font-semibold">4. ÁRBOLES</span>
              </button>
              
              <button
                onClick={() => seleccionarEstructura('grafo')}
                className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded flex items-center"
              >
                <ChevronRight className="mr-2" size={20} />
                <span className="font-semibold">5. GRAFOS</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  
}

export default Menu;