export default function ArticleDetail({ article }) {
  if (!article) {
    return <div className="empty-state">Select an article</div>;
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
