import { formatBrewCount } from './brew-count';

describe('formatBrewCount', () => {
  it('should format brew counts with the provided locale', () => {
    expect(formatBrewCount(12420, 'en-US')).toBe('12,420 brews');
  });

  it('should support other locales when provided', () => {
    expect(formatBrewCount(12420, 'de-DE')).toBe('12.420 brews');
  });
});
