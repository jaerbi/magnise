import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { IComment } from '../../interfaces/comment.interface';

import { FirebaseService } from '../../services/firebase.service';
import { DateService } from '../../services/date.service';
import { MaterialService } from '../../services/materialize.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit, OnDestroy {

  @Input() postComment: IComment;

  private destroyStream = new Subject<void>();

  subCommentForm: FormGroup;
  isEditMode = false;
  subComments: IComment[];

  constructor(
    private fb: FirebaseService,
    private dateService: DateService
  ) { }

  ngOnInit() {
    this.fb.getSubComments(this.postComment.id)
      .pipe(takeUntil(this.destroyStream))
      .subscribe(subComments => {
        this.subComments = subComments;
      });

    this.subCommentForm = new FormGroup({
      description: new FormControl('', Validators.required),
      date: new FormControl(this.dateService.date),
      parentId: new FormControl(this.postComment.id),
    });
  }

  /**
   * Create sub comment and add to firebase
   */
  onSubmitSub() {
    const subCommentData = this.subCommentForm.value;

    this.fb.addSubComment(subCommentData)
      .pipe(takeUntil(this.destroyStream))
      .subscribe(
      comment => {
        MaterialService.toast(`Sub comment - ${comment.description.slice(0, 25)}... was created!`);
      }, error1 => {
        console.error(error1);
      }
    );
  }

  /**
   * Delete comment from firebase
   */
  onDelete() {
    const obs = this.fb.deleteComment(this.postComment.id);

    if (confirm('Are you sure you want to delete this comment?')) {
      obs
        .pipe(takeUntil(this.destroyStream))
        .subscribe(commentFromFirebase => {
        MaterialService.toast(`Sub comment - ${commentFromFirebase.description.slice(0, 25)}... was deleted!`);
      }, error => {
        console.error(error);
      });
    }
  }

  /**
   * Open edit comment
   */
  openEdit() {
    this.isEditMode = !this.isEditMode;
  }

  onCancel() {
    this.openEdit();
  }

  ngOnDestroy(): void {
    this.destroyStream.next();
  }

}
