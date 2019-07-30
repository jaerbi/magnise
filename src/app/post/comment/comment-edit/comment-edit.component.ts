import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IComment } from '../../../interfaces/comment.interface';

import { DateService } from '../../../services/date.service';
import { FirebaseService } from '../../../services/firebase.service';
import { MaterialService } from '../../../services/materialize.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-comment-edit',
  templateUrl: './comment-edit.component.html',
  styleUrls: ['./comment-edit.component.scss']
})
export class CommentEditComponent implements OnInit, OnDestroy {

  @Input() comment: IComment;
  @Output() cancelEdit = new EventEmitter<void>();

  private destroyStream = new Subject<void>();

  commentEditForm: FormGroup;

  constructor(private dateService: DateService,
              private fb: FirebaseService) { }

  ngOnInit() {
    this.commentEditForm = new FormGroup({
      description: new FormControl(
        this.comment.description,
        [
          Validators.required,
          this.forbiddenDescription.bind(this)
        ]
      ),
      date: new FormControl(this.dateService.date),
      id: new FormControl(this.comment.id),
      parentId: new FormControl(this.comment.parentId)
    });
  }

  /**
   * Custom validator for comment description
   * @param FormControl control
   */
  forbiddenDescription(control: FormControl): {[s: string]: boolean} {
    if (control.value === this.comment.description) {
      return {descWasForbidden: true};
    } else {
      return null;
    }
  }

  /**
   * Edit comment and sub comment on firebase
   */
  onEdit() {
    const commentEditData = this.commentEditForm.value;

    if (this.comment.parentId) {
      this.fb.editSubComment(commentEditData)
        .pipe(takeUntil(this.destroyStream))
        .subscribe(
        () => {
          MaterialService.toast(`Sub comment - was edited!`);
        }, error => {
          console.error(error);
        });
    } else {
      this.fb.editComment(commentEditData)
        .pipe(takeUntil(this.destroyStream))
        .subscribe(
        () => {
          MaterialService.toast(`Comment - was edited!`);
        }, error => {
          console.error(error);
        });
    }
  }

  /**
   * Close edit field
   */
  onCancel() {
    this.cancelEdit.emit();
  }

  ngOnDestroy(): void {
    this.destroyStream.next();
  }

}
