import { useState, useEffect } from 'react';
import FormularioItem from './components/FormularioItem';
import ListaItems from './components/ListaItems';
import './App.css';

function crearItem(datos) {
  const ahora = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    nombre: datos.nombre,
    categoriaId: datos.categoriaId,
    estado: datos.estado || 'pendiente',
    puntuacion: null,
    fechaRegistro: ahora,
    fechaActividad: ahora,
    notas: datos.notas || '',
    atributos: datos.atributos || { duracion: 0, ejercicios: '' },
    activo: true,
  };
}

function App() {
  const [items, setItems] = useState(() => {
    try {
      const guardado = localStorage.getItem('items');
      return guardado ? JSON.parse(guardado) : [];
    } catch {
      return [];
    }
  });

  const [itemEditando, setItemEditando] = useState(null);

  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(items));
  }, [items]);

  const itemsActivos = items.filter((i) => i.activo);

  function handleGuardar(datos) {
    if (itemEditando) {
      setItems(
        items.map((i) =>
          i.id === itemEditando.id
            ? {
                ...i,
                nombre: datos.nombre,
                categoriaId: datos.categoriaId,
                estado: datos.estado,
                notas: datos.notas,
                atributos: datos.atributos,
                fechaActividad: new Date().toISOString(),
              }
            : i
        )
      );
      setItemEditando(null);
    } else {
      setItems([...items, crearItem(datos)]);
    }
  }

  function handleEliminar(id) {
    setItems(items.map((i) => (i.id === id ? { ...i, activo: false } : i)));
    if (itemEditando?.id === id) setItemEditando(null);
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Mi Colección — Entrenamiento Físico</h1>
        <p>Sesiones guardadas en este navegador (Fase 1)</p>
      </header>

      <FormularioItem
        key={itemEditando?.id ?? 'nuevo'}
        itemEditando={itemEditando}
        onGuardar={handleGuardar}
        onCancelar={() => setItemEditando(null)}
      />

      <ListaItems
        items={itemsActivos}
        onEditar={setItemEditando}
        onEliminar={handleEliminar}
      />
    </div>
  );
}

export default App;
