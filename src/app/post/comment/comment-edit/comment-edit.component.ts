import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IComment } from '../../../interfaces/comment.interface';

import { DateService } from '../../../services/date.service';
import { FirebaseService } from '../../../services/firebase.service';
import { MaterialService } from '../../../services/materialize.service';

@Component({
  selector: 'app-comment-edit',
  templateUrl: './comment-edit.component.html',
  styleUrls: ['./comment-edit.component.scss']
})
export class CommentEditComponent implements OnInit {

  @Input() comment: IComment;
  commentEditForm: FormGroup;

  constructor(private dateService: DateService,
              private fb: FirebaseService) { }

  ngOnInit() {
    this.commentEditForm = new FormGroup({
      description: new FormControl(this.comment.description, Validators.required),
      date: new FormControl(this.dateService.date),
      id: new FormControl(this.comment.id),
      parentId: new FormControl(this.comment.parentId)
    });
  }

  /**
   * Edit comment and sub comment on firebase
   */
  onEdit() {
    const commentEditData = this.commentEditForm.value;

    if (this.comment.parentId) {
      this.fb.editSubComment(commentEditData).subscribe(
        () => {
          MaterialService.toast(`Sub comment - was edited!`);
        }, error => {
          console.error(error);
        });
    } else {
      this.fb.editComment(commentEditData).subscribe(
        () => {
          MaterialService.toast(`Comment - was edited!`);
        }, error => {
          console.error(error);
        });
    }
  }

}
