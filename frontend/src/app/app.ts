import { Component } from '@angular/core';
import { ProfileSelectorComponent } from './profile-selector/profile-selector.component';
import { SessionService } from './services/session.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ProfileSelectorComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  constructor(protected sessionService: SessionService) {}
}
