import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

interface NoticeModalProps {
  isOpen: boolean;
  closeModal: () => void;
  type?: number; // 0: 巧克力 1: 玩具
  countDown?: number;
}

export default function NoticeModal(props: NoticeModalProps) {
  const { isOpen, closeModal, countDown = 20 } = props;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center bg-black">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden bg-black p-6 text-left align-middle transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-3xl font-medium leading-6 text-white text-center pt-4 pb-7"
                >
                  操作步骤
                </Dialog.Title>
                <div className="mt-2 flex gap-6">
                  <div className="flex-1">
                    <img
                      src="/g1.gif"
                      alt=""
                      className="w-full aspect-square p-3"
                    />
                    <div className="text-center text-xl mt-4 font-medium text-white">
                      左边取出托盘
                    </div>
                  </div>
                  {/* <div className="flex-1">
                    <img
                      src="/step2.png"
                      alt=""
                      className="w-full aspect-square p-12"
                    />
                    <div className="text-center text-xl mt-4 font-bold">
                      右边取出盖子
                    </div>
                  </div> */}
                  <div className="flex-1">
                    <img
                      src="/g2.gif"
                      alt=""
                      className="w-full aspect-square  p-3"
                    />
                    <div className="text-center text-xl mt-4 font-medium text-white">
                      托盘插入底部
                    </div>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <button
                    type="button"
                    className="px-4 py-2 text-lg font-medium text-white/75"
                    onClick={closeModal}
                  >
                    {countDown}秒后自动关闭
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
