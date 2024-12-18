import styles from "./Navbar.module.css"
import { Link } from "react-router-dom"

const Navbar = () => {
    return (
        <div className={styles.navbar}>
            <div className={styles.logo}>
                <Link to="/">
                    <img
                        src="https://i.postimg.cc/FHjgxsy7/540469d81a0bd9705c09f109dd6d9196-removebg-preview.png"
                        alt="First Call Logo"
                        height="70px"
                    />
                </Link>
                <h1 style={{ color: 'white' }}>First Call</h1>
            </div>
            <Link to="#" className={styles.profiles} >
                <img src="./profile.png" alt="Profile" />
            </Link>
        </div>
    )
}

export default Navbar