import { Component } from '@angular/core';
import { ProfileSelectorComponent } from './profile-selector/profile-selector.component';
import { SessionService } from './services/session.service';
import { ClientFlowComponent } from './client-flow/client-flow.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ProfileSelectorComponent, ClientFlowComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  constructor(protected sessionService: SessionService) {}
}
