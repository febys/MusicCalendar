import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CalendarEvent } from 'angular-calendar';

@Component({
  selector: 'app-add-mod-songs',
  templateUrl: './add-mod-songs.component.html',
  styleUrls: ['./add-mod-songs.component.scss']
})
export class AddModSongsComponent implements OnInit {
  items: any = [];
  songform: FormGroup;
  submitted = false;
  @Output() itemADD = new EventEmitter<any>();
  constructor(@Inject(MAT_DIALOG_DATA) public data,
  private formBuilder: FormBuilder,
  private ref :MatDialogRef<AddModSongsComponent>
  
  ) { 

  }

  ngOnInit() {
    // console.log(this.data)
    // if(this.data != undefined || this.data != ""){
    // this.items =this.data.event.data
   
    if(this.data.event.data.length != 0 ){
      console.log(this.data.event.data)
        this.items =this.data.event.data
    this.songform = this.formBuilder.group({
      artist: [this.items.artist, Validators.required],
      title: [this.items.title, Validators.required],
      album: [this.items.album, Validators.required],
      release_date:[this.items.release_date, Validators.required]
  });
}
// }
else{
  let date = new Date(this.data.event.start)
  console.log(date,'febys')
  this.songform = this.formBuilder.group({
    artist: ['', Validators.required],
    title: ['', Validators.required],
    album: ['', Validators.required],
    release_date:[date, Validators.required]
  });
}
  }
   // convenience getter for easy access to form fields
   get f() { return this.songform.controls; }

  onSubmit(){
    let data = this.songform.value
    let body = {
      action: this.data.action,
      artist:data.artist,
      title: data.title,
      album:  data.album,
      release_date: new Date(data.release_date)
    }
    this.ref.close({data:body})    
  }
}
