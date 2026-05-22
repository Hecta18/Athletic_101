import ItemCard from './ItemCard';

export default function ListaItems({ items, onEditar, onEliminar }) {
  if (items.length === 0) {
    return <p className="lista-vacia">No hay sesiones activas. Agrega la primera arriba.</p>;
  }

  return (
    <section className="lista-items">
      <h2>Mis sesiones ({items.length})</h2>
      <div className="lista-grid">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} onEditar={onEditar} onEliminar={onEliminar} />
        ))}
      </div>
    </section>
  );
}
