// src/lib/knowledgeBase.ts
export const KNOWLEDGE_BASE_ZH = `
# FFM（Flash Fulfillment）知识库

## 入库须知
- 每箱必须张贴箱单；不接受混箱（多SKU需隔离）
- 拒收条件：无入库单、非收货时间、数量不匹配、包装破损、无箱单标注
- 收货时间：周一至周六 09:00-16:00；法定节假日、大促前1天后2天不收货
- 预约到货上架时效：48小时；新品72小时
- 紧急入库请联系商务

## 仓库地址
- AGV：88/171-2, Moo 15, Bang Sao Tong, Samutprakarn 10570
- BST：172-4 Moo16 Bang Sao Thong, Samut Prakan 10570
- LAS：10/9 Srinakarin Road, Moo 16, Bang Kaew, Bang Phli, Samut Prakan 10540
- LAS3：55/94, Moo 15, Bang Sao Thong, Samut Prakarn 10570
- Live-stream：88/73 Moo 23 Sahathai Treasury, Theparak Road, Bang Phli, Samut Prakan 10540
- 退件仓(BPL)：88/25 Moo 23 Sahathai Treasury, Theparak Road, Bang Phli, Samut Prakan 10540

## TikTok 授权问题
- 授权失败：跨境店选错本土入口 → 在平台后台删除旧授权再重新授权
- 一品多仓商品同步失败：在SCM店铺档案勾选"开通一品多仓"（不可撤销）
- 自动同步库存失败：平台SKU被修改，重新建立商品映射

## Shopee 授权问题
- 授权过期重新授权：在Shopee后台撤销旧授权再重新操作
- SIP店铺暂不支持授权：用手工单方式处理
- 同步库存失败(Failed to update stock)：一品多仓平台接口限制，暂时手动修改
- 同步库存失败(Stock should be larger than 80)：参加锁定库存活动，库存必须>80

## Lazada 授权步骤
1. Lazada后台 → 服务市场 → 搜索Flash → FLASH WMS → 仅授权 → 半年 → 授权使用
2. 勾选同意 → 确认 → 订购成功
3. SCM店铺档案 → 授权 → 选国家 → 输邮箱密码 → Submit

## 订单问题
- 订单未进SCM：手动同步 → 发货单 → 新增 → 线上店铺 → 填订单号 → 获取订单
- 日志"订单不属于该仓库"：店铺档案→获取平台仓库→编辑→是否获取该仓订单:是
- 商品异常：平台SKU与SCM条码不一致 → 维护商品映射
- 地址异常：取消"启用卖家自己发货"参数 → 删除异常订单 → 重新同步

## 出库时效
- Shopee：截单16:00，截前当天出库，截后次日出库
- TikTok：截单18:00，截前当天出库，截后次日出库
- Lazada：24小时打包，48小时出库
- 其他/B2B：24小时打包，48小时出库

## 作业时间
- 所有仓库：周一至周日 09:00-18:00（法定节假日除外）
- 非工作时间作业需联系商务报价

## 账单问题
- 仓储费异常：商品档案体积有误或移库导致
- 包材费异常：扫描重复/错误/遗漏
- 不可自备包材：统一使用仓库包材便于管理
- 充值：SCM→结算→我的余额→充值→上传转账截图→财务审核

## 退货流程
- 非本地仓退货(未创建销退单)：仓库登记 → SCM销退登记表认领 → 重新上架
- 非本地仓退货(已创建销退单)：按运单号匹配销退单 → 上架
- 本地仓退货：自动生成销退单，流程同上

## 货权转移
- A货主：库存单据→货权转移单(转出)→新增→填目标货主编码→审核
- B货主：货权转移单(转入)→匹配商品→一键匹配→确认
- 仓库：一键完成

## 赔偿标准
- 仓库货物丢失：按合同免赔额后仓库赔付
- Flash快递丢失：仓库协助沟通；其他快递客户自行联系
- 货物损坏≤2000铢：月度万分之五免赔；>2000铢可购保价险(货值千分之六)
- 头程丢件：服务商合同约定，当前不超过200RMB/件

## 其他
- 海运陆运最低消费：最小1立方，无其他限制；0税率
- 上架费：按件计费
- 尾程物流：平台订单平台指定；非平台订单仓库指定(目前只有FlashExpress)
`.trim();

export function buildSystemPrompt(lang: 'zh' | 'en' | 'th'): string {
  const langInstruction = {
    zh: '请用中文回答。',
    en: 'Please answer in English.',
    th: 'กรุณาตอบเป็นภาษาไทย',
  }[lang];

  return `你是 FFM（Flash Fulfillment）的客服助手。${langInstruction}
只根据以下知识库内容回答问题。如果问题超出知识库范围，请告知用户联系商务人员。
不要编造知识库中没有的信息。

${KNOWLEDGE_BASE_ZH}`;
}
