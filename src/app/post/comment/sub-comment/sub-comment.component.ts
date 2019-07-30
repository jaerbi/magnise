import {Component, Input} from '@angular/core';

import { IComment } from '../../../interfaces/comment.interface';

import { FirebaseService } from '../../../services/firebase.service';
import { MaterialService } from '../../../services/materialize.service';

@Component({
  selector: 'app-sub-comment',
  templateUrl: './sub-comment.component.html',
  styleUrls: ['./sub-comment.component.scss']
})
export class SubCommentComponent {

  @Input() postSubComment: IComment;
  isEditMode = false;

  constructor(private fb: FirebaseService) { }

  /**
   * Open edit field for sub comment
   */
  openEdit() {
    this.isEditMode = !this.isEditMode;
  }

  /**
   * Delete from firebase sub comment
   */
  onDelete() {
    if (confirm('Are you shore?')) {
      this.fb.deleteSubComment(this.postSubComment).subscribe(
        () => {
          MaterialService.toast(`Was deleted Sub Comment`);
        }, error => {
          console.error(error);
        }
      );
    }
  }

}
