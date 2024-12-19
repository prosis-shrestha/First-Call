import React from 'react'
import socket from "../../socket";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import { Icon, latLng } from "leaflet";
import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import styles from './agent.module.css';
import Button from '../../components/Button/Button'
import Navbar from "../../components/Navbar/Navbar"

const agent = () => {
    const [ownLat, setOwnLat] = useState(null);
    const [ownLon, setOwnLon] = useState(null);
    const [userLat, setUserLat] = useState(null);
    const [userLon, setUserLon] = useState(null);
    const [userName, setUserName] = useState("");
    const [watchId, setWatchId] = useState(null);
    const [showRouting, setShowRouting] = useState(false);
    const [isActive, setIsActive] = useState(false)
    const location = useLocation();
    const { dname } = location.state

    const customIcon = new Icon({
        iconUrl: "./ambulanceicon.png",
        iconSize: [70, 70],
    });

    const userIcon = new Icon({
        iconUrl: "./userIcon.png",
        iconSize: [60, 60],
    });

    const RoutingMachine = React.memo(({ loc, destination }) => {
        const map = useMap();
        useEffect(() => {
            if (!map || !loc || !destination) return;
            const routingControl = L.Routing.control({
                waypoints: [
                    // latLng(loc.ownLat, loc.ownLon),
                    latLng(27, 83),
                    latLng(destination.userLat, destination.userLon),
                ],
                routeWhileDragging: false,
                addWaypoints: false,
                showAlternatives: false,
                createMarker: () => null,
            }).addTo(map);

            // Automatically fit the map to the route
            routingControl.on('routesfound', function (e) {
                const route = e.routes[0]; // Get the first (or best) route
                const bounds = L.latLngBounds(route.coordinates); // Get the bounds of the route
                map.fitBounds(bounds); // Adjust the map to fit the bounds
            });

            return () => {
                if (routingControl) {
                    map.removeControl(routingControl);
                }
            };
        }, [loc, map, destination]);
        return null;
    });

    useEffect(() => {
        const handleBeforeUnload = () => {
            if (dname) {
                socket.emit("driver-disconnect", dname);
            }
        };

        const handleDisconnect = () => {
            if (dname) {
                socket.emit("driver-disconnect", dname);
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        socket.on('disconnect', handleDisconnect);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [dname]);

    useEffect(() => {
        socket.on("call-receive", (datas) => {
            if (datas.ambulanceName === dname) {
                setUserName(datas.name);
                setUserLat(datas.ownLat)
                setUserLon(datas.ownLon)
            }
        });

        socket.on("driver-available", (driverInfo) => {
            if (driverInfo.isActive === true && driverInfo.dname === dname)
                setIsActive(true)
        })

        return () => {
            socket.off("call-receive");
        };
    }, [dname]);

    useEffect(() => {
        if (navigator.geolocation) {
            const id = navigator.geolocation.watchPosition((position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                setOwnLat(latitude)
                setOwnLon(longitude)


                socket.emit("send-dlocation", { dname, latitude, longitude });
            },
                (error) => {
                    console.error("Error occurred while watching position:", error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                });
            setWatchId(id);

            const fetchDriverStatus = async () => {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/drivers/${dname}`)
                const result = await response.json();

                if (!response.ok) {
                    console.log(result.error);
                }
                if (response.ok) {
                    setIsActive(result.isActive)
                }
            }
            fetchDriverStatus();
        }
    }, [dname]);


    useEffect(() => {
        return () => {
            if (watchId !== null) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, [watchId]);

    const handleAccept = () => {
        socket.emit("driver-inactive", dname);
        setShowRouting(true);
    }
    const handleActiveStatus = () => {
        socket.emit("driver-active", dname);
    }

    const handleComplete = () => {
        socket.emit("driver-active", dname);
        socket.emit("call-ride-complete", dname);
        setShowRouting(false);
        setUserName("")
        setUserLat(null)
        setUserLon(null)
    }

    return (
        <>
            <Navbar />
            <div className={styles.main}>
                <div className={styles.left}>
                    <div className={styles.info}>
                        <p>Welcome! {dname}</p>
                        <br></br>
                        {!isActive && !showRouting &&
                            <Button onClick={() => handleActiveStatus()}>Go Online</Button>}
                        {userName && !showRouting &&
                            <>
                                <p>{userName} asked for Ambulance</p>
                                <Button onClick={() => handleAccept()}>Accept</Button>
                            </>
                        }
                        {showRouting && <Button onClick={() => handleComplete()}>Complete Ride</Button>}
                    </div>
                </div>
                {ownLat &&
                    <div className={styles.map}>
                        <MapContainer center={[ownLat, ownLon]} zoom={15} style={{ height: "100%" }}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker icon={customIcon} position={[ownLat, ownLon]}></Marker>
                            {userName && <Marker position={[userLat, userLon]} icon={userIcon}></Marker>}
                            {showRouting && <RoutingMachine loc={{ ownLat, ownLon }} destination={{ userLat, userLon }} />}
                        </MapContainer>
                    </div >
                }
            </div>
        </>
    )
}

export default agent