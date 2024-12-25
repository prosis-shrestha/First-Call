import { useState } from "react";
import { useNavigate } from "react-router-dom"
import Navbar from "../../components/Navbar/Navbar"
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
        <div
            className="bg-cover bg-center bg-no-repeat h-screen w-full"
            style={{
                backgroundImage: "url('https://images.pexels.com/photos/8943280/pexels-photo-8943280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')"
            }}
        >
            <Navbar />
            <div className="flex justify-between gap-1 px-20">
                <div className="lg:w-[50vw] flex flex-col items-center gap-8">
                    {(!showAgentInput && !showUserInput) && <h1 className="mt-16 text-3xl font-medium text-white">Select Your Role</h1>}
                    {!showUserInput && !showAgentInput ?
                        (
                            <>
                                <Button onClick={() => setShowUserInput(true)}>User</Button>
                                <Button onClick={() => setShowAgentInput(true)}>Ambulance Agent</Button>

                            </>
                        )
                        :
                        (
                            <div className="mt-16">
                                {showUserInput && (
                                    <form onSubmit={handleUser} style={{ textAlign: "center" }}>
                                        <label className="text-3xl font-medium text-white">User name</label>
                                        <br></br>
                                        <input type="text" className="form-control" required value={name} onChange={(e) => setName(e.target.value)}
                                            style={{ padding: "0.5rem", marginTop: "2rem", minWidth: "15rem" }} />
                                        <br></br>
                                        <Button type="submit" className="btn btn-primary mt-8">Submit</Button>
                                    </form>
                                )}
                                {showAgentInput &&
                                    (<form onSubmit={handleAgent} style={{ textAlign: "center" }}>
                                        <label className="text-3xl font-medium text-white">Agent name</label>
                                        <br></br>
                                        <input type="text" className="form-control" required value={dname} onChange={(e) => setDname(e.target.value)}
                                            style={{ padding: "0.5rem", marginTop: "2rem", minWidth: "15rem" }} />
                                        <br></br>
                                        <Button type="submit" className="btn btn-primary mt-8">Submit</Button>
                                    </form>
                                    )}
                            </div>
                        )}
                </div>
                <div className="hidden lg:block w-[50vw]">
                    <img src="./homeimage.png" alt="First Call Logo" className=" h-[70vh] border-3 border-white rounded-[24px]" />
                </div>
            </div>
        </div >
    );
}

export default Homepage