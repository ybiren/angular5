import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { endianness } from 'os';
import { setTimeout } from 'timers';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { WikiService } from '../../github/shared/wiki.service';


@Component({
  selector: 'wiki-modal',
  templateUrl: './wikiModal.html',
})
export class WikiModalComponent {

  @Output()
  checkedChanged = new EventEmitter<boolean>(); 
  @Output()
  checkedChanged2 = new EventEmitter<boolean>(); 

  checkboxFlag: boolean = true;
  txtModal: string;
  constructor(private wikiService: WikiService) {
  }

  txtChanged() {
    this.wikiService.s$.next(this.txtModal);
  }
  checkChanged(event) {
    this.checkboxFlag = !this.checkboxFlag;
    this.checkedChanged.emit(this.checkboxFlag);
    this.checkedChanged2.emit(this.checkboxFlag);
    //alert(val);
  }
}
