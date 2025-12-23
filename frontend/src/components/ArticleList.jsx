export default function ArticleList({ articles, onSelect, selectedId }) {
  if (articles.length === 0) {
    return <div className="empty-state">No articles found</div>;
  }

  return (
    <ul className="article-list">
      {articles.map(article => (
        <li
          key={article.id}
          className={selectedId === article.id ? 'active' : ''}
          onClick={() => onSelect(article.id)}
        >
          <h4>{article.title}</h4>

          <div className="meta">
            <span className={`status-badge ${article.status}`}>
              {article.status}
            </span>

            {article.enhanced_at && (
              <span className="timestamp">
                Enhanced {new Date(article.enhanced_at).toLocaleDateString()}
              </span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
