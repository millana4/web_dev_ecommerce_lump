import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSocleFilter, setShapeFilter, setTypeFilter, resetFilters, selectFilters } from '../../store/slices/filtersSlice'
import { api } from '../../services/api'
import styles from './Sidebar.module.css'

function Sidebar() {
  const dispatch = useDispatch()
  const filtersFromStore = useSelector(selectFilters)
  const [filters, setFilters] = useState({ socle_id: '', shape_id: '', type_id: '' })
  const [socles, setSocles] = useState([])
  const [shapes, setShapes] = useState([])
  const [types, setTypes] = useState([])

  // Загружаем фильтры из хранилища только один раз при монтировании
  useEffect(() => {
    if (filtersFromStore) {
      setFilters(filtersFromStore)
    }
  }, [filtersFromStore])

  // Загружаем справочники
  useEffect(() => {
    Promise.all([
      api.getSocles(),
      api.getShapes(),
      api.getTypes()
    ]).then(([soclesData, shapesData, typesData]) => {
      setSocles(soclesData)
      setShapes(shapesData)
      setTypes(typesData)
    }).catch(err => console.error('Ошибка загрузки справочников:', err))
  }, [])

  const handleFilterChange = (filterName, value) => {
    switch (filterName) {
      case 'socle_id':
        dispatch(setSocleFilter(value))
        setFilters(prev => ({ ...prev, socle_id: value }))
        break
      case 'shape_id':
        dispatch(setShapeFilter(value))
        setFilters(prev => ({ ...prev, shape_id: value }))
        break
      case 'type_id':
        dispatch(setTypeFilter(value))
        setFilters(prev => ({ ...prev, type_id: value }))
        break
      default:
        break
    }
  }

  const handleResetFilters = () => {
    dispatch(resetFilters())
    setFilters({ socle_id: '', shape_id: '', type_id: '' })
  }

  return (
    <div className={styles.sidebar}>
      <h3>Фильтры</h3>
      
      <div className={styles.filterGroup}>
        <h4>Цоколь</h4>
        <select 
          value={filters.socle_id || ''} 
          onChange={(e) => handleFilterChange('socle_id', e.target.value)}
        >
          <option value="">Все</option>
          {socles.map(socle => (
            <option key={socle.socle_id} value={socle.socle_id}>
              {socle.title}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <h4>Форма</h4>
        <select 
          value={filters.shape_id || ''} 
          onChange={(e) => handleFilterChange('shape_id', e.target.value)}
        >
          <option value="">Все</option>
          {shapes.map(shape => (
            <option key={shape.shape_id} value={shape.shape_id}>
              {shape.title}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <h4>Тип лампы</h4>
        <select 
          value={filters.type_id || ''} 
          onChange={(e) => handleFilterChange('type_id', e.target.value)}
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
        className={styles.resetFiltersBtn}
        onClick={handleResetFilters}
      >
        Сбросить фильтры
      </button>
    </div>
  )
}

export default Sidebar