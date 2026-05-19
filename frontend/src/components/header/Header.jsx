import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { selectCartTotalItems } from '../../store/slices/cartSlice'
import { selectIsAdmin, selectUser, logout } from '../../store/slices/authSlice'
import styles from './Header.module.css'

function Header() {
  const totalItems = useSelector(selectCartTotalItems)
  const isAdmin = useSelector(selectIsAdmin)
  const user = useSelector(selectUser)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <header className={styles.header}>
      <nav>
        <Link to="/">Главная</Link>
        <Link to="/catalog">Каталог</Link>
        <Link to="/cart">Корзина {totalItems > 0 && `(${totalItems})`}</Link>
        <Link to="/contacts">Контакты</Link>
        {isAdmin && <Link to="/admin">Админка</Link>}
      </nav>
      <div className={styles.right}>
        <h1>COOL LUMP SHOP</h1>
        {isAdmin ? (
          <span className={styles.userBox}>
            {user?.username}
            <button onClick={handleLogout} className={styles.logoutBtn}>Выйти</button>
          </span>
        ) : (
          <Link to="/login" className={styles.loginLink}>Войти</Link>
        )}
      </div>
    </header>
  )
}

export default Header