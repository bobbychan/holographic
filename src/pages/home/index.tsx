import { ModelRender } from "@/components/ModelRender";
import NoticeModal from "@/components/NoticeModal";
import { checkOnline, sendPrintRequest } from "@/services/api";
import { cx } from "@/utils/utils";
import { ArcballControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Toast } from "antd-mobile";
import { Suspense, useEffect, useState } from "react";
import { useSocket, useSocketEvent } from "socket.io-react-hook";

const chocolatePrinterSn = "SYOW003F1010A3F0";
const toyPrinterSn = "SYOW003F1011B193";

const chocolateModelData = [
  {
    id: 684897,
    product_attachment_id: 332707,
    name: "皮卡丘",
    url: "/model/a1.stl",
  },
  {
    id: 684873,
    product_attachment_id: 317861,
    name: "手榴弹",
    url: "/model/a2.stl",
  },
  {
    id: 684913,
    product_attachment_id: 330244,
    name: "载人火箭",
    url: "/model/a3.stl",
  },
  {
    id: 684929,
    product_attachment_id: 364241,
    name: "导弹车",
    url: "/model/a4.stl",
  },
  {
    id: 684798,
    product_attachment_id: 337026,
    name: "大象",
    url: "/model/a5.stl",
  },
];

const toyModelData = [
  {
    id: 685021,
    product_attachment_id: 428715,
    name: "剑背龙",
    url: "/model/b1.stl",
  },
  {
    id: 685012,
    product_attachment_id: 428670,
    name: "小马宝莉",
    url: "/model/b2.stl",
  },
  {
    id: 684985,
    product_attachment_id: 428695,
    name: "直升机",
    url: "/model/b3.stl",
  },
  {
    id: 685013,
    product_attachment_id: 428669,
    name: "兔子",
    url: "/model/b4.stl",
  },
];

export default function HomePage() {
  // 0 巧克力 1 玩具
  // 默认玩具打印机
  const [printerType, setPrinterType] = useState(1);
  const [printerSn, setPrinterSn] = useState(toyPrinterSn);
  const [modelData, setModelData] = useState(toyModelData);
  const [index, setIndex] = useState(0);
  const [rotate, setRotate] = useState<"left" | "right">("left");
  const [noticeModalOpen, setNoticeModalOpen] = useState(false);
  const [countDown, setCountDown] = useState(15);

  const { socket, connected, error } = useSocket({ path: location.origin });
  const { lastMessage } = useSocketEvent<string>(socket, "PAJ", {
    onMessage: (message) => console.log(message, "message"),
  });

  useEffect(() => {
    if (printerType === 0) {
      setPrinterSn(chocolatePrinterSn);
      setModelData(chocolateModelData);
    } else {
      setPrinterSn(toyPrinterSn);
      setModelData(toyModelData);
    }
  }, [printerType]);

  useEffect(() => {
    // noticeModalOpen打开后，30秒后自动关闭,并且重置倒计时
    if (noticeModalOpen) {
      setCountDown(30);
      const timer = setInterval(() => {
        setCountDown((prev) => {
          if (prev === 0) {
            setNoticeModalOpen(false);
            clearInterval(timer);
            return 30;
          } else {
            return prev - 1;
          }
        });
      }, 1000);
    }
  }, [noticeModalOpen]);

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
    // 1.检测设备是否在线
    const onlineRes = await checkOnline(printerSn);
    if (onlineRes.is_online === 1 && onlineRes.is_has_haocai === 1) {
      // 2.发送打印请求
      const printRes = await sendPrintRequest({
        sn: printerSn,
        id: modelData[index].id,
        type: 1, // 使用盼打币
        productAttachmentId: modelData[index].product_attachment_id,
      });
      console.log(printRes, "printRes");
    } else if (onlineRes.is_online === 0) {
      Toast.show({
        icon: "fail",
        content: "打印机当前不在线，无法打印",
      });
    } else if (onlineRes.is_has_haocai === 0) {
      Toast.show({
        icon: "fail",
        content: "打印机缺少耗材，无法打印",
      });
    }
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
      <div
        className="absolute top-10 left-8 right-8 mx-auto"
        style={{ width: window.innerHeight }}
      >
        <div className="flex justify-between items-center">
          <button
            className={cx(
              "border border-white px-5 py-2 text-white cursor-pointer opacity-10 hover:opacity-100 transition-opacity"
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
              {printerType === 0 ? "巧克力" : "玩具"}打印 -{" "}
              {modelData[index].name}
            </span>
          </div>
          <button
            className="border border-white px-5 py-2 text-white cursor-pointer opacity-10 hover:opacity-100 transition-opacity"
            onClick={onNext}
          >
            下一个
          </button>
        </div>
      </div>
      <div
        className="absolute bottom-10 left-8 right-8 mx-auto"
        style={{ width: window.innerHeight }}
      >
        <div className="mb-3 text-center text-white">{lastMessage}</div>
        <div className="flex justify-between">
          <div className="flex gap-2">
            <button
              className="border border-white px-8 py-2 text-white cursor-pointer opacity-10 hover:opacity-100 transition-opacity"
              onClick={() => setNoticeModalOpen(true)}
            >
              测试
            </button>
            <button
              className="border border-white px-8 py-2 text-white cursor-pointer opacity-10 hover:opacity-100 transition-opacity"
              onClick={() => setPrinterType((prev) => (prev === 0 ? 1 : 0))}
            >
              切换
            </button>
          </div>
          <div>
            <button
              className="border border-white px-8 py-2 text-white cursor-pointer border-r-0 opacity-0 hover:opacity-100 transition-opacity"
              onClick={() => setRotate("left")}
            >
              左旋转
            </button>
            <button
              className="border border-white px-8 py-2 text-white cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
              onClick={() => setRotate("right")}
            >
              右旋转
            </button>
          </div>
          <button
            className="border border-white px-5 py-2 text-white cursor-pointer opacity-10 hover:opacity-100 transition-opacity"
            onClick={onPrint}
          >
            开始打印
          </button>
        </div>
      </div>

      <NoticeModal
        isOpen={noticeModalOpen}
        type={printerType}
        countDown={countDown}
        closeModal={() => setNoticeModalOpen(false)}
      />
    </div>
  );
}
