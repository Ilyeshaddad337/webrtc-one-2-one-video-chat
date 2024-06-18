import { useState, useEffect, useRef } from "react";
import "./App.css";
import db from "./firebase/db";
import { Route, Routes } from "react-router-dom";
import Sender from "./pages/Sender";
import Receiver from "./pages/Receiver";
import Initial from "./pages/Initial";
import Room from "./pages/Room";

function App() {
    // const servers = {
    //     iceServers: [
    //         {
    //             urls: [
    //                 "stun:stun1.l.google.com:19302",
    //                 "stun:stun2.l.google.com:19302",
    //             ],
    //         },
    //     ],
    //     iceCandidatePoolSize: 10,
    // };
    // const pc = new RTCPeerConnection(servers); //servers
    // let localStream = new MediaStream();
    // const recieveVid = useRef(null);
    // useEffect(() => {
    //     //fetchData()
    // }, []);
    return (
        <div className="w-full h-full relative">
            <Routes>
                {/* public routes */}
                <Route path="/" element={<Initial />} />
                {/* <Route
                    path="/sender"
                    element={<Sender pc={pc} localStream={localStream} />}
                />
                <Route
                    path="/receiver"
                    element={
                        <Receiver
                            pc={pc}
                            recvVid={recieveVid}
                        />
                    }
                /> */}

                <Route path="/join" element={<Room />} />
            </Routes>
        </div>
    );
}

export default App;
