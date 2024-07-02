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
  private remoteStreams: any[] = [];

  constructor(private socketService: SocketService) {}

  ngOnInit(): void {
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
    // this.peerConnection.onnegotiationneeded = () => this.handleNewParticipant;
    // this.peerConnection.onicecandidate = this.handleCandidate;
    this.initializeMedia();
    this.setupSocketListeners();

    // Retrieve remoteStreams from localStorage if available
    const storedRemoteStreams = localStorage.getItem("remoteStreams");
    console.log("storedRemoteStreams", storedRemoteStreams);
    if (storedRemoteStreams) {
      this.remoteStreams = JSON.parse(storedRemoteStreams);
    }
  }

  ngOnDestroy(): void {
    this.endCall();
    this.socketService.disconnect();
    if (this.peerConnection) {
      this.peerConnection.close();
    }
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
        // Now that localStream is set, proceed with setting up peerConnection or other logic.
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
        // Handle error as needed
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
    console.log("call started");

    if (!this.localStream) {
      console.error("localStream is not initialized.");
      return;
    }

    console.log(" this.peerConnection", this.peerConnection);

    if (this.localStream.getTracks().length === 0) {
      console.error("No tracks available in localStream.");
      return;
    }

    this.localStream.getTracks().forEach((track) => {
      this.peerConnection.addTrack(track, this.localStream);
      console.log("track", track, this.localStream);
    });

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socketService.emit("candidate", event.candidate);
      }
      console.log("candidate");
    };

    this.peerConnection.ontrack = (event) => {
      const remoteVideo = document.querySelector(
        "video#remoteVideo"
      ) as HTMLVideoElement;
      remoteVideo.srcObject = event.streams[0];

      console.log("remote video", remoteVideo);
    };

    this.peerConnection.createOffer().then((offer) => {
      this.peerConnection.setLocalDescription(offer);
      this.socketService.emit("offer", offer);
      console.log("offer", offer);
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
    });

    if (!this.peerConnection.currentRemoteDescription) {
    }
    this.peerConnection
      .setRemoteDescription(new RTCSessionDescription(offer))
      .then(() => {
        return this.peerConnection.createAnswer();
      })
      .then((answer) => {
        console.log("answer", answer);
        this.peerConnection.setLocalDescription(
          new RTCSessionDescription(answer)
        );
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
      localStorage.setItem("remoteStreams", JSON.stringify(this.remoteStreams));
    };

    // this.peerConnection.ontrack = (event) => {
    //   const remoteVideo = document.querySelector(
    //     "video#remoteVideo"
    //   ) as HTMLVideoElement;
    //   remoteVideo.srcObject = event.streams[0];
    // };
  }

  handleAnswer(answer): void {
    console.log("answerrrr", answer);

    //   this.peerConnection = new RTCPeerConnection({
    //     iceServers: [
    //         {
    //             urls: 'stun:stun1.l.google.com:19302'
    //           },
    //           {
    //             urls: 'stun:stun3.l.google.com:19302'
    //           },
    //           {
    //             urls: 'stun:stun4.l.google.com:19302'
    //           }
    //     ]
    // });

    if (!this.peerConnection.currentRemoteDescription) {
      const answerDescription = new RTCSessionDescription(answer);
      this.peerConnection.setRemoteDescription(answerDescription);
    }
  }

  handleCandidate(candidate): void {
    this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  }

  handleNewParticipant(data: any): void {
    console.log("New participant joined:", data.id);
    // Create a new RTCPeerConnection for the new participant

    this.localStream.getTracks().forEach((track) => {
      this.peerConnection.addTrack(track, this.localStream);
    });

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socketService.emit("candidate", {
          id: data.id,
          candidate: event.candidate,
        });
      }
    };

    this.peerConnection.ontrack = (event) => {
      const remoteVideo = document.querySelector(
        "video#remoteVideo"
      ) as HTMLVideoElement;
      remoteVideo.srcObject = event.streams[0];
    };

    // Send an offer to the new participant
    this.peerConnection.createOffer().then((offer) => {
      this.peerConnection.setLocalDescription(new RTCSessionDescription(offer));
      this.socketService.emit("offer", { id: data.id, offer });
    });
  }

  endCall(): void {
    console.log("call ended");
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
    }

    if (this.peerConnection) {
      this.peerConnection.close();
    }

    localStorage.removeItem("remoteStreams");
  }
}
