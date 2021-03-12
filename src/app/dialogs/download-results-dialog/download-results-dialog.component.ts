import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../../components/bubble-locator/bubble-locator.component';
import { of } from 'rxjs';

@Component({
  selector: 'app-download-results-dialog',
  templateUrl: './download-results-dialog.component.html',
  styleUrls: ['./download-results-dialog.component.scss']
})
export class DownloadResultsDialogComponent {

  ratingData = [];
  setting = {
    element: {
      dynamicDownload: null as HTMLElement
    }
  }

  constructor(
    public dialogRef: MatDialogRef<DownloadResultsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {
      this.ratingData = data.ratings;
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  click(result) {
    this.dialogRef.close(result);
  }


  dyanmicDownloadByHtmlTag() {
    if (!this.setting.element.dynamicDownload) {
      this.setting.element.dynamicDownload = document.createElement('a');
    }
    const text = JSON.stringify(this.ratingData);
    const element = this.setting.element.dynamicDownload;
    const fileType = 'text/plain';
    element.setAttribute('href', `data:${ fileType };charset=utf-8,${encodeURIComponent( this.formatRatingData() )}`);
    element.setAttribute('download', 'Rating Data');
    var event = new MouseEvent("click");
    element.dispatchEvent(event);
  }

  formatRatingData() {
    let text = '';
    this.ratingData.forEach(rating => {
      text += `Title: ${ rating.title } \n`
      text += `Rating: ${ rating.rating } \n`
      text += '\n --------------------------- \n \n'
    })
    return text;

  }

}
