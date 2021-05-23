import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-song-dialog',
  templateUrl: './song-dialog.component.html',
  styleUrls: ['./song-dialog.component.scss']
})
export class SongDialogComponent implements OnInit {
songs:any = [];

song = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
    if(this.data.length != undefined){
      this.songs = this.data;
    }
    else{
    this.song = true
    this.songs = this.data;
    console.log(this.songs,'diunn')}
  }

}
