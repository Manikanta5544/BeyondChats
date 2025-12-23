import ArticleList from '../components/ArticleList';
import ArticleDetail from '../components/ArticleDetail';
import CompareView from '../components/CompareView';
import Loader from '../components/Loader';
import { useArticles } from '../hooks/useArticles';

export default function Home() {
  const { articles, selected, loading, error, loadArticle } = useArticles();

  if (loading && articles.length === 0) return <Loader />;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
        <header className="app-header">
            <h1>BeyondChats Articles</h1>
            <p className="subtitle">
                View original and AI-enhanced articles side by side
            </p>
        </header>
        <div className="layout">

        <aside>
            <ArticleList
            articles={articles}
            onSelect={loadArticle}
            selectedId={selected?.id}
            />
        </aside>

        <main>
            {loading ? (
            <Loader />
            ) : selected?.enhanced_content ? (
            <CompareView article={selected} />
            ) : (
            <ArticleDetail article={selected} />
            )}
        </main>
        </div>
    </div>
  );
}
