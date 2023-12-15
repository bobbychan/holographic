import { ModelRender } from "@/components/ModelRender";
import { request } from "@/utils/request";
import { cx } from "@/utils/utils";
import { ArcballControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import { useSocket, useSocketEvent } from "socket.io-react-hook";

const chocolatePrinterSn = "SYOW003F1010A3F0";

// const toyPrinterSn = "SYOW003F1011B193";

const chocolateModelData = [
  {
    id: 1,
    name: "皮卡丘",
    url: "/model/01.stl",
  },
  {
    id: 2,
    name: "手榴弹",
    url: "/model/02.stl",
  },
  {
    id: 3,
    name: "火箭",
    url: "/model/03.stl",
  },
  {
    id: 4,
    name: "火箭车",
    url: "/model/04.stl",
  },
];

export default function HomePage() {
  const [printerSn] = useState(chocolatePrinterSn);
  const [index, setIndex] = useState(0);
  const [rotate, setRotate] = useState<"left" | "right">("left");
  const [modelData] = useState(chocolateModelData);

  const { socket, connected, error } = useSocket({ path: location.origin });
  const { lastMessage } = useSocketEvent<string>(socket, "PAJ", {
    onMessage: (message) => console.log(message, "message"),
  });

  console.log(`连接状态： ${connected}`);
  console.log(`错误信息： ${error}`);

  const onPrev = () => {
    setIndex((prev) => {
      if (prev === 0) {
        return modelData.length - 1;
      } else {
        return prev - 1;
      }
    });
  };

  const onNext = () => {
    setIndex((prev) => {
      if (prev === modelData.length - 1) {
        return 0;
      } else {
        return prev + 1;
      }
    });
  };

  const onPrint = async () => {
    // 检测设备是否在线
    const onlineRes = await request(
      `/webapi/scan-print/machine-info?sn=${printerSn}`
    );
    // if (onlineRes.is_online === 1 && onlineRes.is_has_haocai === 1) {

    // } else if (onlineRes.is_online === 0) {
    //   message("打印机当前不在线，无法打印");
    // } else if (onlineRes.is_has_haocai === 0) {
    //   // 根据filament_rule判断
    //   if (userInfo.filament_rule === 1) {
    //     this.handlePayModel();
    //     message("打印机缺少耗材");
    //   } else if (userInfo.filament_rule === 2) {
    //     message("打印机缺少耗材，无法打印");
    //   }
    // }
    console.log(onlineRes, "onlineRes");
  };

  return (
    <div className="relative w-full h-screen bg-black">
      <Canvas>
        <Suspense fallback={null}>
          <ArcballControls />
          <ambientLight intensity={1} />
          <directionalLight intensity={1} position={[1, 1, 1]} />
          <directionalLight intensity={1} position={[-1, -1, -1]} />
          <ModelRender url={modelData[index].url} rotate={rotate} />
        </Suspense>
      </Canvas>
      <div className="absolute top-8 left-8 right-8">
        <div className="flex justify-between items-center">
          <button
            className={cx(
              "border border-white px-5 py-2 text-white cursor-pointer"
              // {
              //   "opacity-50 pointer-events-none": index === 0,
              // }
            )}
            // disabled={index === 0}
            onClick={onPrev}
          >
            上一个
          </button>
          <div>
            <span className="text-white font-bold text-[1.5rem]">
              巧克力打印
            </span>
          </div>
          <button
            className="border border-white px-5 py-2 text-white cursor-pointer"
            onClick={onNext}
          >
            下一个
          </button>
        </div>
      </div>
      <div className="absolute bottom-8 left-8 right-8">
        <div className="mb-3 text-center text-white">{lastMessage}</div>
        <div className="flex justify-between">
          <div className="w-24"></div>
          <div>
            <button
              className="border border-white px-10 py-2 text-white cursor-pointer border-r-0"
              onClick={() => setRotate("left")}
            >
              左旋转
            </button>
            <button
              className="border border-white px-10 py-2 text-white cursor-pointer"
              onClick={() => setRotate("right")}
            >
              右旋转
            </button>
          </div>
          <button
            className="border border-white px-5 py-2 text-white cursor-pointer"
            onClick={onPrint}
          >
            开始打印
          </button>
        </div>
      </div>
    </div>
  );
}
