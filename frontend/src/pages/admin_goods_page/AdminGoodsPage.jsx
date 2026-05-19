import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectToken } from '../../store/slices/authSlice'
import { api } from '../../services/api'
import styles from './AdminGoodsPage.module.css'

const emptyForm = {
  title: '', price: '', quantity: 0, description: '',
  socle_id: '', shape_id: '', type_id: '',
  power: '', illumination: '', size: '',
}

function AdminGoodsPage() {
  const token = useSelector(selectToken)
  const [goods, setGoods] = useState([])
  const [socles, setSocles] = useState([])
  const [shapes, setShapes] = useState([])
  const [types, setTypes] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  const loadAll = async () => {
    try {
      const [g, s, sh, t] = await Promise.all([
        api.getGoods(), api.getSocles(), api.getShapes(), api.getTypes(),
      ])
      setGoods(g); setSocles(s); setShapes(sh); setTypes(t)
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => { loadAll() }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const startCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  const startEdit = (good) => {
    setEditingId(good.good_id)
    setForm({
      title: good.title || '',
      price: good.price || '',
      quantity: good.quantity || 0,
      description: good.description || '',
      socle_id: good.socle_id || '',
      shape_id: good.shape_id || '',
      type_id: good.type_id || '',
      power: good.power || '',
      illumination: good.illumination || '',
      size: good.size || '',
    })
    setShowForm(true)
  }

  const cancel = () => {
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const payload = {
      title: form.title,
      price: parseFloat(form.price),
      quantity: parseInt(form.quantity) || 0,
      description: form.description || null,
      socle_id: form.socle_id ? parseInt(form.socle_id) : null,
      shape_id: form.shape_id ? parseInt(form.shape_id) : null,
      type_id: form.type_id ? parseInt(form.type_id) : null,
      power: form.power ? parseInt(form.power) : null,
      illumination: form.illumination ? parseInt(form.illumination) : null,
      size: form.size ? parseFloat(form.size) : null,
    }
    try {
      if (editingId) {
        await api.updateGood(editingId, payload, token)
      } else {
        await api.createGood(payload, token)
      }
      cancel()
      loadAll()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Удалить товар?')) return
    try {
      await api.deleteGood(id, token)
      loadAll()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div>
      <div className={styles.toolbar}>
        <h3>Товары</h3>
        <button onClick={startCreate} className={styles.btnPrimary}>+ Добавить товар</button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <h4>{editingId ? `Редактирование #${editingId}` : 'Новый товар'}</h4>
          <div className={styles.row}>
            <input name="title" placeholder="Название *" value={form.title} onChange={handleChange} required />
            <input name="price" type="number" step="0.01" placeholder="Цена *" value={form.price} onChange={handleChange} required />
            <input name="quantity" type="number" placeholder="Остаток" value={form.quantity} onChange={handleChange} />
          </div>
          <div className={styles.row}>
            <select name="socle_id" value={form.socle_id} onChange={handleChange}>
              <option value="">Цоколь —</option>
              {socles.map(s => <option key={s.socle_id} value={s.socle_id}>{s.title}</option>)}
            </select>
            <select name="shape_id" value={form.shape_id} onChange={handleChange}>
              <option value="">Форма —</option>
              {shapes.map(s => <option key={s.shape_id} value={s.shape_id}>{s.title}</option>)}
            </select>
            <select name="type_id" value={form.type_id} onChange={handleChange}>
              <option value="">Тип —</option>
              {types.map(t => <option key={t.type_id} value={t.type_id}>{t.title}</option>)}
            </select>
          </div>
          <div className={styles.row}>
            <input name="power" type="number" placeholder="Мощность (Вт)" value={form.power} onChange={handleChange} />
            <input name="illumination" type="number" placeholder="Световой поток (лм)" value={form.illumination} onChange={handleChange} />
            <input name="size" type="number" step="0.1" placeholder="Размер" value={form.size} onChange={handleChange} />
          </div>
          <textarea name="description" placeholder="Описание" value={form.description} onChange={handleChange} rows="3" />
          <div className={styles.formActions}>
            <button type="submit" className={styles.btnPrimary}>Сохранить</button>
            <button type="button" onClick={cancel} className={styles.btnSecondary}>Отмена</button>
          </div>
        </form>
      )}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th><th>Название</th><th>Цена</th><th>Остаток</th><th>Видимый</th><th></th>
          </tr>
        </thead>
        <tbody>
          {goods.map(g => (
            <tr key={g.good_id}>
              <td>{g.good_id}</td>
              <td>{g.title}</td>
              <td>{g.price} ₽</td>
              <td>{g.quantity}</td>
              <td>{g.is_visible ? 'Да' : 'Нет'}</td>
              <td>
                <button onClick={() => startEdit(g)} className={styles.btnEdit}>✎</button>
                <button onClick={() => handleDelete(g.good_id)} className={styles.btnDelete}>×</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminGoodsPage