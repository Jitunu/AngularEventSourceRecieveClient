import { Injectable, NgZone } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IWeatherInfo } from './model';



@Injectable({
  providedIn: 'root'
})
export class WeatherInfoService {
    private backendUrl: string;
    private eventSource: EventSource;
    private weatherDataSource: BehaviorSubject<Array<IWeatherInfo>> = new BehaviorSubject([]);

    weatherData = this.weatherDataSource.asObservable();  

    constructor(private zone: NgZone) {
      this.backendUrl = environment.backendUrl;
    } 

    public startWeatherInfoEventSource(): void {
      let url = ["http://localhost:9099", 'weather'].join('/');

      this.eventSource = new EventSource(url);
      this.eventSource.onmessage = (event) => {

        console.log('got event data', event['data']);
        const newArrays = [...this.weatherDataSource.value, JSON.parse(event['data'])];

        this.zone.run(() => {
          this.weatherDataSource.next(newArrays);
        })

      }

      this.eventSource.onerror = (error) => {

        this.zone.run( () => {
          // readyState === 0 (closed) means the remote source closed the connection,
          // so we can safely treat it as a normal situation. Another way of detecting the end of the stream
          // is to insert a special element in the stream of events, which the client can identify as the last one.
          if(this.eventSource.readyState === 0) {
            this.eventSource.close();
            this.weatherDataSource.complete();
          } else {
            this.weatherDataSource.error('EventSource error: ' + error);
          }
        });
      }
    }

    public onClose() {
      this.eventSource.close();
      this.weatherDataSource.complete();

    }

  }