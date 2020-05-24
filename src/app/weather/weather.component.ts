import { Component, OnInit, HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { IWeatherInfo } from './model';
import { WeatherInfoService } from './WeatherInfoService';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {

 
  
  weatherInfo$: Observable<IWeatherInfo[]>;
  all: IWeatherInfo[];

  constructor(private service: WeatherInfoService) { }
  
  ngOnInit() {
    this.service.startWeatherInfoEventSource();
    this.weatherInfo$ = this.service.weatherData;
  }

  ngOnDestroy() {
    this.service.onClose();
  }

  @HostListener('window:beforeunload', [ '$event' ])
  unloadHandler(event) {
    console.log('unloadHandler');
    this.service.onClose();
  }
}