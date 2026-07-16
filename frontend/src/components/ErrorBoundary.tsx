import { Component } from 'react';

type Props = { children: React.ReactNode };
type State = { hasError: boolean; error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          height: '100vh', background: '#07090d', color: '#e0e0e0', fontFamily: 'monospace', padding: '2rem', textAlign: 'center', gap: '1rem',
        }}>
          <div style={{ fontSize: '3rem' }}>⚠</div>
          <h1 style={{ margin: 0, fontSize: '1.25rem', color: '#ff6b6b' }}>Something went wrong</h1>
          <p style={{ margin: 0, maxWidth: 480, lineHeight: 1.5, fontSize: '0.875rem', color: '#999' }}>
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button onClick={() => window.location.reload()} style={{
            marginTop: '0.5rem', padding: '0.5rem 1.5rem', border: '1px solid #333',
            borderRadius: 4, background: '#1a1a2e', color: '#e0e0e0', cursor: 'pointer', fontSize: '0.875rem',
          }}>
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
