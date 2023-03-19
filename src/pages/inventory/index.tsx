import jsQR from 'jsqr';
import { Point } from 'jsqr/dist/locator';
import { useEffect, useRef, useState } from 'react';

import { Button, Typography } from '@mui/material';

import { useErrorDialog } from '../../components/dialog/errorDialog';
import { Loading } from '../../components/loading';
import { UncontrolledCommonSelect } from '../../components/select/CommonSelect';
import { Skeleton } from '../../components/skeleton';
import UserSelect from '../../components/userSelect';
import { useDepartments } from '../../hooks/useDepartments';
import { useLocations } from '../../hooks/useLocations';
import { client } from '../../models/apiClient';
import { DepartmentModel } from '../../models/departmentModel';
import { EquipmentWithUser, getEquipmentCode } from '../../models/equipmentModel';
import { LocationModel } from '../../models/locationModel';
import { camera } from '../../modules/camera';
import { convertToMessage, sleep } from '../../modules/util';
import styles from '../../styles/inventory.module.css';
import { NextPageWithLayout } from '../_app';

const Page: NextPageWithLayout = () => {
  const showErrorDialog = useErrorDialog();
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isVideoActive, setIsVideoActive] = useState(false);
  const [codeText, setCodeText] = useState('not read');
  const [equipment, setEquipment] = useState<EquipmentWithUser | null>(null);

  const [departments, setDepartments] = useState<DepartmentModel[]>([]);
  const [locations, setLocations] = useState<LocationModel[]>([]);
  useDepartments(x => setDepartments(x));
  useLocations(x => setLocations(x));

  const departmentItems = departments.map(x => ({ value: x.id, label: x.label }));
  const locationItems = locations.map(x => ({ value: x.id, label: x.label }));

  useEffect(() => {
    setContext((canvasRef.current as HTMLCanvasElement).getContext('2d')!);
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

  function buttonClick() {
    if (isVideoActive) {
      camera.stop();
      setIsVideoActive(false);
    } else {
      camera.start(update);
      setIsVideoActive(true);
    }
  }

  function update(video: HTMLVideoElement) {
    if (canvasRef.current == null || context == null) {
      return false;
    }

    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      return false;
    }

    const canvas = canvasRef.current;
    canvas.height = video.videoHeight;
    canvas.width = video.videoWidth;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert',
    });

    if (code == null) {
      return false;
    }

    drawRect(context, code.location.topLeftCorner, code.location.bottomRightCorner, '#FF3B58');

    // setCodeText(code.data);
    setCodeText('PC-N-00003'); // todo
    setIsVideoActive(false);
    return true;
  }

  return (
    <>
      <Typography component="h1" variant="h4" sx={{ textAlign: 'center' }}>
        棚卸し
      </Typography>
      <div className={styles.canvasArea}>
        <Button className={`${styles.cameraButton} ${isVideoActive ? styles.stopButton : ''}`} onClick={buttonClick}>
          {isVideoActive ? '読み取り終了' : '読み取り開始'}
        </Button>
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>
      <div>
        {equipment == null ? (
          <>not detected</>
        ) : (
          <ul>
            <div className={styles.row}>{codeText}</div>
            <Row label="管理コード" detail={getEquipmentCode(equipment)} />
            <UncontrolledCommonSelect sx={style} name="locationId" label="使用・保管場所" value={equipment.locationId ?? ''} items={locationItems} />
            <UncontrolledCommonSelect sx={style} name="departmentId" label="管理者" value={equipment.departmentId ?? ''} items={departmentItems} />
            <UserSelect name="rentalUser" label="使用者" user={equipment.rentalUser} onChange={user => (equipment.rentalUser = user)} />

            {/* <Row label="管理コード" detail={equipment?.code ?? ''} />
            <Row label="PC名" detail={(equipment?.details?.pcName as string) ?? ''} />
            <Row label="管理者" detail={equipment?.department ?? ''} />
            <Row label="使用者" detail={equipment?.rentalUserName ?? ''} />
            <Row label="使用場所" detail={equipment?.location ?? ''} /> */}

            <li>
              <Button>詳細</Button>
              <Button>棚卸し</Button>
            </li>
          </ul>
        )}
      </div>
    </>
  );
};

const style = { width: '30%', ml: 1, mr: 1, mt: 2, mb: 1 };

function drawLine(context: CanvasRenderingContext2D, begin: Point, end: Point, color: string) {
  context.beginPath();
  context.moveTo(begin.x, begin.y);
  context.lineTo(end.x, end.y);
  context.lineWidth = 4;
  context.strokeStyle = color;
  context.stroke();
}

function drawRect(context: CanvasRenderingContext2D, leftTop: Point, rightBottom: Point, color: string) {
  context.beginPath();
  context.moveTo(leftTop.x, leftTop.y);
  context.lineTo(leftTop.x, rightBottom.y);
  context.lineTo(rightBottom.x, rightBottom.y);
  context.lineTo(rightBottom.x, leftTop.y);
  context.lineTo(leftTop.x, leftTop.y);
  context.lineWidth = 4;
  context.strokeStyle = color;
  context.stroke();
}

function Row({ label, detail }: { label: string; detail: string }) {
  return (
    <div className={styles.row}>
      <span className={styles.label}>{label}</span>
      <span className={styles.detail}>{detail}</span>
    </div>
  );
}

export default Page;
