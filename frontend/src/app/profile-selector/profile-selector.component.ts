import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-profile-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-selector.component.html',
  styleUrl: './profile-selector.component.scss'
})
export class ProfileSelectorComponent implements OnInit {
  readonly users = signal<User[]>([]);
  readonly clients = computed(() => this.users().filter(u => u.role === 'CLIENT'));
  readonly agents = computed(() => this.users().filter(u => u.role === 'AGENT'));

  constructor(private userService: UserService, private sessionService: SessionService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe(users => this.users.set(users));
  }

  selectUser(user: User): void {
    this.sessionService.selectUser(user);
  }
}