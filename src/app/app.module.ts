import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { CommentComponent } from './post/comment/comment.component';
import { PostComponent } from './post/post.component';
import { SubCommentComponent } from './post/comment/sub-comment/sub-comment.component';
import { CommentEditComponent } from './post/comment/comment-edit/comment-edit.component';
import {CommonModule} from '@angular/common';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CommentComponent,
    PostComponent,
    SubCommentComponent,
    CommentEditComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
