import { Component, OnInit } from '@angular/core';
import { NavigationService } from 'services/navigation/navigation.service';

@Component({
  selector: 'app-back',
  templateUrl: './back.component.html',
  styleUrls: ['./back.component.css'],
})
export class BackComponent implements OnInit {
  constructor(public navigate: NavigationService) {}

  ngOnInit(): void {}
}
