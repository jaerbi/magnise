import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';

import { IComment } from '../interfaces/comment.interface';

import { DateService } from './date.service';


@Injectable({providedIn: 'root'})
export class FirebaseService {

  defaultPost = `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti error, ex explicabo id ipsa libero maiores non 
      possimus quam quo tenetur voluptatem. Accusantium alias ducimus ipsa omnis quidem. Accusamus culpa cum delectus dolor doloribus 
      ea earum, hic libero nemo, odit quis quos recusandae voluptate voluptates voluptatum. Cumque cupiditate debitis deserunt dolore 
      doloribus eius esse explicabo harum maxime minima non obcaecati, optio pariatur perferendis placeat, porro possimus quia ratione 
      saepe similique tempora tenetur vel! Amet commodi cupiditate esse facilis, fuga iste iure magnam, magni maiores molestiae natus nisi 
      nulla officia omnis quasi sint tenetur, voluptatem voluptatibus. Aliquam error expedita impedit suscipit.`;

  constructor(
    private dateService: DateService,
    private db: AngularFirestore
  ) {}

  /**
   * Fetch all comments from firebase
   */
  getComments(): Observable<IComment[]> {
    return this.db.collection<IComment>('comments')
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map(action => {
            const data = action.payload.doc.data() as IComment;

            return {
              id: action.payload.doc.id,
              description: data.description,
              date: data.date,
            };
          });
        })
      );
  }

  /**
   * Fetch all parent sub comments from firebase
   * @param string id
   */
  getSubComments(id: string): Observable<IComment[]> {
    return this.db.collection<IComment>('comments').doc(id).collection('subs')
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map(action => {
            const data = action.payload.doc.data() as IComment;

            return {
              id: action.payload.doc.id,
              description: data.description,
              date: data.date,
              parentId: data.parentId,
            };
          });
        })
      );
  }

  /**
   * Create comment on firebase
   * @param IComment comment
   */
  addComment(comment: IComment): Observable<IComment> {
    return from(
      this.db.collection('comments').add({
        description: comment.description,
        date: comment.date
      })
    ).pipe(
      map(commentRef => {
        comment.id = commentRef.id;
        return comment;
      })
    );
  }

  /**
   * Create sub comment to the parent comment on firebase
   * @param IComment subComment
   */
  addSubComment(subComment: IComment): Observable<any> {
    return from(
      this.db.collection(`comments/${subComment.parentId}/subs`)
        .add({
          description: subComment.description,
          date: subComment.date,
          parentId: subComment.parentId
      })
    ).pipe(
      map(commentRef => {
        subComment.id = commentRef.id;
        return subComment;
      })
    );
  }

  /**
   * Edit comment on firebase
   * @param IComment comment
   */
  editComment(comment: IComment) {
    return from(
      this.db.doc<IComment>(`comments/${comment.id}`)
        .update(comment)
    );
  }

  /**
   * Edit sub comment on firebase
   * @param IComment subComment
   */
  editSubComment(subComment: IComment) {
    return from(
      this.db.doc<IComment>(`comments/${subComment.parentId}/subs/${subComment.id}`)
        .update(subComment)
    );
  }

  /**
   * Delete comment and his sub comments
   * @param string id
   */
  deleteComment(id: string): Observable<IComment> {
    return this.db.doc<IComment>(`comments/${id}`)
      .get()
      .pipe(
        first(),
        switchMap(commentDoc => {
          if (!commentDoc || !commentDoc.data()) {
            throw new Error('Comment does not found');
          } else {
            return from(
              this.db.doc<IComment>(`comments/${id}`)
                .delete()
            ).pipe(
              map(() => {
                const data = commentDoc.data() as IComment;
                data.id = commentDoc.id;
                return data;
              })
            );
          }
        })
      );
  }

  /**
   * Delete sub comment from firebase
   * @param IComment subComment
   */
  deleteSubComment(subComment: IComment): Observable<void> {
    return from(
      this.db.doc<IComment>(`comments/${subComment.parentId}/subs/${subComment.id}`)
        .delete()
    );
  }

}
