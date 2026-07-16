import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BootScreen } from './BootScreen';

describe('BootScreen', () => {
  it('renders boot sequence', () => {
    const onComplete = () => {};
    const { container } = render(<BootScreen onComplete={onComplete} />);
    expect(container.querySelector('[class*="boot"]')).toBeTruthy();
  });
});
