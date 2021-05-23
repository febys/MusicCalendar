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
          this.events = this.events.filter((iEvent) => iEvent !== event);
          this.deleteEvent(event);
        },
      },
    ];
  
    refresh: Subject<any> = new Subject();
  
    events: CalendarEvent[] = [
      // {
      //   start: subDays(startOfDay(new Date()), 1),
      //   end: addDays(new Date(), 1),
      //   title: 'A 3 day event',
      //   color: colors.red,
      //   actions: this.actions,
      //   allDay: true,
      //   resizable: {
      //     beforeStart: true,
      //     afterEnd: true,
      //   },
      //   draggable: true,
      // },
      {
        start: startOfDay(new Date()),
        title: 'An event with no end date',
        data: [{ artist:[
          "TESTTTT"],
      title:"Heaven",
      album:"TIM",
      release_date:'2021-05-24'}],
        // actions: this.actions,
        // draggable: true,
      },
      // {
      //   start: subDays(endOfMonth(new Date()), 3),
      //   end: addDays(endOfMonth(new Date()), 3),
      //   title: 'A long event that spans 2 months',
      //   color: colors.blue,
      //   allDay: true,
      // },
      // {
      //   start: addHours(startOfDay(new Date()), 2),
      //   end: addHours(new Date(), 2),
      //   title: 'A draggable and resizable event',
      //   color: colors.yellow,
      //   actions: this.actions,
      //   resizable: {
      //     beforeStart: true,
      //     afterEnd: true,
      //   },
      //   draggable: true,
      // },
    ];
    dayToday: Date = new Date();
    activeDayIsOpen: boolean = true;
    songs: any =[];
  
    constructor(private modal: NgbModal,
      private songsService:SongsService,
      public dialog: MatDialog,
      private formBuilder: FormBuilder,) {
        this.songsService.getSongs().subscribe(res => {
          this.songs = res
          this.songs.forEach(element => {
            console.log(element,'hjhg')
            
              this.events =[
                ...this.events,{
                start: new Date(element.release_date),
                title: element.title,
                data: element,
                actions: this.actions,
              }
              ]
              //localStorage.setItem('ev',JSON.stringify(this.events))
      });
    
        });
      }
  ngOnInit(){
    
    this.viewDate = new Date();
    for(let i = 0 ; i< this.events.length; i++){
      
      let eventStart = (this.events[i].start).toString().substring(0, 15);
      let now = this.viewDate.toString().substring(0, 15);

      if(eventStart == now){
        this.today(this.viewDate,this.events[i])
      }
    }
  //  this.refreshView()
  }

  today(date,events): void {
      // debugger
      console.log(events)
      if (isSameMonth(date, this.viewDate)) {
        if (
          (isSameDay(this.viewDate, date))  
        ) {
         this.openDialog(events)
        }
      }
    }
  
    dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
     
      if (isSameMonth(date, this.viewDate)) {
        if (
          (isSameDay(this.viewDate, date)) 
        ) {
        console.log(events)
      
       this.activeDayIsOpen = false;
        }
        else if (events.length == 0){
          this.activeDayIsOpen = false;
          this.handleEvent('Add New',{start: startOfDay(new Date()),
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
  
    eventTimesChanged({
      event,
      newStart,
      newEnd,
    }: CalendarEventTimesChangedEvent): void {
      this.events = this.events.map((iEvent) => {
        if (iEvent === event) {
          return {
            ...event,
            start: newStart,
            end: newEnd,
          };
        }
        return iEvent;
      });
      this.handleEvent('Dropped or resized', event);
    }
  openDialog(data){
 
    this.dialog.open(SongDialogComponent, {
      width: '750px',
      // min-height: '650px',
      data: data
    });
  }
    handleEvent(action: string, event: CalendarEvent<any>): void {
      this.modalData = { event, action };
      this.dialog.open(AddModSongsComponent, {
        width: '450px',
        data: this.modalData
      }).afterClosed().subscribe(res => {
        console.log(res)
        this.addEvent(res);
      });
     // this.modal.open(this.modalContent, { size: 'lg' });
    }
  
    addEvent(res): void {
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
  
    deleteEvent(eventToDelete: CalendarEvent) {
      this.events = this.events.filter((event) => event !== eventToDelete);
    }
  
    setView(view: CalendarView) {
      this.view = view;
    }
    // refreshView(){
    //   console.log('hynnn')
    //  return this.day.viewDate = this.viewDate
    // }
  
    closeOpenMonthViewDay() {
      this.activeDayIsOpen = false;
    }
  }
  