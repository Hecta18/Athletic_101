import { useState } from 'react';
import { CATEGORIAS } from '../utils/categorias';

const ESTADOS = ['pendiente', 'completado', 'abandonado'];

export default function FormularioItem({ itemEditando, onGuardar, onCancelar }) {
  const [nombre, setNombre] = useState(itemEditando?.nombre ?? '');
  const [categoriaId, setCategoriaId] = useState(itemEditando?.categoriaId ?? 'fuerza');
  const [estado, setEstado] = useState(itemEditando?.estado ?? 'pendiente');
  const [duracion, setDuracion] = useState(
    itemEditando ? String(itemEditando.atributos?.duracion ?? '') : ''
  );
  const [ejercicios, setEjercicios] = useState(itemEditando?.atributos?.ejercicios ?? '');
  const [notas, setNotas] = useState(itemEditando?.notas ?? '');

  function handleSubmit(e) {
    e.preventDefault();
    if (nombre.trim().length < 3) return;
    onGuardar({
      nombre: nombre.trim(),
      categoriaId,
      estado,
      notas,
      atributos: {
        duracion: Number(duracion) || 0,
        ejercicios: ejercicios.trim(),
      },
    });
    if (!itemEditando) {
      setNombre('');
      setDuracion('');
      setEjercicios('');
      setNotas('');
    }
  }

  return (
    <form className="formulario-item" onSubmit={handleSubmit}>
      <h2>{itemEditando ? 'Editar sesión' : 'Nueva sesión de entrenamiento'}</h2>
      <label>
        Nombre
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          minLength={3}
          required
        />
      </label>
      <label>
        Categoría
        <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)}>
          {CATEGORIAS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.emoji} {c.nombre}
            </option>
          ))}
        </select>
      </label>
      <label>
        Estado
        <select value={estado} onChange={(e) => setEstado(e.target.value)}>
          {ESTADOS.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
      </label>
      <label>
        Duración (min)
        <input
          type="number"
          min="0"
          value={duracion}
          onChange={(e) => setDuracion(e.target.value)}
        />
      </label>
      <label>
        Ejercicios
        <input
          type="text"
          value={ejercicios}
          onChange={(e) => setEjercicios(e.target.value)}
          placeholder="press banca, sentadilla..."
        />
      </label>
      <label>
        Notas
        <textarea value={notas} onChange={(e) => setNotas(e.target.value)} rows={2} />
      </label>
      <div className="formulario-botones">
        <button type="submit">{itemEditando ? 'Guardar cambios' : 'Agregar'}</button>
        {itemEditando && (
          <button type="button" className="btn-secundario" onClick={onCancelar}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
