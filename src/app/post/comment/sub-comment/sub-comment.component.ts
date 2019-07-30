import { Component, Input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { IComment } from '../../../interfaces/comment.interface';

import { FirebaseService } from '../../../services/firebase.service';
import { MaterialService } from '../../../services/materialize.service';

@Component({
  selector: 'app-sub-comment',
  templateUrl: './sub-comment.component.html',
  styleUrls: ['./sub-comment.component.scss']
})
export class SubCommentComponent implements OnDestroy {

  @Input() postSubComment: IComment;

  private destroyStream = new Subject<void>();

  isEditMode = false;

  constructor(private fb: FirebaseService) { }

  /**
   * Open edit field for sub comment
   */
  openEdit() {
    this.isEditMode = !this.isEditMode;
  }

  onCancel() {
    this.openEdit();
  }

  /**
   * Delete from firebase sub comment
   */
  onDelete() {
    if (confirm('Are you shore?')) {
      this.fb.deleteSubComment(this.postSubComment)
        .pipe(takeUntil(this.destroyStream))
        .subscribe(
        () => {
          MaterialService.toast(`Was deleted Sub Comment`);
        }, error => {
          console.error(error);
        }
      );
    }
  }

  ngOnDestroy(): void {
    this.destroyStream.next();
  }

}
