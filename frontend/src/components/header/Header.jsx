import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCartTotalItems } from "../../store/slices/cartSlice";
import styles from "./Header.module.css";

function Header() {
  const totalItems = useSelector(selectCartTotalItems)

  return (
    <header className={styles.header}>
      <nav>
        <Link to="/">Главная</Link>
        <Link to="/catalog">Каталог</Link>
        <Link to="/cart">Корзина {totalItems > 0 && `(${totalItems})`}</Link>
      </nav>
      <h1>COOL LUMP SHOP</h1>
    </header>
  )
}

export default Header