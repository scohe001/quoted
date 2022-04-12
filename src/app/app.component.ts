import { Component } from '@angular/core';
import { OutMode } from 'tsparticles-engine';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'quoted';


  public options = {
    fpsLimit: 60,
    particles: {
      color: {
        value: "#8c8c8c"
      },
      links: {
        enable: true,
        color: "#a8a8a8",
        distance: 150,
      },
      move: {
        enable: true,
        outModes: OutMode.bounce
      },
      number: {
        value: 10,
      }
    },
    fullScreen: {
      enable: false,
      zIndex: 0,
    }
  };
}
