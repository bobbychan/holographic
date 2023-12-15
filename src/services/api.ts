import { request } from "@/utils/request";

/**
 * 检测打印机在线状态
 */
export async function checkOnline(sn: string) {
  return request<{
    errorCode: number;
    is_has_haocai: number;
    is_online: number;
  }>(`/webapi/scan-print/machine-info?sn=${sn}`);
}

/**
 * 发送打印请求
 */
export async function sendPrintRequest(params: {
  sn: string;
  id: number;
  type: number;
  productAttachmentId: number;
}) {
  return request("/webapi/scan-print/print-pay", {
    method: "POST",
    data: params,
  });
}
