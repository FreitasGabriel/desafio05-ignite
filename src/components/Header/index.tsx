import Link from 'next/link'
import styles from './header.module.scss'

export default function Header() {

  return (
    <header className={styles.header}>
      <Link href="/">
        <div className={styles.centralDiv}>
          <img alt="logo" src="/logo.svg" />
        </div>
      </Link>
    </header>
  )
}
