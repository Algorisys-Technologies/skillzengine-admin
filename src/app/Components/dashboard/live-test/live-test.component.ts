import { Component, OnInit, OnDestroy } from "@angular/core";
import { SocketService } from "src/app/Services/socket.service";

@Component({
  selector: "app-live-test",
  templateUrl: "./live-test.component.html",
  styleUrls: ["./live-test.component.css"],
})
export class LiveTestComponent implements OnInit, OnDestroy {
  private localStream: MediaStream;
  private peerConnection: RTCPeerConnection;
  private remoteStreams: MediaStream[] = [];

  constructor(private socketService: SocketService) {}

  ngOnInit(): void {
    this.setupSocketListeners();
    this.initializeMedia();
  }

  ngOnDestroy(): void {
    this.endCall();
  }

  initializeMedia(): void {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        this.localStream = stream;
        const video = document.querySelector(
          "video#localVideo"
        ) as HTMLVideoElement;
        if (video) {
          video.srcObject = stream;
        }

        this.startCall();
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
      });
  }

  setupSocketListeners(): void {
    this.socketService.listen("offer", (data) => this.handleOffer(data));
    this.socketService.listen("answer", (data) => this.handleAnswer(data));
    this.socketService.listen("candidate", (data) =>
      this.handleCandidate(data)
    );
    this.socketService.listen("newParticipant", (data) =>
      this.handleNewParticipant(data)
    );
  }

  startCall(): void {
    if (!this.localStream) {
      console.error("localStream is not initialized.");
      return;
    }

    this.peerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun1.l.google.com:19302",
        },
        {
          urls: "stun:stun3.l.google.com:19302",
        },
        {
          urls: "stun:stun4.l.google.com:19302",
        },
      ],
      iceCandidatePoolSize: 10,
    });

    this.localStream.getTracks().forEach((track) => {
      this.peerConnection.addTrack(track, this.localStream);
    });

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socketService.emit("candidate", event.candidate);
      }
    };

    this.peerConnection.ontrack = (event) => {
      this.remoteStreams.push(event.streams[0]);
    };

    this.peerConnection.createOffer().then((offer) => {
      this.peerConnection.setLocalDescription(offer);
      this.socketService.emit("offer", offer);
    });
  }

  handleOffer(offer): void {
    this.peerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun1.l.google.com:19302",
        },
        {
          urls: "stun:stun3.l.google.com:19302",
        },
        {
          urls: "stun:stun4.l.google.com:19302",
        },
      ],
      iceCandidatePoolSize: 10,
    });

    this.peerConnection
      .setRemoteDescription(new RTCSessionDescription(offer))
      .then(() => {
        return this.peerConnection.createAnswer();
      })
      .then((answer) => {
        this.peerConnection.setLocalDescription(new RTCSessionDescription(answer));
        this.socketService.emit("answer", answer);
      });

    this.localStream.getTracks().forEach((track) => {
      this.peerConnection.addTrack(track, this.localStream);
    });

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socketService.emit("candidate", event.candidate);
      }
    };

    this.peerConnection.ontrack = (event) => {
      this.remoteStreams.push(event.streams[0]);
    };
  }

  handleAnswer(answer): void {
    const answerDescription = new RTCSessionDescription(answer);
    this.peerConnection.setRemoteDescription(answerDescription);
  }

  handleCandidate(candidate): void {
    this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  }

  handleNewParticipant(data: any): void {
    const newPeerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun1.l.google.com:19302",
        },
        {
          urls: "stun:stun3.l.google.com:19302",
        },
        {
          urls: "stun:stun4.l.google.com:19302",
        },
      ],
      iceCandidatePoolSize: 10,
    });

    this.localStream.getTracks().forEach((track) => {
      newPeerConnection.addTrack(track, this.localStream);
    });

    newPeerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socketService.emit("candidate", {
          id: data.id,
          candidate: event.candidate,
        });
      }
    };

    newPeerConnection.ontrack = (event) => {
      this.remoteStreams.push(event.streams[0]);
    };

    newPeerConnection.createOffer().then((offer) => {
      newPeerConnection.setLocalDescription(new RTCSessionDescription(offer));
      this.socketService.emit("offer", { id: data.id, offer });
    });
  }

  endCall(): void {
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
    }

    if (this.peerConnection) {
      this.peerConnection.close();
    }
  }
}
