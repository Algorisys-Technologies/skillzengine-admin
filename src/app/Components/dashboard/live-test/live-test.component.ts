import { ClassField } from "@angular/compiler";
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
    this.startCall()
   
  }

  ngOnDestroy(): void {
    this.endCall();
  }


  setupSocketListeners(): void {
    this.socketService.listen("offer", (data) => this.handleOffer(data));
    this.socketService.listen("answer", (data) => this.handleAnswer(data));
    this.socketService.listen("candidate", (data) =>
      this.handleCandidate(data)
    );
   
  }

  startCall(): void {
  

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



    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socketService.emit("candidate", event.candidate);
      }
    };

    this.peerConnection.ontrack = (event) => {
      console.log(event)
      this.remoteStreams.push(event.streams[0]);
    
    };

    this.peerConnection.createOffer().then((offer) => {
      this.peerConnection.setLocalDescription(offer);
      this.socketService.emit("offer", offer);
    });
  }

  handleOffer(offer): void {
   console.log(offer)
   console.log(this.peerConnection)

    this.peerConnection.setRemoteDescription(offer)
      .then(() => {
        return this.peerConnection.createAnswer();
      })
      .then((answer) => {
        this.peerConnection.setLocalDescription(answer);
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
      console.log(event)
      this.remoteStreams.push(event.streams[0]);
    };
  }

  handleAnswer(answer): void {
    console.log(this.peerConnection)
    
    this.peerConnection.setRemoteDescription(answer);
  }

  handleCandidate(candidate): void {
    this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
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
