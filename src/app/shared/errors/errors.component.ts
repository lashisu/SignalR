import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-errors',
  templateUrl: './errors.component.html',
  styleUrls: ['./errors.component.scss']
})
export class ErrorsComponent implements OnInit {
  @Input()
  control: FormControl;
  
  @Input()
  require:string;
  
  @Input()
  minLength:string;
  
  @Input()
  maxLength:string;
  
  @Input()
  email:string;
  
  @Input()
  pattern:string;
  
  constructor() { }

  ngOnInit() {
  }
}
