import { useState, useRef } from 'react';

export const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [auditData, setAuditData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pipelineStage, setPipelineStage] = useState(-1);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    setAuditData(null);
    setPipelineStage(-1);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
    chunks.current = [];

    mediaRecorder.current.ondataavailable = (e) => chunks.current.push(e.data);
    mediaRecorder.current.onstop = async () => {
      setIsProcessing(true);
      setPipelineStage(0);
      const blob = new Blob(chunks.current, { type: 'audio/webm' });
      
      const formData = new FormData();
      formData.append('audio', blob, 'audio.webm');

      try {
        const response = await fetch('/api/audit', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok || !response.body) {
          const errorResult = await response.json().catch(() => ({}));
          console.error('Backend returned an error. Wait aborted:', errorResult);
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let bufferText = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          bufferText += decoder.decode(value, { stream: true });
          const lines = bufferText.split('\n');
          bufferText = lines.pop() ?? '';

          for (const line of lines) {
            if (!line.trim()) continue;
            try {
              const payload = JSON.parse(line);

              if (payload.type === 'stage' && typeof payload.stage === 'number') {
                setPipelineStage(payload.stage);
              }

              if (payload.type === 'result' && payload.data) {
                setAuditData(payload.data);
              }

              if (payload.type === 'error') {
                console.error('Audit pipeline error:', payload.message);
              }
            } catch (parseError) {
              console.warn('Skipping non-JSON pipeline line:', line, parseError);
            }
          }
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

  return { isRecording, startRecording, stopRecording, auditData, isProcessing, pipelineStage };
};