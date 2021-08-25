import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import { returningSignal ,currentUser, eventListener, sendingSignal } from "../modules/FirbaseModels"

import database from "../config"

//firebase init
const Container = styled.div`
    padding: 20px;
    display: flex;
    height: 100vh;
    width: 90%;
    margin: auto;
    flex-wrap: wrap;
`;

const StyledVideo = styled.video`
    height: 40%;
    width: 50%;
`;

const Video = (props) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }, []);

    return (
        <StyledVideo playsInline autoPlay ref={ref} />
    );
}

//create userID




const videoConstraints = {
    height: window.innerHeight / 2,
    width: window.innerWidth / 2
};

const Room = (props) => {
    const [peers, setPeers] = useState([]);
    const userVideo = useRef();
    const peersRef = useRef([]);
    const roomID = props.match.params.roomID;
    var currentUserID = [];
    var userSteam = null;



    useEffect(() => {

        
        // firebase Listener
        eventListener(roomID, handleUpdate)
        
        currentUser(roomID)


        // connect to socket
        navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then(stream => {
            userVideo.current.srcObject = stream;
            userSteam = stream;



            const peers = [];
            database.ref('/notifs/' + roomID)
                .get().then((snapshot) => {
                    
                    const data = snapshot.val()
                    Object.keys(data).forEach((userID) => {
                        if(userID !== currentUserID[0]){
                            const peer = createPeer(userID, currentUserID[0], stream);
                            peersRef.current.push({
                                peerID: userID,
                                peer,
                            })
                            peers.push(peer);
                            console.log("create peer with " + userID)
                        }
                    })
                    
                })
                setPeers(peers);


            

            
        })
    }, []);

    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {
            sendingSignal(userToSignal, callerID, signal, roomID)
            console.log("sending signal to " + userToSignal)
            
        })

        return peer;
    }

    function addPeer(incomingSignal, callerID, stream, to) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })

        peer.on("signal", signal => {
            returningSignal(roomID ,signal, callerID, to)
            console.log("send acceptation of the signal")
            
        })

        peer.signal(incomingSignal);

        return peer;
    }

    const handleUpdate = (notifs, roomID) => {
        if (notifs) {
            switch (notifs.type) {
                case 'currentUser':
                    currentUserID.push(notifs.currentUserID)
                    break

                case 'sendingSignal':

                    const peer = addPeer(notifs.signal, notifs.from, userSteam, notifs.to);
                    peersRef.current.push({
                        peerID: notifs.from,
                        peer,
                    })

                    setPeers(users => [...users, peer]);
                    console.log("accept the signal")
                    break

                case 'returningSignal':

                    const item = peersRef.current.find(p => p.peerID === notifs.userID);
                    item.peer.signal(notifs.signal);
                    console.log("returningSignal")
                    break

                default:
                    console.log("no signle")
                    break

            }
        }

    }

    

    return (
        <Container>
            <StyledVideo muted ref={userVideo} autoPlay playsInline />
            {console.log(peers)}
            {peers.map((peer, index) => {
                return (
                    <div>
                    <Video key={index} peer={peer} />
                    </div>
                );
            })}
        </Container>
    );
};

export default Room;
