import { isClientSide } from './util';

export const camera = (() => {
  if (!isClientSide()) {
    return {
      start: () => {},
      stop: () => {},
    };
  }

  const video = document.createElement('video');
  let forceStop = false;

  function stop() {
    forceStop = true;
  }

  function startCamera(update: (video: HTMLVideoElement) => boolean) {
    forceStop = false;

    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then(stream => {
      console.log('stream start');
      video.srcObject = stream;
      video.setAttribute('playsinline', 'true');
      video.play();

      const render = () => {
        if (forceStop) {
          return;
        }

        if (update(video)) {
          stopCamera();
        } else {
          requestAnimationFrame(render);
        }
      };

      requestAnimationFrame(render);
    });
  }

  function stopCamera() {
    (video.srcObject as MediaStream)!.getTracks().forEach(track => {
      track.stop();
    });
    video.srcObject = null;
  }

  return { start: startCamera, stop };
})();
