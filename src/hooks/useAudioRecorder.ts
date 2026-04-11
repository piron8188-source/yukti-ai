import { useState, useRef } from 'react';

export const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [auditData, setAuditData] = useState<{ transcript: string, audit: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    setAuditData(null);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
    chunks.current = [];

    mediaRecorder.current.ondataavailable = (e) => chunks.current.push(e.data);
    mediaRecorder.current.onstop = async () => {
      setIsProcessing(true);
      const blob = new Blob(chunks.current, { type: 'audio/webm' });
      
      const formData = new FormData();
      formData.append('audio', blob, 'audio.webm');

      try {
        const response = await fetch('/api/audit', {
          method: 'POST',
          body: formData,
        });
        const result = await response.json();
        if (response.ok) {
          console.log(result);
          setAuditData(result);
        } else {
          console.error("Backend returned an error. Wait aborted:", result);
        }
      } catch (error) {
        console.error("Error sending audio to audit:", error);
      } finally {
        setIsProcessing(false);
      }
    };

    mediaRecorder.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    setIsRecording(false);
  };

  return { isRecording, startRecording, stopRecording, auditData, isProcessing };
};