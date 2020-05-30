import { Component, OnInit, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-info-tile',
  templateUrl: './info-tile.component.html',
  styleUrls: ['./info-tile.component.scss']
})
export class InfoTileComponent implements OnInit {

  @Input()
  info: { item: string, docRef: string };

  item = '';
  value = '';

  constructor(private db: AngularFirestore) { }

  ngOnInit(): void {
    this.item = this.info.item;
    this.db.doc(this.info.docRef).ref.onSnapshot(doc => {
      this.value = doc.data().length;
    });
  }
}
