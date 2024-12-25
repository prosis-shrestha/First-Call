import React from 'react'
import socket from "../../socket";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import { Icon, latLng } from "leaflet";
import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import Navbar from "../../components/Navbar/Navbar"


const user = () => {

    const [ownLat, setOwnLat] = useState(null);
    const [ownLon, setOwnLon] = useState(null);
    const [ambuName, setAmbuName] = useState(null);
    const [ambuLat, setAmbuLat] = useState(null);
    const [ambuLon, setAmbuLon] = useState(null);
    const [allDrivers, setAllDrivers] = useState([])
    const [watchId, setWatchId] = useState(null);
    const [showRouting, setShowRouting] = useState(false);
    const location = useLocation();
    const { name } = location.state

    const customIcon = new Icon({
        iconUrl: "./ambulanceicon.png",
        iconSize: [70, 70],
    });

    const userIcon = new Icon({
        iconUrl: "./userIcon.png",
        iconSize: [60, 60],
    });

    const RoutingMachine = (({ loc, destination }) => {
        const map = useMap();
        useEffect(() => {
            const routingControl = L.Routing.control({
                waypoints: [
                    latLng(loc.ownLat, loc.ownLon),
                    latLng(destination.ambuLat, destination.ambuLon),
                    // latLng(27, 85),
                ],
                routeWhileDragging: false,
                addWaypoints: false,
                showAlternatives: false,
                show: false,
                createMarker: () => null,
            }).addTo(map);

            // Automatically fit the map to the route
            routingControl.on('routesfound', function (e) {
                const route = e.routes[0]; // Get the first (or best) route
                const bounds = L.latLngBounds(route.coordinates); // Get the bounds of the route
                map.fitBounds(bounds); // Adjust the map to fit the bounds
            });

            return () => {
                map.removeControl(routingControl);
            };

        }, []);
        return null;
    });

    useEffect(() => {
        socket.on("new-dlocation", (location) => {

            setAllDrivers(prevAllDrivers => {
                const existingItemIndex = prevAllDrivers.findIndex(item => item.dname === location.dname);
                if (existingItemIndex !== -1) {
                    const updatedAllDrivers = [...prevAllDrivers]
                    updatedAllDrivers[existingItemIndex] = {
                        ...updatedAllDrivers[existingItemIndex],
                        ...location,
                    };
                    return updatedAllDrivers;
                }
                return [...prevAllDrivers, location];
            });
        });

        socket.on("driver-left", (driverName) => {
            setAllDrivers((prevAllDrivers) =>
                prevAllDrivers.filter((driver) => driver.dname !== driverName)
            );
        });

        socket.on("driver-unavailable", (driverInfo) => {
            setAllDrivers((prevAllDrivers) =>
                prevAllDrivers.map((driver) =>
                    driver.dname === driverInfo.dname ? { ...driver, isActive: driverInfo.isActive } : driver
                )
            );
            setAmbuName(driverInfo.dname)
            setAmbuLat(driverInfo.latitude)
            setAmbuLon(driverInfo.longitude)
            setShowRouting(true);
        })

        socket.on("driver-available", (driverInfo) => {
            setAllDrivers((prevAllDrivers) =>
                prevAllDrivers.map((driver) =>
                    driver.dname === driverInfo.dname ? { ...driver, isActive: driverInfo.isActive } : driver
                )
            );
        })



        return () => {
            socket.off("new-dlocation");
            socket.off("driver-left");
        };


    }, []);

    useEffect(() => {
        socket.on("ride-complete", (data) => {

            if (data == ambuName) {
                setShowRouting(false)
                setAmbuLat(null)
                setAmbuLon(null)
                setAmbuName(null)
            }
            return () => {
                socket.off("ride-complete");
            };
        });
    }, [ambuName]);

    useEffect(() => {
        if (navigator.geolocation) {
            const id = navigator.geolocation.watchPosition((position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                setOwnLat(latitude)
                setOwnLon(longitude)


                socket.emit("send-location", { name, latitude, longitude });
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
        }
    }, [name]);


    const handleClick = (ambulanceName) => {
        socket.emit("user-call", { name, ambulanceName, ownLat, ownLon });
    }

    useEffect(() => {
        return () => {
            if (watchId !== null) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, [watchId]);


    return (
        <div className="bg-black">

            <Navbar />
            <div className="px-5 text-white text-center py-3">
                <p>Welcome! {name}. Click on Ambulance markers and Call to instantly get your Ambulance.</p><br></br>
                {showRouting && <p>Driver: {ambuName}</p>}
            </div>
            {ownLat &&
                <div className="h-[70vh] px-5 sm:px-20">
                    <MapContainer center={[ownLat, ownLon]} zoom={15} style={{ height: "100%" }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[ownLat, ownLon]} icon={userIcon}></Marker>
                        {allDrivers && allDrivers
                            .filter((ambulance) => {
                                return (!ambuName || (ambulance.dname === ambuName && showRouting));
                            })
                            .map((ambulance) => (
                                <Marker
                                    key={ambulance.dname}
                                    position={[ambulance.latitude, ambulance.longitude]}
                                    icon={customIcon}>
                                    {ambulance.isActive ? <Popup>
                                        {ambulance.dname}
                                        {ambulance.isActive && <button className="bg-green-500 text-white border-2 p-2 rounded-lg m-1 active:bg-green-300" onClick={() => handleClick(ambulance.dname)}>Call</button>}
                                    </Popup> :
                                        <Popup>
                                            {ambulance.dname} Occupied
                                        </Popup>}
                                </Marker>
                            ))}
                        {showRouting && <RoutingMachine loc={{ ownLat, ownLon }} destination={{ ambuLat, ambuLon }} />}
                    </MapContainer>
                </div >
            }
        </div>
    )
}

export default user