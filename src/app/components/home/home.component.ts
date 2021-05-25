import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import {
    ChangeDetectionStrategy,
    ViewChild,
    TemplateRef,
  } from '@angular/core';

  import { Subject } from 'rxjs';
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
  import {
    CalendarEvent,
    CalendarEventAction,
    CalendarEventTimesChangedEvent,
    CalendarView,
  } from 'angular-calendar';
  import {
    startOfDay,
    endOfDay,
    subDays,
    addDays,
    endOfMonth,
    isSameDay,
    isSameMonth,
    addHours,
  } from 'date-fns';
import { UserService, AuthenticationService } from '@app/services';
import { User } from '@app/models/user';
import { SongsService } from './songs.service';
import { MatDialog } from '@angular/material';
import { SongDialogComponent } from '@app/dialog/song-dialog/song-dialog.component';
import { AddModSongsComponent } from '@app/dialog/add-mod-songs/add-mod-songs.component';
import { FormBuilder } from '@angular/forms';
import { CalendarTodayDirective } from 'angular-calendar/modules/common/calendar-today.directive';

const colors: any = {
    red: {
      primary: '#ad2121',
      secondary: '#FAE3E3',
    },
    blue: {
      primary: '#1e90ff',
      secondary: '#D1E8FF',
    },
    yellow: {
      primary: '#e3bc08',
      secondary: '#FDF1BA',
    },
  };

@Component({ templateUrl: 'home.component.html' ,
            styleUrls: ['home.component.scss']})
export class HomeComponent implements OnInit{
    loading = false;
    users: User[];
    @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
    day: CalendarTodayDirective
    view: CalendarView = CalendarView.Month;
  
    CalendarView = CalendarView;
    viewDate = new Date();
  
    modalData: {
      action: string;
      event: CalendarEvent;
    };
  
    actions: CalendarEventAction[] = [
      {
        label: '<i class="fas fa-fw fa-pencil-alt"></i>',
        a11yLabel: 'Edit',
        onClick: ({ event }: { event: CalendarEvent }): void => {
          this.handleEvent('Edited', event);
        },
      },
      {
        label: '<i class="fas fa-fw fa-trash-alt"></i>',
        a11yLabel: 'Delete',
        onClick: ({ event }: { event: CalendarEvent }): void => {
          // this.events = this.events.filter((iEvent) => iEvent !== event);
          this.deleteEvent(event);
        },
      },
    ];
  
    refresh: Subject<any> = new Subject();
  //Events or Songs that will be shown as events 
    events: CalendarEvent[] = [

      {
        start: new Date(),
        title: 'Test',
        data: {artist:"TESTTTT",
        title:"Test",
        album:"TIM",
        release_date:'2021-05-24'},
        actions: this.actions,
        // actions: this.actions,
        // draggable: true,
      },
    ];
    dayToday: Date = new Date();
    activeDayIsOpen: boolean = true;
    songs: any =[];
  
    constructor(private modal: NgbModal,
      private songsService:SongsService,
      public dialog: MatDialog,
      private formBuilder: FormBuilder,) {
        //Get Songs from service and push to event array
        this.songsService.getSongs().subscribe(res => {
          this.songs = res
          this.songs.forEach(element => {
              this.events =[
                ...this.events,{
                start: new Date(element.release_date),
                title: element.title,
                data: element,
                actions: this.actions,
                draggable: true,
              }
              ]
              //localStorage.setItem('ev',JSON.stringify(this.events))
      });
    
        });
      }
  ngOnInit(){
    if(this.events.length == 0){
      this.activeDayIsOpen = false
    }
    
    //Pop-up dialog if there is a song releised today(now) search from 
    //events to get the right event 
    for(let i = 0 ; i< this.events.length; i++){
      let eventStart = (this.events[i].start).toString().substring(0, 15);
      let now = this.viewDate.toString().substring(0, 15);
      if(eventStart == now){
        this.today(this.viewDate,this.events[i])
      }
    }
  }
//Open dialog if song relised is today
  today(date,events): void {
      // debugger
     
      if (isSameMonth(date, this.viewDate)) {
        if (
          (isSameDay(this.viewDate, date))  
        ) {
         this.openDialog(events)
        }
      }
    }
  //Day clicked ,if its today and click close expand else if click to 
  //a calendar day that has no data open add dialog ,else if click to a 
  //song relised calendar day open expand box
    dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
     
      if (isSameMonth(date, this.viewDate)) {
        if (
          (isSameDay(this.viewDate, date)) 
        ) {
       this.activeDayIsOpen = false;
        }
        else if (events.length == 0){
          this.activeDayIsOpen = false;
          this.handleEvent('Add New',{start: date,
                  title: '',
                  data: [],} );
        }
         else {
         this.openDialog(events);
         this.activeDayIsOpen = true; 
        }
        
        this.viewDate = date;
      }
    }
  //Change day of released if u drang and drop a date
    eventTimesChanged({
      event,
      newStart,
      newEnd,
    }: CalendarEventTimesChangedEvent): void {
      this.events = this.events.map((iEvent) => {
        console.log(event)
        if (iEvent === event) {
        
          return {
            ...event,
            start: newStart,
            end: newEnd,
          };
        }
       
        return iEvent;
      });
 
      // this.handleEvent('Dropped or resized', event);
      if(this.events.length == 0){
        this.activeDayIsOpen = false
      }
    }
    //Open song/songs detail dialog 
  openDialog(data){
    this.dialog.open(SongDialogComponent, {
      width: '750px',
      // min-height: '650px',
      data: data
    });
  }
  //Open song add or modify dialog and gets back the data that have been added or 
  //modified and add those data to addEvent that create a new song
    handleEvent(action: string, event: CalendarEvent<any>): void {
      this.modalData = { event, action };
      this.dialog.open(AddModSongsComponent, {
        width: '450px',
        data: this.modalData
      }).afterClosed().subscribe(res => {
        console.log(res);
        if(res.data.action == "Edited"){
          console.log('hyri ketu')
          this.editSong(res);
        }
        else{
        this.addEvent(res);}
      });
     // this.modal.open(this.modalContent, { size: 'lg' });
    }
  //Create a new song /event (add to array of events)
    addEvent(res): void {
      if(res != undefined){
      this.events = [
        ...this.events,
        {
          title: res.data.title,
          start: new Date(res.data.release_date),
          draggable: true,
          data:res.data
        },
      ];
      }
    }
    editSong(res):void {
let body:CalendarEvent ={
  start: new Date(),
  title: '',
  data: {artist:"",
  title:"",
  album:"",
  release_date:''},
  actions: this.actions,
}
      this.events = this.events.map((iEvent) => {
      //  console.log(event)
        if (iEvent === body) {
        
          return {
            ...body,
            title: res.data.title,
            start: new Date(res.data.release_date),
            draggable: true,
            actions:this.actions,
            data:res.data
          };
        }
       
        return iEvent;
      });
    }
  //Delete event
    deleteEvent(eventToDelete: CalendarEvent) {
    
      this.events = this.events.filter((event) => event !== eventToDelete);
    }
  
    setView(view: CalendarView) {
      this.view = view;
    }

  
    closeOpenMonthViewDay() {
      this.activeDayIsOpen = false;
    }
  }