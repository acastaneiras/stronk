import '@testing-library/jest-dom/vitest'
import ResizeObserver from 'resize-observer-polyfill';

//Mock ResizeObserver
global.ResizeObserver = ResizeObserver;