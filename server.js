const express = require('express');
const multer = require('multer');
const cv = require('opencv4nodejs');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Define a route to handle the video upload
app.post('/processVideo', upload.single('video'), async (req, res) => {
  try {
    // Get the path of the uploaded video file
    const videoPath = req.file.path;
  
    // Process the video frames
    const frames = await processVideo(videoPath);

    // Generate a unique filename for the processed video
    const processedVideoPath = `processed_${Date.now()}.mp4`;

    // Save the processed video
    await saveVideo(frames, processedVideoPath);

    // Send the path of the processed video back to the client
    res.send(processedVideoPath);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing video');
  }
});

// Function to process video frames
async function processVideo(videoPath) {
  const cap = new cv.VideoCapture(videoPath);
  const frames = [];

  while (true) {
    const frame = cap.read();
    if (frame.empty) {
      break;
    }

    // Process the frame to generate the Delaunay triangle mesh
    const processedFrame = processFrame(frame);

    // Add the processed frame to the frames array
    frames.push(processedFrame);
  }

  cap.release();

  return frames;
}

// Function to process a single frame
function processFrame(frame) {
  // Add your code here to perform face detection and generate the Delaunay triangle mesh on the face
  // You can use OpenCV functions or other computer vision libraries for face detection and Delaunay triangulation

  return frame; // Return the processed frame
}

// Function to save the processed video
async function saveVideo(frames, outputPath) {
  const writer = new cv.VideoWriter(outputPath, 'mp4', 25, new cv.Size(frames[0].cols, frames[0].rows), true);

  for (const frame of frames) {
    writer.write(frame);
  }

  writer.release();
}

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
