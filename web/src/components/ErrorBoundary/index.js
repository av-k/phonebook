import React from 'react';
//
import { StyledWrapper } from 'components/CommonStyledWrapper';
import PT from 'prop-types';

export class ErrorBoundary extends React.Component {
  static propTypes = {
    children: PT.oneOfType([PT.element, PT.array]),
  };

  state = { error: null, errorInfo: null };

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.errorInfo) {
      // Error path
      return (
        <StyledWrapper style={{ 'max-width': '720px' }}>
          <h1>Something went wrong.</h1>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </StyledWrapper>
      );
    }
    // Normally, just render children
    return this.props.children;
  }
}
