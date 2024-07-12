document.addEventListener('DOMContentLoaded', function() {
  // Initialize Mediapipe Hands
  const hands = new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
  });

  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  });

  hands.onResults(onResults);

  // Initialize Camera
  const videoElement = document.createElement('video');
  const camera = new Camera(videoElement, {
    onFrame: async () => {
      await hands.send({ image: videoElement });
    },
    width: 640,
    height: 480
  });
  camera.start();

  // Process Results
  function onResults(results) {
    const handPointsEntity = document.getElementById('hand-points');
    handPointsEntity.innerHTML = ''; // Clear previous points

    if (results.multiHandLandmarks) {
      results.multiHandLandmarks.forEach((landmarks) => {
        landmarks.forEach((landmark, index) => {
          const x = (landmark.x - 0.5) * 2;
          const y = (landmark.y - 0.5) * -2;
          const z = landmark.z * -1;

          // Create a point for each landmark
          const point = document.createElement('a-sphere');
          point.setAttribute('position', `${x} ${y} ${z}`);
          point.setAttribute('radius', '0.01');
          point.setAttribute('color', 'red');
          handPointsEntity.appendChild(point);

          // Place ring on index finger base (landmark 5)
          if (index === 5) {
            const ring = document.createElement('a-ring');
            ring.setAttribute('position', `${x} ${y} ${z}`);
            ring.setAttribute('radius-inner', '0.015');
            ring.setAttribute('radius-outer', '0.02');
            ring.setAttribute('color', 'gold');
            handPointsEntity.appendChild(ring);
          }
        });
      });
    }
  }
});
