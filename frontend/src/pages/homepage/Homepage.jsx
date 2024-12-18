import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"
import Navbar from "../../components/Navbar/Navbar"
import styles from './homepage.module.css';
import Button from '../../components/Button/Button'

const Homepage = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [dname, setDname] = useState("");
    const [showUserInput, setShowUserInput] = useState(false)
    const [showAgentInput, setShowAgentInput] = useState(false)

    const handleUser = (e) => {
        e.preventDefault();
        navigate('/user', { state: { name: name } });
    };

    const handleAgent = (e) => {
        e.preventDefault();
        navigate('/agent', { state: { dname: dname } });
    };



    return (
        <div style={{
            backgroundImage: "url(https://images.pexels.com/photos/8943280/pexels-photo-8943280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            height: "100vh",
            color: "white"
        }}>
            <Navbar />
            <div className={styles.main}>
                <div className={styles.left}>
                    {(!showAgentInput && !showUserInput) && <h1 className={styles.heading}>Select Your Role</h1>}
                    {!showUserInput && !showAgentInput ?
                        (
                            <>
                                <Button onClick={() => setShowUserInput(true)}>User</Button>
                                <Button onClick={() => setShowAgentInput(true)}>Ambulance Agent</Button>

                            </>
                        )
                        :
                        (
                            <>
                                {showUserInput && (
                                    <form onSubmit={handleUser} style={{ textAlign: "center" }}>
                                        <label className="form-label">User name</label>
                                        <br></br>
                                        <input type="text" className="form-control" required value={name} onChange={(e) => setName(e.target.value)}
                                            style={{ padding: "0.5rem", marginTop: "2rem", minWidth: "15rem" }} />
                                        <br></br>
                                        <Button type="submit" className="btn btn-primary">Submit</Button>
                                    </form>
                                )}
                                {showAgentInput &&
                                    (<form onSubmit={handleAgent} style={{ textAlign: "center" }}>
                                        <label className="form-label">Agent name</label>
                                        <br></br>
                                        <input type="text" className="form-control" required value={dname} onChange={(e) => setDname(e.target.value)}
                                            style={{ padding: "0.5rem", marginTop: "2rem", minWidth: "15rem" }} />
                                        <br></br>
                                        <Button type="submit" className="btn btn-primary">Submit</Button>
                                    </form>
                                    )}
                            </>
                        )}
                </div>
                <div className={styles.right}>
                    <img src="./homeimage.png" alt="First Call Logo" className={styles.image} />
                </div>
            </div>
        </div >
    );
}

export default Homepage