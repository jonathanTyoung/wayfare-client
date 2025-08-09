import { Link } from "react-router-dom";

export function PostCard({
  post,
  removePost,
  isOwner = false,
}: {
  post: any;
  removePost?: (id: number) => void;
  isOwner?: boolean;
}) {
  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ 
        borderRadius: '0.75rem', 
        overflow: 'hidden', 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%',
        border: '1px solid #ccc',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Post content */}
        <div style={{ padding: '1.5rem', flexGrow: 1 }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.75rem', lineHeight: '1.25' }}>
            <Link 
              to={`/posts/${post.id}`} 
              style={{ textDecoration: 'none' }}
            >
              {post.title}
            </Link>
          </h2>
          <p style={{ lineHeight: '1.625' }}>
            {post.short_description}
          </p>
        </div>

        {/* Actions for owner */}
        {isOwner && removePost && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            borderTop: '1px solid #ccc', 
            padding: '1rem 1.5rem' 
          }}>
            <Link
              to={`/posts/${post.id}/edit`}
              style={{ textDecoration: 'none', fontWeight: '500', fontSize: '0.875rem' }}
            >
              Edit Post
            </Link>
            <button
              onClick={() => removePost(post.id)}
              style={{ 
                background: 'none', 
                border: 'none', 
                fontWeight: '500', 
                fontSize: '0.875rem', 
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}