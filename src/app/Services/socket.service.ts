import { Injectable } from "@angular/core";
//import { io, Socket } from "socket.io-client";
// import { environment } from "src/environments/environment";
import * as io from "socket.io-client";

@Injectable({
  providedIn: "root",
})
export class SocketService {
  private socket: any;

  constructor() {
    //this.socket = io(environment.socketUrl);
    console.log("http://localhost:3000/")
    this.socket =  io.connect("http://localhost:3000/",{
      secure: true,
      path: "/socket.io",});
  }

  listen(eventName: string, callback: (data: any) => void) {
    this.socket.on(eventName, callback);
  }

  emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }

  disconnect() {
    this.socket.disconnect();
  }
}
