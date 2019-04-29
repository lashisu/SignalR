import { Component, OnInit } from '@angular/core';

//import { HubConnection } from '@aspnet/signalr';
//import * as signalR from '@aspnet/signalr';

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    // const connection2 = new signalR.HubConnectionBuilder()
    //   .withUrl("https://dev-api.chilindo.com/signalr")
    //   .configureLogging(signalR.LogLevel.Information)
    //   .build();

    // connection2.start().then(function () {
    //   console.log("connected");
    // });

    let connection = $.hubConnection("https://dev-api.chilindo.com/signalr", { useDefaultPath: false });
    let contosoChatHubProxy = connection.createHubProxy('auctionHub');

    // contosoChatHubProxy.on('JoinAuction', function (data) {
    //   console.log(data);
    // });

    connection.start()
      .done(function (data) {
        console.log('Now connected, connection ID=' + connection.id);
        console.log(data);
        contosoChatHubProxy.on('JoinAuction', function (data) {
          console.log(data);
        });
      })
      .fail(function () { console.log('Could not connect'); });

    contosoChatHubProxy.on('newUpdateOnAuction', function (userName, message) {
      console.log(userName + ' ' + message);
    });
  }
}