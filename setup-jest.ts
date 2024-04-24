import "jest-preset-angular/setup-jest";

/**
 * We need to mock the HTMLDocument to return itself in order to use Scoped DOM.
 *
 * Bug: https://github.com/jsdom/jsdom/issues/3179
 * Reference: https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
 */
export const htmlDocFunc = jest.spyOn(
  document.implementation,
  "createHTMLDocument"
);
htmlDocFunc.mockImplementation(() => {
  return document;
});

// Needed for the 'no-scroll' package.
window.scroll = jest.fn();

// Mock ResizeObserver.
window.ResizeObserver = jest.fn(() => {
  return {
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  };
});

window.URL.createObjectURL = jest.fn();
