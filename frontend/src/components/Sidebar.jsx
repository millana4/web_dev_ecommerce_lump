function Sidebar({ filters, onFilterChange, socles, shapes, types }) {
  return (
    <div className="sidebar">
      <h3>Фильтры</h3>
      
      <div className="filter-group">
        <h4>Цоколь</h4>
        <select 
          value={filters.socle_id || ''} 
          onChange={(e) => onFilterChange('socle_id', e.target.value)}
        >
          <option value="">Все</option>
          {socles.map(socle => (
            <option key={socle.socle_id} value={socle.socle_id}>
              {socle.title}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <h4>Форма</h4>
        <select 
          value={filters.shape_id || ''} 
          onChange={(e) => onFilterChange('shape_id', e.target.value)}
        >
          <option value="">Все</option>
          {shapes.map(shape => (
            <option key={shape.shape_id} value={shape.shape_id}>
              {shape.title}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <h4>Тип лампы</h4>
        <select 
          value={filters.type_id || ''} 
          onChange={(e) => onFilterChange('type_id', e.target.value)}
        >
          <option value="">Все</option>
          {types.map(type => (
            <option key={type.type_id} value={type.type_id}>
              {type.title}
            </option>
          ))}
        </select>
      </div>

      <button 
        className="reset-filters-btn"
        onClick={() => {
          onFilterChange('socle_id', '')
          onFilterChange('shape_id', '')
          onFilterChange('type_id', '')
        }}
      >
        Сбросить фильтры
      </button>
    </div>
  )
}

export default Sidebar