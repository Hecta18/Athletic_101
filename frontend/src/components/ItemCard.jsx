import { CATEGORIAS } from '../utils/categorias';

export default function ItemCard({ item, onEditar, onEliminar }) {
  const cat = CATEGORIAS.find((c) => c.id === item.categoriaId);

  return (
    <article className="item-card" style={{ borderLeftColor: cat?.color || '#E63946' }}>
      <header>
        <span className="item-emoji">{cat?.emoji}</span>
        <h3>{item.nombre}</h3>
      </header>
      <p>
        <strong>Categoría:</strong> {cat?.nombre ?? item.categoriaId}
      </p>
      <p>
        <strong>Estado:</strong> {item.estado}
      </p>
      <p>
        <strong>Duración:</strong> {item.atributos?.duracion ?? 0} min
      </p>
      {item.atributos?.ejercicios && (
        <p>
          <strong>Ejercicios:</strong> {item.atributos.ejercicios}
        </p>
      )}
      {item.notas && (
        <p>
          <strong>Notas:</strong> {item.notas}
        </p>
      )}
      <footer>
        <button type="button" onClick={() => onEditar(item)}>
          Editar
        </button>
        <button type="button" className="btn-peligro" onClick={() => onEliminar(item.id)}>
          Archivar
        </button>
      </footer>
    </article>
  );
}
