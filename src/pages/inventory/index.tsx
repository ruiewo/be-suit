import jsQR from 'jsqr';
import { Point } from 'jsqr/dist/locator';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

import { Box, Button } from '@mui/material';

import { useErrorDialog } from '../../components/dialog/errorDialog';
import { Loading } from '../../components/loading';
import { Skeleton } from '../../components/skeleton';
import { client } from '../../models/apiClient';
import { convertToMessage, sleep } from '../../modules/util';
import styles from '../../styles/inventory.module.css';
import { NextPageWithLayout } from '../_app';

const Page: NextPageWithLayout = () => {
  const showErrorDialog = useErrorDialog();
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const width = 150;
  const height = 150;
  let isReadQR = false;
  const [codeText, setCodeText] = useState('not read');

  useEffect(() => {
    const context = (canvasRef.current as HTMLCanvasElement).getContext('2d')!;
    (canvasRef.current as HTMLCanvasElement).width = width;
    (canvasRef.current as HTMLCanvasElement).height = height;
    setContext(context);
  }, []);

  const [categoryCodes, setCategoryCodes] = useState({ main: 'PC', sub: ['D'] });

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function load() {
      setIsLoading(true);

      try {
        const [{ equipments, columns: detailColumns, error }] = await Promise.all([
          client.api.equipment.advancedSearch.$post({ body: { categoryCodes: categoryCodes } }),
          sleep(1000),
        ]);

        if (error) {
          showErrorDialog({ title: 'Load Failed.', description: convertToMessage(error) });
          return;
        }
      } catch (error) {
        setIsError(true);
        showErrorDialog({ title: 'Load Failed.', description: `failed to load equipments. ${error}` });
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [categoryCodes]);

  if (isError) return <Skeleton />;

  function startRead() {
    const video = document.createElement('video');

    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then(stream => {
      video.srcObject = stream;
      video.setAttribute('playsinline', 'true');
      video.play();
      requestAnimationFrame(tick);
    });

    function drawLine(begin: Point, end: Point, color: string) {
      context!.beginPath();
      context!.moveTo(begin.x, begin.y);
      context!.lineTo(end.x, end.y);
      context!.lineWidth = 4;
      context!.strokeStyle = color;
      context!.stroke();
    }

    function tick() {
      if (canvasRef.current == null) {
        requestAnimationFrame(tick);
        return;
      }

      if (video.readyState !== video.HAVE_ENOUGH_DATA) {
        requestAnimationFrame(tick);
        return;
      }

      const canvas = canvasRef.current!;
      canvas.hidden = false;
      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;
      context!.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = context!.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      if (code && !isReadQR) {
        // location.href = code.data;

        drawLine(code.location.topLeftCorner, code.location.topRightCorner, '#FF3B58');
        drawLine(code.location.topRightCorner, code.location.bottomRightCorner, '#FF3B58');
        drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, '#FF3B58');
        drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, '#FF3B58');

        setCodeText(code.data);
        isReadQR = true;
      } else {
        requestAnimationFrame(tick);
      }
    }
  }

  return (
    <>
      <Box display="" flexDirection="column" position="relative" width="100%" minHeight={400} height="50vh">
        <textarea value={codeText} style={{ height: 100, width: 300 }} />
        <Button onClick={startRead} disabled={canvasRef == null}>
          読み取り開始
        </Button>
        <canvas ref={canvasRef} className={styles.canvas} />
      </Box>
    </>
  );
};

export default Page;
