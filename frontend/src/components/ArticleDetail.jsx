export default function ArticleDetail({ article }) {
  if (!article) {
    return (
        <div className="empty-state">
            <p><strong>Select an article</strong></p>
            <p>
                Choose an article from the list to view its original
                or enhanced content.
            </p>
        </div>
    );
  }

  return (
    <div className="article-detail">
      <h2>{article.title}</h2>
      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: article.original_content }}
      />
    </div>
  );
}
