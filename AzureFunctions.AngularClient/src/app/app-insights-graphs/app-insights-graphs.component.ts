import { Subject } from 'rxjs/Subject';
import { ArmObj } from './../shared/models/arm/arm-obj';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-app-insights-graphs',
  templateUrl: './app-insights-graphs.component.html',
  styleUrls: ['./app-insights-graphs.component.scss']
})
export class AppInsightsGraphsComponent implements OnInit {

  idStream: Subject<string>;

  constructor() {
    this.idStream = new Subject<string>();

  }

  @Input() set id(value: string) {
    this.
  }

  ngOnInit() {
  }

}
