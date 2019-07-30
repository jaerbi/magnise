import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { IComment } from '../interfaces/comment.interface';

import { FirebaseService } from '../services/firebase.service';
import { DateService } from '../services/date.service';
import { MaterialService } from '../services/materialize.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit, OnDestroy {

  @ViewChild('form', {static: true}) searchForm: NgForm;

  private destroyStream = new Subject<void>();

  post: string;
  comments: IComment[];
  filterComments: IComment[];
  commentForm: FormGroup;
  searchField: string;
  noSearchComment = true;

  constructor(
    private fb: FirebaseService,
    private dateService: DateService,
  ) { }


  ngOnInit() {
    this.post = this.fb.defaultPost;

    this.commentForm = new FormGroup({
      description: new FormControl('', Validators.required),
      date: new FormControl(this.dateService.date)
    });

    this.fb.getComments()
      .pipe(takeUntil(this.destroyStream))
      .subscribe(
      (comments) => {
        this.comments = comments;
        this.assignCopy();
      }
    );
  }

  /**
   * For initialization
   */
  assignCopy() {
    this.filterComments = Object.assign([], this.comments);
  }

  /**
   * Search comment
   */
  search() {
    const searchField = this.searchForm.value.searchField;

    if (!searchField) {
      this.assignCopy();
    }

    this.filterComments = Object.assign([], this.comments).filter(
      comment => comment.description.toLowerCase().includes(searchField.toLowerCase())
    );

    this.noSearchComment = Object.keys(this.filterComments).length ? true : false;
  }

  /**
   * Create on firebase new comment
   */
  onSubmitComment() {
    const commentData = this.commentForm.value;

    this.fb.addComment(commentData)
      .pipe(takeUntil(this.destroyStream))
      .subscribe(
      comment => {
        MaterialService.toast(`Comment - ${comment.description.slice(0, 25)}... was added!`);
      }, error1 => {
        console.error(error1);
      }
    );
  }

  ngOnDestroy(): void {
    this.destroyStream.next();
  }

}
