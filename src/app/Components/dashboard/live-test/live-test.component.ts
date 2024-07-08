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
    // this.startCall();
    // this.restoreConnections();
  }

  ngOnDestroy(): void {
    this.endCall();
    // this.socketService.disconnect();
    // if (this.peerConnection) {
    //   this.peerConnection.close();
    // }
  }

  setupSocketListeners(): void {
    this.socketService.listen("offer", (data) => this.handleOffer(data));
    // this.socketService.listen("answer", (data) => this.handleAnswer(data));
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


    // this.peerConnection.ontrack = (event) => {
    //   console.log(event);
    //   this.remoteStreams.push(event.streams[0]);
    // };


    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socketService.emit("candidate", event.candidate);
      }
      console.log("candidate");
    };

    // this.peerConnection.createOffer().then((offer) => {
    //   this.peerConnection.setLocalDescription(offer);
    //   this.socketService.emit("offer", offer);
    //   sessionStorage.setItem("offer", JSON.stringify(offer));
    // });
  }

  handleOffer(offer): void {
    this.startCall()
    console.log(offer);
    console.log(this.peerConnection);

    this.peerConnection
      .setRemoteDescription(offer)
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
      console.log(event);
      this.remoteStreams.push(event.streams[0]);
    };
  }

  // handleAnswer(answer): void {
  //   console.log(this.peerConnection);

  //   this.peerConnection.setRemoteDescription(answer);
  // }

  handleCandidate(candidate): void {
    this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  }

  // restoreConnections(): void {
  //   const offer = sessionStorage.getItem("offer");
  //   if (offer) {
  //     this.peerConnection = new RTCPeerConnection({
  //       iceServers: [
  //         {
  //           urls: "stun:stun1.l.google.com:19302",
  //         },
  //         {
  //           urls: "stun:stun3.l.google.com:19302",
  //         },
  //         {
  //           urls: "stun:stun4.l.google.com:19302",
  //         },
  //       ],
  //       iceCandidatePoolSize: 10,
  //     });

  //     this.peerConnection
  //       .setRemoteDescription(new RTCSessionDescription(JSON.parse(offer)))
  //       .then(() => this.peerConnection.createAnswer())
  //       .then((answer) => {
  //         return this.peerConnection.setLocalDescription(answer).then(() => {
  //           this.socketService.emit("answer", answer);
  //         });
  //       })
  //       .catch((error) => console.error("Error handling offer:", error));

  //     this.peerConnection.onicecandidate = (event) => {
  //       if (event.candidate) {
  //         this.socketService.emit("candidate", event.candidate);
  //         sessionStorage.setItem(
  //           `candidate-${event.candidate.sdpMid}-${event.candidate.sdpMLineIndex}`,
  //           JSON.stringify(event.candidate)
  //         );
  //       }
  //     };

  //     this.peerConnection.ontrack = (event) => {
  //       this.remoteStreams.push(event.streams[0]);
  //     };

  //     // Restore ICE candidates
  //     for (let i = 0; sessionStorage.getItem(`candidate-${i}`); i++) {
  //       const candidate = JSON.parse(sessionStorage.getItem(`candidate-${i}`));
  //       this.peerConnection
  //         .addIceCandidate(new RTCIceCandidate(candidate))
  //         .catch((error) =>
  //           console.error("Error adding ICE candidate:", error)
  //         );
  //     }
  //   }
  // }

  endCall(): void {
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
    }

    if (this.peerConnection) {
      this.peerConnection.close();
    }
  }
}
