import React, { useRef, useState, useEffect } from "react";
import Konva from "konva";
import { FaArrowCircleDown } from "react-icons/fa";
import { FaArrowCircleLeft } from "react-icons/fa";
import { FaArrowCircleRight } from "react-icons/fa";
import { FaArrowCircleUp } from "react-icons/fa";


const KonvaCanvas = () => {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const layerRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [stage, setStage] = useState(null);
  const [layer, setLayer] = useState(null);
  const [textNode, setTextNode] = useState(null);
  const [imageNode, setImageNode] = useState(null);
  const [videoNode, setVideoNode] = useState(null);
  const [transformer, setTransformer] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const stage = new Konva.Stage({
      container: canvasRef.current,
      width: width,
      height: height,
    });

    const layer = new Konva.Layer();
    stage.add(layer);

    setStage(stage);
    setLayer(layer);

    const imageObj = new window.Image();
    imageObj.src = "https://konvajs.org/assets/lion.png";
    imageObj.onload = () => {
      const image = new Konva.Image({
        x: 50,
        y: 50,
        image: imageObj,
        width: 200,
        height: 200,
        draggable: true,
        name: "image",
      });

      layer.add(image);
      setImageNode(image);

      image.on("transform", () => {
        image.width(image.width() * image.scaleX());
        image.height(image.height() * image.scaleY());
        image.scaleX(1);
        image.scaleY(1);
      });

      layer.draw();
    };

    const text = new Konva.Text({
      x: 100,
      y: 300,
      text: "Hello Intemello !",
      fontSize: 30,
      draggable: true,
      name: "text",
    });

    layer.add(text);
    setTextNode(text);

    const video = document.createElement("video");
    video.src =
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
    video.crossOrigin = "anonymous";
    video.load();

    video.addEventListener("loadeddata", () => {
      const videoImage = new Konva.Image({
        x: 300,
        y: 50,
        image: video,
        width: 300,
        height: 200,
        draggable: true,
        name: "video",
      });
      const anim = new Konva.Animation(() => {
        layer.batchDraw();
      }, layer);
      anim.start();
      layer.add(videoImage);
      setVideoNode(videoImage);
      layer.draw();

      videoImage.on("click", () => {
        if (video.paused) {
          video.play();
        } else {
          video.pause();
        }
      });

      stage.on("click", (e) => {
        if (e.target === stage) {
          setSelectedNode(null);
          return;
        }
        const node = e.target;
        setSelectedNode(node);
      });
    });

    const tr = new Konva.Transformer({
      padding: 5,
      rotateEnabled: true,
      boundBoxFunc: (oldBox, newBox) => {
        // limit resize
        if (newBox.width < 20 || newBox.height < 20) {
          return oldBox;
        }
        return newBox;
      },
    });

    layer.add(tr);
    setTransformer(tr);

    stage.on("click", (e) => {
      if (e.target === stage) {
        tr.nodes([]);
        layer.draw();
        return;
      }
      const node = e.target;
      tr.nodes([node]);
      layer.draw();
    });

    // layer.draw();
  }, []);

  const playPauseVideo = () => {
    const videoNode = layer.findOne(".video");
    if (videoNode && videoNode.image()) {
      const video = videoNode.image();
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    }
  };

  const stopVideo = () => {
    const videoNode = layer.findOne(".video");
    if (videoNode && videoNode.image()) {
      const video = videoNode.image();
      video.pause();
      video.currentTime = 0;
    }
  };

  const moveNode = (direction) => {
    if (selectedNode) {
      const step = 10; // Change this value to adjust the movement step
      const { x, y } = selectedNode.position();

      switch (direction) {
        case "up":
          selectedNode.position({ x, y: y - step });
          break;
        case "down":
          selectedNode.position({ x, y: y + step });
          break;
        case "left":
          selectedNode.position({ x: x - step, y });
          break;
        case "right":
          selectedNode.position({ x: x + step, y });
          break;
        default:
          break;
      }
    }
  };

  return (
    <div className="relative">
      <div
        ref={canvasRef}
        className="flex flex-col items-center justify-center h-screen bg-gray-200"
      ></div>
      <div className="absolute right-4 bottom-4">
        <button
          onClick={playPauseVideo}
          className="bg-green-500 text-white px-4 py-2 rounded-full mt-4 "
        >
          Play/Pause Video
        </button>
        <button
          onClick={stopVideo}
          className="bg-red-500 text-white px-4 py-2 rounded-full mt-4 ml-4"
        >
          Stop Video
        </button>
        {/* <div className="mt-4">
        <button
          onClick={() => transformer.nodes([textNode])}
          className="mr-2 bg-gray-300 text-black px-4 py-2 rounded"
        >
          Select Text
        </button>
        <button
          onClick={() => transformer.nodes([imageNode])}
          className="mr-2 bg-gray-300 text-black px-4 py-2 rounded"
        >
          Select Image
        </button>
        <button
          onClick={() => transformer.nodes([videoNode])}
          className="mr-2 bg-gray-300 text-black px-4 py-2 rounded"
        >
          Select Video
        </button>
      </div> */}
        <div className="flex justify-center space-x-2 my-4">
          <button
            onClick={() => moveNode("up")}
            className="p-2 bg-orange-500 text-white rounded-full text-xl"
          >
           <FaArrowCircleUp />
          </button>
          <button
            onClick={() => moveNode("down")}
            className="p-2 bg-orange-500 text-white rounded-full text-xl"
          >
          <FaArrowCircleDown />
          </button>
        </div>
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => moveNode("left")}
            className="p-2 bg-orange-500 text-white rounded-full text-xl"
          >
            <FaArrowCircleLeft />
          </button>
          <button
            onClick={() => moveNode("right")}
            className="p-2 bg-orange-500 text-white rounded-full text-xl"
          >
              <FaArrowCircleRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default KonvaCanvas;
