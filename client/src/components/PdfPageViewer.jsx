import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

const PdfPageViewer = ({ file }) => {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [numPages, setNumPages] = useState(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    const updateWidth = () => {
      const next = Math.floor(el.clientWidth);
      if (next > 0) setWidth(next);
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setNumPages(null);
    setLoadError(false);
  }, [file]);

  return (
    <Box
      ref={containerRef}
      sx={{
        width: '100%',
        height: '100%',
        minHeight: { xs: '58vh', sm: '63vh', md: '68vh' },
        overflow: 'auto',
        backgroundColor: '#fff',
      }}
    >
      <Document
        file={file}
        loading={(
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'inherit', py: 4 }}>
            <CircularProgress />
          </Box>
        )}
        error={(
          <Typography variant="body2" color="error" sx={{ p: 2 }}>
            Could not load the document
          </Typography>
        )}
        onLoadSuccess={({ numPages: nextNumPages }) => {
          setNumPages(nextNumPages);
          setLoadError(false);
        }}
        onLoadError={() => {
          setNumPages(null);
          setLoadError(true);
        }}
      >
        {!loadError && numPages
          ? Array.from({ length: numPages }, (_, index) => (
            <Page
              key={`page-${index + 1}`}
              pageNumber={index + 1}
              width={width || undefined}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          ))
          : null}
      </Document>
    </Box>
  );
};

export default PdfPageViewer;
