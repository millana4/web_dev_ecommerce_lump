import { Link, Outlet, useLocation } from 'react-router-dom'
import styles from './AdminPage.module.css'

function AdminPage() {
  const location = useLocation()
  const isMain = location.pathname === '/admin'

  return (
    <div className={styles.adminPage}>
      <h2>Админ-панель</h2>
      <nav className={styles.adminNav}>
        <Link to="/admin/goods" className={styles.navLink}>Товары</Link>
        <Link to="/admin/orders" className={styles.navLink}>Заказы</Link>
      </nav>
      {isMain && (
        <p className={styles.hint}>Выберите раздел сверху, чтобы начать работу.</p>
      )}
      <Outlet />
    </div>
  )
}

export default AdminPage