import type { Metric } from 'web-vitals';

type ReportHandler = (metric: Metric) => void;

const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    import('web-vitals').then(
      ({ onCLS, onINP, onLCP, onFCP, onTTFB }) => {
        onCLS(onPerfEntry);
        onINP(onPerfEntry);
        onLCP(onPerfEntry);
        onFCP(onPerfEntry);
        onTTFB(onPerfEntry);
      }
    );
  }
};

export default reportWebVitals;
