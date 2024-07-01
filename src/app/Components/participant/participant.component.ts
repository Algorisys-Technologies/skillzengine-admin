import { Component, OnInit, OnDestroy } from "@angular/core";
import { SocketService } from "src/app/Services/socket.service";

@Component({
  selector: "app-participant",
  templateUrl: "./participant.component.html",
  styleUrls: ["./participant.component.css"],
})
export class ParticipantComponent implements OnInit, OnDestroy {
  private localStream: MediaStream;
  private peerConnection: RTCPeerConnection;

  constructor(private socketService: SocketService) {}

  ngOnInit(): void {
    this.initializeMedia();
    this.setupSocketListeners();
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
        console.log(stream.active)
        this.localStream = stream;
        const video = document.querySelector(
          "video#localVideo"
        ) as HTMLVideoElement;
        if (video) {
          console.log(stream)
          video.srcObject = stream;
        }
        this.startCall()
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
  //  this.initializeMedia()

    console.log(this.localStream)

    if (!this.localStream) {
      console.error("localStream is not initialized.");
      return;
    }

    this.peerConnection = new RTCPeerConnection();

    console.log(" this.peerConnection", this.peerConnection);

    if (this.localStream.getTracks().length === 0) {
      console.error("No tracks available in localStream.");
      return;
    }

    this.localStream.getTracks().forEach((track) => {
      this.peerConnection.addTrack(track, this.localStream);
      console.log("track", track, this.localStream);
    });

    console.log("this.localStream", this.localStream);

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log(event.candidate)
        this.socketService.emit("candidate", event.candidate);
      }
      console.log("candidate");
    };

    this.peerConnection.ontrack = (event) => {
      const remoteVideo = document.querySelector(
        "video#remoteVideo"
      ) as HTMLVideoElement;
      remoteVideo.srcObject = event.streams[0];
    };

    this.peerConnection.createOffer().then((offer) => {
      this.peerConnection.setLocalDescription(offer);
      this.socketService.emit("offer", offer);
    });
  }

  handleOffer(offer): void {
    this.peerConnection = new RTCPeerConnection();
    this.localStream.getTracks().forEach((track) => {
      this.peerConnection.addTrack(track, this.localStream);
    });

    this.peerConnection
      .setRemoteDescription(new RTCSessionDescription(offer))
      .then(() => {
        return this.peerConnection.createAnswer();
      })
      .then((answer) => {
        this.peerConnection.setLocalDescription(answer);
        this.socketService.emit("answer", answer);
      });

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socketService.emit("candidate", event.candidate);
      }
    };

    this.peerConnection.ontrack = (event) => {
      const remoteVideo = document.querySelector(
        "video#remoteVideo"
      ) as HTMLVideoElement;
      remoteVideo.srcObject = event.streams[0];
    };
  }

  handleAnswer(answer): void {
    this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  }

  handleCandidate(candidate): void {
    this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  }

  handleNewParticipant(data: any): void {
    console.log("New participant joined:", data.id);
    // Create a new RTCPeerConnection for the new participant
    this.peerConnection = new RTCPeerConnection();

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
      this.peerConnection.setLocalDescription(offer);
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
  }
}
