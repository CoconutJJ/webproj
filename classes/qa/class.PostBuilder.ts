import * as Post from './class.Post';

export class PostBuilder {
    
    private title: string; 
    private subtitle: string;
    private body: string;
    private author: string;
    private tags: Array<string>;
    
    constructor() {
        this.title = "";
        this.subtitle = "";
        this.body = "";
        this.author = "";
        this.tags = [];
    }

    public addTitle(title: string) {
        
        this.title = title;
        return this;
    }

    public addSubtitle(subtitle: string) {
        this.subtitle = subtitle;
        return this;
    }

    public addBody(body: string) {
        this.body = body;
        return this;
    }

    public addTag(tag: string) {
        this.tags.push(tag);
        return this;
    }

    public build() {
        return new Post.Post(this.title, this.subtitle, this.author, this.body, this.tags);
    }

}