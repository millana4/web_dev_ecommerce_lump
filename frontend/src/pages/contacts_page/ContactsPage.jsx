import styles from './ContactsPage.module.css'

function ContactsPage() {
  return (
    <div className={styles.contactsPage}>
      <h1>Контакты и реквизиты</h1>
      
      <div className={styles.contactsContainer}>
        {/* Контакты */}
        <div className={styles.contactsCard}>
          <h2>Наши контакты</h2>
          
          <div className={styles.contactItem}>
            <span className={styles.contactIcon}>📞</span>
            <div>
              <h3>Телефон</h3>
              <p>+7 (800) 123-45-67</p>
              <p>+7 (495) 987-65-43</p>
            </div>
          </div>

          <div className={styles.contactItem}>
            <span className={styles.contactIcon}>✉️</span>
            <div>
              <h3>Email</h3>
              <p>info@coollump.ru</p>
              <p>sales@coollump.ru</p>
            </div>
          </div>

          <div className={styles.contactItem}>
            <span className={styles.contactIcon}>📍</span>
            <div>
              <h3>Адрес</h3>
              <p>г. Москва, ул. Тверская, д. 15</p>
              <p>БЦ "Тверской", офис 405</p>
            </div>
          </div>

          <div className={styles.contactItem}>
            <span className={styles.contactIcon}>⏰</span>
            <div>
              <h3>Режим работы</h3>
              <p>Пн-Пт: 9:00 - 20:00</p>
              <p>Сб-Вс: 10:00 - 18:00</p>
            </div>
          </div>
        </div>

        {/* Реквизиты */}
        <div className={styles.requisitesCard}>
          <h2>Реквизиты</h2>
          <div className={styles.requisitesItem}>
            <p><strong>Полное наименование:</strong> ООО "КРУТЫЕ ЛАМПОЧКИ"</p>
            <p><strong>ИНН:</strong> 7712345678</p>
            <p><strong>КПП:</strong> 771001001</p>
            <p><strong>ОГРН:</strong> 1234567890123</p>
            <p><strong>Расчётный счёт:</strong> 40702810123456789012</p>
            <p><strong>Банк:</strong> ПАО "СБЕРБАНК" г. Москва</p>
            <p><strong>БИК:</strong> 044525225</p>
            <p><strong>Корр. счёт:</strong> 30101810400000000225</p>
            <p><strong>Юридический адрес:</strong> 125009, г. Москва, ул. Тверская, д. 15</p>
          </div>
        </div>
      </div>

      {/* Карта */}
      <div className={styles.mapCard}>
        <h2>Мы на карте</h2>
        <iframe
          src="https://yandex.ru/map-widget/v1/?um=constructor%3A5f8f4b7e4c5c1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8&source=constructor"
          width="100%"
          height="400"
          frameBorder="0"
          allowFullScreen
          title="Карта"
          className={styles.map}
        ></iframe>
        <p className={styles.mapHint}>г. Москва, ул. Тверская, д. 15, БЦ "Тверской"</p>
      </div>
    </div>
  )
}

export default ContactsPage