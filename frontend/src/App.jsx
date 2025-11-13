import { useState, useEffect } from 'react'
import EstructuraLineal from './components/EscLineales.jsx';
import Menu from './components/Menu.jsx';


function App() {
  const [menuPrincipal, setMenuPrincipal] = useState(true);
  const [estructuraSeleccionada, setEstructuraSeleccionada] = useState(null);
  

  
  const volverMenu = () => {
    setMenuPrincipal(true);
    setEstructuraSeleccionada(null);
  };



   // Renderizado de menús
  if (menuPrincipal) {
    return (
      <Menu
        setMenuPrincipal={setMenuPrincipal}
        setEstructuraSeleccionada={setEstructuraSeleccionada}
      />
    );
  }else{
    return (
      <EstructuraLineal 
        volverMenu={volverMenu}
        estructuraSeleccionada={estructuraSeleccionada}
      />
    );
  }
}

export default App
