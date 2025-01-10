import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map, filter } from "rxjs/operators"

import { Post } from "./post.model";

@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPosts() {
    this.http
      .get<{ message: string; posts: Post[] }>(
        "http://localhost:3000/api/posts"
      )
      .pipe(
        map(postsData => {
          return postsData.posts.map( post => {
            return {
              id: post['_id'],
              title: post.title,
              content: post.content
            }
          })
        })
      )
      .subscribe(transformedData => {
        this.posts = transformedData;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content };
    this.http
      .post<{ message: string }>("http://localhost:3000/api/posts", post)
      .subscribe(responseData => {
        console.log(responseData.message);
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }

  deletePost(post: Post) {
   return this.http
      .delete<{ message: string }>("http://localhost:3000/api/posts/" + post.id )
      .subscribe(responseData => {
        this.posts = this.posts.filter(data => data.id != post.id);
        this.postsUpdated.next([...this.posts]);
      });
  }
}
