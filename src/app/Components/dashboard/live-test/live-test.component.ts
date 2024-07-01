import { Component, OnInit, OnDestroy } from "@angular/core";
import * as io from "socket.io-client";

@Component({
  selector: "app-live-test",
  templateUrl: "./live-test.component.html",
  styleUrls: ["./live-test.component.css"],
})
export class LiveTestComponent implements OnInit, OnDestroy {
  private socket: any;
  private peerConnections: { [id: string]: RTCPeerConnection } = {};
  private localStream: MediaStream;

  constructor() {}

  ngOnInit() {
    this.initWebSocket();
    this.startLocalVideo();
  }

  ngOnDestroy() {
    // Clean up resources
    Object.keys(this.peerConnections).forEach((id) => {
      this.peerConnections[id].close();
    });
    this.peerConnections = {};
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
    }
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  startLocalVideo() {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        this.localStream = stream;
        this.addVideoStream(stream, "local");
      })
      .catch((error) => console.error("Error accessing media devices.", error));
  }

  initWebSocket() {
    this.socket = io("http://localhost:3000");

    this.socket.on("connect", () => {
      console.log("Connected to server");
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    this.socket.on("newParticipant", (data: any) => {
      console.log("New participant joined:", data.id);
      this.handleNewParticipant(data);
    });

    this.socket.on("offer", (data: any) => {
      console.log("Received offer from:", data.id);
      this.handleOffer(data);
    });

    this.socket.on("answer", (data: any) => {
      console.log("Received answer from:", data.id);
      this.handleAnswer(data);
    });

    this.socket.on("candidate", (data: any) => {
      console.log("Received ICE candidate from:", data.id);
      this.handleCandidate(data);
    });

    this.socket.emit("joinRoom", { room: "liveTestRoom" });
    console.log("Sent joinRoom request");

    // this.socket.emit("newParticipant", { id: "1234" });
  }

  handleNewParticipant(data: any) {
    const peerConnection = this.createPeerConnection(data.id);
    this.peerConnections[data.id] = peerConnection;

    console.log("peerConnection", peerConnection, "DataId", data.id);
  }

  handleOffer(data: any) {
    const peerConnection = this.peerConnections[data.id];
    peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));

    peerConnection
      .createAnswer()
      .then((answer) => peerConnection.setLocalDescription(answer))
      .then(() =>
        this.socket.emit("answer", {
          id: data.id,
          answer: peerConnection.localDescription,
        })
      );
  }

  handleAnswer(data: any) {
    const peerConnection = this.peerConnections[data.id];
    peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
  }

  handleCandidate(data: any) {
    const peerConnection = this.peerConnections[data.id];
    peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
  }

  createPeerConnection(id: string): RTCPeerConnection {
    const peerConnection = new RTCPeerConnection();

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log(`Sending ICE candidate to: ${id}`);
        this.socket.emit("candidate", { id, candidate: event.candidate });
      }
    };

    peerConnection.ontrack = (event) => {
      this.addVideoStream(event.streams[0], id);
    };

    this.localStream
      .getTracks()
      .forEach((track) => peerConnection.addTrack(track, this.localStream));

    // Send offer to new participant
    peerConnection.createOffer().then((offer) => {
      peerConnection.setLocalDescription(offer);
      this.socket.emit("offer", { id, offer });
      console.log(`Sent offer to: ${id}`);
    });

    return peerConnection;
  }

  addVideoStream(stream: MediaStream, id: string) {
    const videoElement = document.createElement("video");
    videoElement.srcObject = stream;
    videoElement.autoplay = true;
    if (id === "local") {
      videoElement.muted = true; // Mute local video
    }
    document.querySelector(".live-test-container").appendChild(videoElement);

    console.log(`Added video stream for ${id}`);
    console.log(`Current peerConnections: `, this.peerConnections);
  }
}
