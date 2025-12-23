export default function CompareView({ article }) {
  return (
    <div>
      <h2>{article.title}</h2>

      <div className="compare-grid">
        <div>
          <h3>Original</h3>
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: article.original_content }}
          />
        </div>

        <div>
          <h3>Enhanced</h3>
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: article.enhanced_content }}
          />
        </div>
      </div>

      {article.reference_urls?.length > 0 && (
        <div className="references">
          <h4>References</h4>
          <ul>
            {article.reference_urls.map((url, i) => (
              <li key={i}>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
