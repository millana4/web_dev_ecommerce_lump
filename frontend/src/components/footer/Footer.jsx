import styles from "./Footer.module.css";

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3>COOL LUMP SHOP</h3>
          <p>Самые крутые лампочки для вашего дома</p>
        </div>
        <div className={styles.footerSection}>
          <h4>Контакты</h4>
          <p>Телефон: +7 (800) 123-45-67</p>
          <p>Email: info@coollump.ru</p>
        </div>
        <div className={styles.footerSection}>
          <h4>Режим работы</h4>
          <p>Пн-Пт: 9:00 - 20:00</p>
          <p>Сб-Вс: 10:00 - 18:00</p>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>&copy; 2026 COOL LUMP SHOP. Все права защищены.</p>
      </div>
    </footer>
  )
}

export default Footer