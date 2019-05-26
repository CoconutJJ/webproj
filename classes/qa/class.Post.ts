export class Post {
    private title;
    private subtitle;
    private author;
    private body;
    private tags: Array<string>;

    constructor(title: string, subtitle: string, author: string, body: string, tags: Array<string>) {
        this.title = title;
        this.subtitle = subtitle;
        this.author = author;
        this.body = body;
        this.tags = tags;
    }

    public getTitle() {
        return this.title;
    }

    public getSubTitle() {
        return this.subtitle;
    }

    public getAuthor() {
        return this.author;
    }

    public getBody() {
        return this.body;
    }

    public getTags() {
        return this.tags;
    }

}