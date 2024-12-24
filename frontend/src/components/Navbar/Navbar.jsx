import styles from "./Navbar.module.css"
import { Link } from "react-router-dom"

const Navbar = () => {
    return (
        <div className="flex justify-between px-10 sm:px-20 py-8">
            <div className="flex items-center">
                <Link to="/">
                    <img
                        src="https://i.postimg.cc/FHjgxsy7/540469d81a0bd9705c09f109dd6d9196-removebg-preview.png"
                        alt="First Call Logo"
                        className="h-20"
                    />
                </Link>
                <h1 className="text-white text-3xl font-bold">First Call</h1>
            </div>
            <Link to="#" className="flex items-center" >
                <img src="./profile.png" alt="Profile" className="h-10" />
            </Link>
        </div>
    )
}

export default Navbar