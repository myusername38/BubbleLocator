import { Component, OnInit, Input } from '@angular/core';
import { Contributor } from '../../../interfaces/contributor';

@Component({
  selector: 'app-contributor',
  templateUrl: './contributor.component.html',
  styleUrls: ['./contributor.component.scss']
})
export class ContributorComponent implements OnInit {

  @Input()
  conntributor: Contributor = null;

  constructor() { }

  ngOnInit(): void {
  }

}
