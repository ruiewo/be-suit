import jsQR from 'jsqr';
import { Point } from 'jsqr/dist/locator';
import { useEffect, useRef, useState } from 'react';

import { Button, Typography } from '@mui/material';

import { useErrorDialog } from '../../components/dialog/errorDialog';
import { Loading } from '../../components/loading';
import { Skeleton } from '../../components/skeleton';
import { client } from '../../models/apiClient';
import { EquipmentModel } from '../../models/equipmentModel';
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
  const [equipment, setEquipment] = useState<EquipmentModel | null>(null);

  useEffect(() => {
    const context = (canvasRef.current as HTMLCanvasElement).getContext('2d')!;
    (canvasRef.current as HTMLCanvasElement).width = width;
    (canvasRef.current as HTMLCanvasElement).height = height;
    setContext(context);
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function load() {
      setIsLoading(true);

      try {
        const [{ equipment, error }] = await Promise.all([client.api.equipment.code.$post({ body: { code: codeText } }), sleep(1000)]);

        if (error) {
          showErrorDialog({ title: 'Load Failed.', description: convertToMessage(error) });
          return;
        }

        setEquipment(equipment);
      } catch (error) {
        setIsError(true);
        showErrorDialog({ title: 'Load Failed.', description: `failed to load equipments. ${error}` });
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [codeText, showErrorDialog]);

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

      const canvas = canvasRef.current;
      canvas.hidden = false;
      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;
      context!.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = context!.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      if (code && !isReadQR) {
        drawLine(code.location.topLeftCorner, code.location.topRightCorner, '#FF3B58');
        drawLine(code.location.topRightCorner, code.location.bottomRightCorner, '#FF3B58');
        drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, '#FF3B58');
        drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, '#FF3B58');

        // setCodeText(code.data);
        setCodeText('PC-N-00003'); // todo
        isReadQR = true;
      } else {
        requestAnimationFrame(tick);
      }
    }
  }

  return (
    <>
      <Typography component="h1" variant="h4" sx={{ textAlign: 'center' }}>
        棚卸し
      </Typography>
      <div>
        <div>
          <canvas ref={canvasRef} className={styles.canvas} />
        </div>
        <ul>
          <div className={styles.row}>
            <Button onClick={startRead} disabled={canvasRef == null}>
              読み取り開始
            </Button>
          </div>
          <div className={styles.row}>{codeText}</div>

          <Row label="管理コード" detail={equipment?.code ?? ''} />
          <Row label="PC名" detail={(equipment?.details?.pcName as string) ?? ''} />
          <Row label="管理者" detail={equipment?.department ?? ''} />
          <Row label="使用者" detail={equipment?.rentalUserName ?? ''} />
          <Row label="使用場所" detail={equipment?.location ?? ''} />

          <li>
            <Button>詳細</Button>
            <Button>棚卸し</Button>
          </li>
        </ul>
      </div>
    </>
  );
};

function Row({ label, detail }: { label: string; detail: string }) {
  return (
    <div className={styles.row}>
      <span className={styles.label}>{label}</span>
      <span className={styles.detail}>{detail}</span>
    </div>
  );
}

export default Page;
