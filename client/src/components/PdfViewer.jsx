import React, { useEffect, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Button, Stack, CircularProgress, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { uid } from 'uid';
import axios from 'axios';
import { axiosWithAuth } from '../utils/customAxios';
import { backendUrl } from '../utils/backendUrl';
import PdfPageViewer from './PdfPageViewer';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const isPdfFile = (file) => {
  if (!file) return false;
  const name = String(file.name || '').toLowerCase();
  return file.type === 'application/pdf' || name.endsWith('.pdf');
};

const PdfViewer = ({ onSaveForm, data, id, disableText, disableButtons, onHandleNext }) => {
  const [formData, setFormData] = useState({
    id: id,
    question: '',
    formMandate: false,
    options: [
      { id: uid(5), value: '' },
    ],
    selectedValue: [{ question: '', answer: '', value: '', index: '' }],
    formType: 'PdfViewerForm',
    pdfURL: '',
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [previewSrc, setPreviewSrc] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      onSaveForm(formData);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [formData]);

  const handleSaveForm = () => {
    onSaveForm(formData);
    onHandleNext();
  };

  useEffect(() => {
    if (data) {
      setFormData((prev) => ({
        ...prev,
        ...data,
        id: data.id || id,
        formType: 'PdfViewerForm',
      }));
    } else {
      setFormData((prev) => ({ ...prev, id }));
    }
  }, [data, id]);

  useEffect(() => {
    if (!formData.pdfURL) {
      setPreviewSrc('');
      setPreviewError('');
      setPreviewLoading(false);
      return undefined;
    }

    let objectUrl = '';
    let cancelled = false;
    const loadPreview = async () => {
      setPreviewLoading(true);
      setPreviewError('');
      try {
        const res = await axios.get(`${backendUrl}/api/s3/view-pdf`, {
          params: { url: formData.pdfURL },
          responseType: 'blob',
        });
        if (cancelled) return;
        const blob = res.data instanceof Blob
          ? res.data
          : new Blob([res.data], { type: 'application/pdf' });
        objectUrl = URL.createObjectURL(blob);
        if (cancelled) {
          URL.revokeObjectURL(objectUrl);
          return;
        }
        setPreviewSrc(objectUrl);
      } catch {
        if (!cancelled) {
          setPreviewSrc('');
          setPreviewError('Could not load the document');
        }
      } finally {
        if (!cancelled) setPreviewLoading(false);
      }
    };
    loadPreview();
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [formData.pdfURL]);

  const handlePdfUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (formData.pdfURL) return;
    if (!isPdfFile(file)) {
      setUploadError('Only .pdf files are allowed');
      return;
    }

    setUploadError('');
    setUploading(true);
    try {
      const awsId = uid(5);
      const fileData = new FormData();
      fileData.append('s3', file);
      const fileResp = await axiosWithAuth.post(`${backendUrl}/api/s3/upload-pdf/${awsId}`, fileData);
      let filesUrl = fileResp.data.files?.[0]?.location;
      if (!filesUrl) {
        const getUrlFromAWS = await axiosWithAuth.get(`${backendUrl}/api/s3/get-pdf/${awsId}`);
        filesUrl = getUrlFromAWS.data.files[0];
      }
      if (!filesUrl) {
        setUploadError('Upload succeeded but no PDF URL was returned');
        return;
      }
      setFormData((prev) => ({ ...prev, pdfURL: filesUrl }));
    } catch (err) {
      setUploadError(err?.response?.data?.message || 'Failed to upload PDF');
    } finally {
      setUploading(false);
    }
  };

  const previewMinHeight = { xs: '70vh', sm: '75vh', md: '80vh' };

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth='xl' sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          height: '100%',
          minHeight: previewMinHeight,
          mt: { xs: 4, md: 0 },
          width: '100%',
          boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.5)',
          borderRadius: 2,
          p: 2,
          overflow: 'hidden',
          border: '2px solid #f0fbf0',
          position: 'relative',
          backgroundColor: '#F4F3F6',
        }}>
          {!disableText && !formData.pdfURL && (
            <Stack spacing={1} sx={{ mb: 2, alignItems: 'flex-start', flexShrink: 0 }}>
              <Button
                component="label"
                variant="contained"
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Upload PDF'}
                <VisuallyHiddenInput
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handlePdfUpload}
                />
              </Button>
              {uploading && <CircularProgress size={24} />}
              {uploadError && (
                <Typography variant="body2" color="error">{uploadError}</Typography>
              )}
            </Stack>
          )}

          {formData.pdfURL ? (
            <Box sx={{
              flexGrow: 1,
              minHeight: { xs: '58vh', sm: '63vh', md: '68vh' },
              borderRadius: 1,
              backgroundColor: '#fff',
              overflow: 'auto',
              display: 'flex',
              alignItems: previewSrc && !previewLoading && !previewError ? 'stretch' : 'center',
              justifyContent: 'center',
            }}>
              {previewLoading && <CircularProgress />}
              {!previewLoading && previewError && (
                <Typography variant="body2" color="error">{previewError}</Typography>
              )}
              {!previewLoading && previewSrc && (
                <PdfPageViewer file={previewSrc} />
              )}
            </Box>
          ) : (
            disableText && (
              <Box sx={{
                flexGrow: 1,
                minHeight: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Typography variant="body2" color="text.secondary">
                  No PDF uploaded
                </Typography>
              </Box>
            )
          )}

          {disableButtons && (
            <Stack spacing={2} direction="row" sx={{ marginTop: '1rem', flexShrink: 0 }}>
              <Button
                variant="contained"
                color="success"
                onClick={handleSaveForm}
              >
                Next Question
              </Button>
            </Stack>
          )}
        </Box>
      </Container>
    </React.Fragment>
  );
};

export default PdfViewer;
