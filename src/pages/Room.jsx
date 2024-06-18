import { useEffect, useRef, useState } from "react";
import {
    collection,
    getDoc,
    addDoc,
    doc,
    onSnapshot,
    updateDoc,
    setDoc,
} from "firebase/firestore";
import db from "../firebase/db";
import { useLocation } from "react-router-dom";

const Room = () => {
    // in case the room is already filled
    const [msg, setMsg] = useState("");

    // in case we already sent the offer dont send again in useEffect
    const [offered, setOffered] = useState(false);

    // getting the room id
    const loc = useLocation();
    const params = new URLSearchParams(loc.search);
    const roomId = params.get("roomId");

    // stun servers to get the ice candidates from
    const servers = {
        iceServers: [
            {
                urls: [
                    "stun:stun1.l.google.com:19302",
                    "stun:stun2.l.google.com:19302",
                ],
            },
        ],
        iceCandidatePoolSize: 10,
    };

    // refs for the local video elements
    const localCam = useRef(null);
    const [localStream, setLocalStream] = useState(new MediaStream());

    // refs for the remote video elements
    const remoteCam = useRef(null);
    let [remoteStream, setRemoteStream] = useState(new MediaStream());

    // setting up the peer connection
    const [rpc, setRPC] = useState(new RTCPeerConnection(servers));

    // function to add the local tracks to the rpc connection to be sent over ( just for testing)
    const handleSetRemote = () => {
        console.log("localstream: ", localStream);
        localStream.getTracks().forEach((track) => {
            console.log("adding track: ", track);
            rpc.addTrack(track, localStream);
        });
    };
    useEffect(() => {
        async function setupConnection() {
            // creating new peer connection to update rpc on the end of the function
            let pc = new RTCPeerConnection(servers);
            if (!localCam.current) {
                return;
            }
            // requesting the user for the camera access
            let s = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false,
            });
            setLocalStream(s);
            console.log("Got local stream: ", s);
            // setting the local stream to the local video element
            localCam.current.srcObject = s;
            // setting the remote stream to the remote video element (it will be updated when the remote stream is received)
            remoteCam.current.srcObject = remoteStream;
            if (s) {
                // sending local stream to the peer connection
                pc.addStream(s);
                // adding the event to handle tracks from remote stream
                pc.addEventListener("track", (event) => {
                    console.log(
                        "Got new track from remote: ",
                        event.streams[0]
                    );
                    // setting the remote stream to the remote video element
                    remoteCam.current.srcObject = event.streams[0];
                    // to hide the ui elements
                    setMsg("Got new track ");
                });
            }
            // getting the room reference
            const roomRef = doc(collection(db, "rooms"), roomId);
            const roomSnap = await getDoc(roomRef);
            if (roomSnap.exists() && roomSnap.data().offer) {
                // it means the room is already created and we are joining
                const answerCandidates = collection(
                    roomRef,
                    "answerCandidates"
                );
                const offerCandidates = collection(roomRef, "offerCandidates");
                const offerDescription = roomSnap.data().offer;
                const answerDesc = roomSnap.data().answer;
                if (answerDesc) {
                    // TODO: check if the answer is ours or not
                    // if not then the room is filled with two other people
                    setMsg("Room already filled ! cant join");
                    console.log("Room already filled ! cant join");
                    return;
                }
                // if we get ice cand we add it to the db for the other party
                pc.onicecandidate = async (event) => {
                    console.log("ice candidate added");
                    try {
                        console.log("Adding ice candidate");
                        event.candidate &&
                            (await addDoc(
                                answerCandidates,
                                event.candidate.toJSON()
                            ));
                    } catch (err) {
                        console.log(err);
                    }
                };
               
                // setting the remote description to the offer we got from db
                await pc.setRemoteDescription(
                    new RTCSessionDescription(offerDescription)
                );
                // we create an answer and set it as our local description
                const answerDescription = await pc.createAnswer();
                await pc.setLocalDescription(answerDescription);

                const answer = {
                    type: answerDescription.type,
                    sdp: answerDescription.sdp,
                };
                // we send the answer to the room
                await updateDoc(roomRef, { answer });

                //  a listener to get the ice candidates from the other party
                onSnapshot(offerCandidates, (snapshot) => {
                    snapshot.docChanges().forEach((change) => {
                        console.log("ice candidate added from remote");
                        if (change.type === "added") {
                            let data = change.doc.data();
                            pc.addIceCandidate(new RTCIceCandidate(data));
                        }
                    });
                });
            } else {
                // room does not exist we have to create one
                await setDoc(doc(collection(db, "rooms"), roomId), {});
                // getting the room reference
                const roomR = doc(collection(db, "rooms"), roomId);
                // creating two collections for the ice candidates (offered ones and answered ones)
                const offerCandidates = collection(
                    db,
                    "rooms",
                    roomId,
                    "offerCandidates"
                );
                const answerCandidates = collection(
                    db,
                    "rooms",
                    roomId,
                    "answerCandidates"
                );
                // if we get ice cand we add it to the offer since we are offering the connection
                pc.onicecandidate = async (event) => {
                    console.log("ice candidate added");
                    event.candidate &&
                        (await addDoc(
                            offerCandidates,
                            event.candidate.toJSON()
                        ));
                };
                // creating the offer and setting it to the local description
                const offerDescription = await pc.createOffer();
                await pc.setLocalDescription(offerDescription);
                const offer = {
                    sdp: offerDescription.sdp,
                    type: offerDescription.type,
                };
                // setting the offer to the room
                await setDoc(roomR, { offer });
                // setting the offered to true so that we dont send the offer again
                // when useEffect executes the second time
                setOffered(true);

                // adding a listener to the room to get the answer
                onSnapshot(
                    roomR,
                    (snapshot) => {
                        const data = snapshot.data();
                        if (pc.currentRemoteDescription) {
                            // TODO: unsubscribe from the snapshot
                        }
                        if (!pc.currentRemoteDescription && data?.answer) {
                            // we got an answer , we set it as our remote description
                            const answerDescription = new RTCSessionDescription(
                                data.answer
                            );
                            pc.setRemoteDescription(answerDescription);
                            // adding on track listener again (not sure if it is needed)
                            pc.addEventListener("track", (event) => {
                                console.log("Got new track ", event.streams[0]);
                                remoteCam.current.srcObject = event.streams[0];

                                setMsg("Got new track ");
                            });
                        }
                    },
                    (err) => console.log(err)
                );

                onSnapshot(answerCandidates, (snapshot) => {
                    //if we get any ice candidate from remote we add it to the connection
                    snapshot.docChanges().forEach((change) => {
                        if (change.type === "added") {
                            const candidate = new RTCIceCandidate(
                                change.doc.data()
                            );
                            pc.addIceCandidate(candidate);
                        }
                    });
                });
            }
            // we update our rpc connection
            setRPC(pc);
        }

        // if it is running for the second time we dont want to send the offer again
        if (!offered) {
            setupConnection();
        }
    }, []);
    return (
        <div className="w-full h-[100vh] flex flex-col justify-center ">
            {/* if we got tracks from remote we remove the ui elements */}
            {msg !== "Got new track " && (
                <div className="absolute top-10 left-1/2 -translate-x-1/2">
                    <h1>Current room Id: {roomId}</h1>
                    {msg && <p className="text-red-500">{msg}</p>}
                    {/* <div>
                        <button onClick={handleSetRemote}>
                            set remote stream
                        </button>
                    </div> */}
                </div>
            )}
             {/* local video element */}
            <div className="absolute bottom-0 left-0 w-44">
                <video
                    className="w-full h-full "
                    ref={localCam}
                    playsInline
                    autoPlay
                ></video>
            </div>
            {/* remote video */}
            <div className="w-full h-full ">
                <video
                    onLoad={(e) => console.log("Loaded: ", e)}
                    className="w-full h-full "
                    autoPlay
                    playsInline
                    ref={remoteCam}
                ></video>
            </div>
        </div>
    );
};

export default Room;
